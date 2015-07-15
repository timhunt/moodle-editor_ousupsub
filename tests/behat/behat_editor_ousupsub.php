<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * ousupsub custom steps definitions.
 *
 * @package   editor_ousupsub
 * @category  test
 * @copyright 2015 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.
use Behat\Mink\Exception\ExpectationException as ExpectationException;

/**
 * Steps definitions to deal with the ousupsub text editor
 *
 * @copyright 2015 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_editor_ousupsub extends behat_base {

    /**
     * Opens the stand-alone test page.
     *
     * @Given /^I am on the integrated "(sup|sub|both)" editor test page$/
     */
    public function i_am_on_integrated_test_page($type) {
        $this->getSession()->visit($this->locate_path(
                '/lib/editor/ousupsub/tests/fixtures/editortestpage.php?type=' . $type));
    }

    /**
     * Opens the stand-alone test page.
     *
     * @Given /^I am on the stand-alone supsub editor test page$/
     */
    public function i_am_on_standalone_test_page() {
        $this->getSession()->visit($this->locate_path('/lib/editor/ousupsub/standalone/index.html'));
    }

    /**
     * Select the text in an ousupsub field.
     *
     * @Given /^I select the text in the "([^"]*)" ousupsub editor$/
     * @throws ElementNotFoundException Thrown by behat_base::find
     * @param string $field
     * @return void
     */
    public function select_the_text_in_the_ousupsub_editor($fieldlocator) {
        if (!$this->running_javascript()) {
            throw new coding_exception('Selecting text requires javascript.');
        }
        // We delegate to behat_form_field class, it will
        // guess the type properly.
        $field = behat_field_manager::get_form_field_from_label($fieldlocator, $this);

        if (!method_exists($field, 'select_text')) {
            throw new coding_exception('Field does not support the select_text function.');
        }
        $field->select_text();
    }

    /**
     * Check the text in an ousupsub field.
     *
     * @Given /^I should see "([^"]*)" in the "([^"]*)" ousupsub editor$/
     * @throws ElementNotFoundException Thrown by behat_base::find
     * @param string $text
     * @param string $field
     * @return void
     */
    public function should_see_in_the_ousupsub_editor($text, $fieldlocator) {
        if (!$this->running_javascript()) {
            throw new coding_exception('Selecting text requires javascript.');
        }
        // We delegate to behat_form_field class, it will
        // guess the type properly.
        $field = behat_field_manager::get_form_field_from_label($fieldlocator, $this);

        if (!method_exists($field, 'get_value')) {
            throw new coding_exception('Field does not support the get_value function.');
        }

        if (!$field->matches($text)) {
            throw new ExpectationException("The field '" . $fieldlocator .
                    "' does not contain the text '" . $text . "'. It contains '" . $field->get_value() . "'.", $this->getSession());
        }
    }

    /**
     * Set the contents of a stand-alone supsub field.
     *
     * @Given /^I set the "([^"]*)" stand-alone ousupsub editor to "([^"]*)"$/
     * @throws ElementNotFoundException Thrown by behat_base::find
     * @param string $label the field label.
     * @param string $text the text to insert into the field.
     */
    public function i_set_the_standalone_ousupsub_editor_to($label, $text) {
        if (!$this->running_javascript()) {
            throw new coding_exception('Setting text requires javascript.');
        }

        // We delegate to behat_form_field class, which thinks this is an (Atto) editor.
        $field = $this->find_field($label);

        // Unfortunately, Atto uses Y to set the field value, which we don't have with
        // our nicely encapsulated JavaScript, so do it manually.
        $id = $field->getAttribute('id');
        $js = 'editor_ousupsub.getEditor("' . $id . '").editor.setHTML("' . $text . '");';
        $this->getSession()->executeScript($js);
    }

    /**
     * Set the given range in a stand-alone ousupsub field.
     *
     * @Given /^I select the range "([^"]*)" in the "([^"]*)" ousupsub editor$/
     * @throws ElementNotFoundException Thrown by behat_base::find
     * @param string $text
     * @param string $field
     */
    public function select_range_in_the_ousupsub_editor($range, $fieldlocator) {
        // NodeElement.keyPress simply doesn't work.
        if (!$this->running_javascript()) {
            throw new coding_exception('Selecting text requires javascript.');
        }
        // We delegate to behat_form_field class, it will
        // guess the type properly.
        $field = behat_field_manager::get_form_field_from_label($fieldlocator, $this);

        if (!method_exists($field, 'get_value')) {
            throw new coding_exception('Field does not support the get_value function.');
        }

        $editorid = $this->find_field($fieldlocator)->getAttribute('id');

        // Get query values for the range.
        list($startquery, $startoffset, $endquery, $endoffset) = explode(",", $range);
        $js = '
    function getNode(editor, query, node) {
        if (query !== "" && !isNaN(query)) {
            node = editor.childNodes[query];
        } else {
            node = query ? editor.querySelector(query) : editor;
            node = node.firstChild;
        }
        return node;
    }
    function RangySelectTextBehat() {
        var id = "'.$editorid.'", startquery = '.$startquery.', startoffset = '.$startoffset.',
            endquery  = '.$endquery.', endoffset = '.$endoffset.';
        var e = document.getElementById(id + "editable"),
            r = rangy.createRange();

        e.focus();
        if(startquery || startoffset || endquery || endoffset) {
            // Set defaults for testing.
            startoffset = startoffset ? startoffset : 0;
            endoffset = endoffset ? endoffset : 0;

            // Find the text nodes from the Start/end queries or default to the editor node.
            var startnode, endnode;
            startnode = getNode(e, startquery, startoffset);
            endnode = getNode(e, endquery, endoffset);
            r.setStart(startnode, startoffset);
            r.setEnd(endnode, endoffset);
        } else {
            r.selectNodeContents(e.firstChild);
        }
        var s = rangy.getSelection();
        s.setSingleRange(r);
        if (typeof editor_ousupsub !== "undefined") {
            // For testing standalone.
            editor_ousupsub.getEditor(id)._selections = [r];
        } else {
            // For testing in Moodle.
            YUI().use("moodle-editor_ousupsub-editor", function(Y) {
                Y.M.editor_ousupsub.getEditor(id)._selections = [r];
            });
        }
    }
    RangySelectTextBehat();';
        $this->getSession()->executeScript($js);
    }

    /**
     * Press a key(s) a stand-alone ousupsub field.
     *
     * @Given /^I press the key "([^"]*)" in the "([^"]*)" ousupsub editor$/
     * @throws ElementNotFoundException Thrown by behat_base::find
     * @param string $keys
     * @param string $field
     */
    public function press_key_in_the_ousupsub_editor($keys, $fieldlocator) {
        // NodeElement.keyPress simply doesn't work.
        if (!$this->running_javascript()) {
            throw new coding_exception('Selecting text requires javascript.');
        }
        // We delegate to behat_form_field class, it will
        // guess the type properly.
        $field = behat_field_manager::get_form_field_from_label($fieldlocator, $this);

        if (!method_exists($field, 'get_value')) {
            throw new coding_exception('Field does not support the get_value function.');
        }

        $editorid = $this->find_field($fieldlocator)->getAttribute('id');

        // Get query values for the range.
        $js = '
    function TriggerKeyPressBehat() {
    // http://www.wfimc.org/public/js/yui/3.4.1/docs/event/simulate.html
    YUI().use(\'node-event-simulate\', function(Y) {
        var id = "'.$editorid.'";
        var node = Y.one("#" + id + "editable");

        node.focus();
        var keyEvent = "keypress";
        if (Y.UA.webkit || Y.UA.ie) {
            keyEvent = "keydown";
        }
        // Key code (up arrow) for the keyboard shortcut which triggers this button:
        var keys =  ['.$keys.'];
        for(var i=0; i<keys.length;i++) {
            node.simulate(keyEvent, { charCode: keys[i] });
        }
    });
    }
    TriggerKeyPressBehat();';
        $this->getSession()->executeScript($js);
    }
}
