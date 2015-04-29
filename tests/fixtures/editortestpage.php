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
 * This page just displayes the ousupsub editor so it can be tested.
 *
 * @package   editor_ousupsub
 * @category  test
 * @copyright 2015 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . '/../../../../../config.php');

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/lib/editor/ousupsub/tests/fixtures/editortestpage.php');

$type = optional_param('type', 'both', PARAM_ALPHA);

if (!in_array($type, array('both', 'sub', 'sup'))) {
    throw new coding_exception("'type' in the URL must be 'both', 'sub', or 'sup'.");
}

$editor = get_texteditor('ousupsub');

$PAGE->set_title('Test superscript/subscript editor');
$PAGE->set_heading('Test superscript/subscript editor');

echo $OUTPUT->header();

echo html_writer::label('New input:', 'supsub') . ' ';
echo html_writer::tag('textarea', 'Normal<sup>sup</sup><sub>sub</sub>',
        array('name' => 'supsub', 'id' => 'supsub', 'rows' => 2, 'cols' => 20));
$editor->use_editor('supsub', array('supsub' => $type));

echo '<p><label for="textarea">Plain input</label> <textarea id="textarea" rows="2" cols="20">Normal</textarea></p>';

echo '<p><label for="plain">Plain input</label> <input id="plain" type="text" value="Normal" size="20"></p>';

$editor = get_texteditor('supsub');
echo html_writer::label('Old input', 'oldsupsub') . ' ';
echo html_writer::tag('textarea', 'Normal<sup>sup</sup><sub>sub</sub>',
        array('name' => 'oldsupsub', 'id' => 'oldsupsub', 'rows' => 2, 'cols' => 20));
$editor->use_editor('oldsupsub', array('supsub' => $type));


$editor = get_texteditor('ousupsub');
echo html_writer::label('New input:', 'supsub40') . ' ';
echo html_writer::tag('textarea', 'Normal<sup>sup</sup><sub>sub</sub>',
        array('name' => 'supsub40', 'id' => 'supsub40', 'rows' => 2, 'cols' => 40));
$editor->use_editor('supsub40', array('supsub' => $type));

echo '<p><label for="textarea">Plain input</label> <textarea id="textarea" rows="2" cols="40">Normal</textarea></p>';

echo '<p><label for="plain">Plain input</label> <input id="plain" type="text" value="Normal" size="40"></p>';

$editor = get_texteditor('supsub');
echo html_writer::label('Old input', 'oldsupsub40') . ' ';
echo html_writer::tag('textarea', 'Normal<sup>sup</sup><sub>sub</sub>',
        array('name' => 'oldsupsub40', 'id' => 'oldsupsub40', 'rows' => 2, 'cols' => 40));
$editor->use_editor('oldsupsub40', array('supsub' => $type));

echo $OUTPUT->footer();

