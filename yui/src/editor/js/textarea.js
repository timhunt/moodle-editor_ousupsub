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
 * @module moodle-editor_ousupsub-editor
 * @submodule textarea
 */

/**
 * Textarea functions for the ousupsub editor.
 *
 * See {{#crossLink "M.editor_ousupsub.Editor"}}{{/crossLink}} for details.
 *
 * @namespace M.editor_ousupsub
 * @class EditorTextArea
 */

function EditorTextArea() {}

EditorTextArea.ATTRS = {
};

EditorTextArea.prototype = {

    /**
     * Return the appropriate empty content value for the current browser.
     *
     * Different browsers use a different content when they are empty and
     * we must set this reliable across the board.
     *
     * @method _getEmptyContent
     * @return String The content to use representing no user-provided content
     * @private
     */
    _getEmptyContent: function() {
        if (Y.UA.ie && Y.UA.ie < 10) {
            return '';
        } else {
            return '';
        }
    },

    /**
     * Copy and clean the text from the textarea into the contenteditable div.
     *
     * If the text is empty, provide a default paragraph tag to hold the content.
     *
     * @method updateFromTextArea
     * @chainable
     */
    updateFromTextArea: function() {
        // Clear it first.
        this.editor.setHTML('');

        // Copy text to editable div.
        this.editor.append(this.textarea.get('value'));

        // Clean it.
        this.cleanEditorHTML();

        // Insert a paragraph in the empty contenteditable div.
        if (this.editor.getHTML() === '') {
            this.editor.setHTML(this._getEmptyContent());
        }
    },

    /**
     * Copy the text from the contenteditable to the textarea which it replaced.
     *
     * @method updateOriginal
     * @chainable
     */
    updateOriginal : function() {
        // Get the previous and current value to compare them.
        var oldValue = this.textarea.get('value'),
            newValue = this.getCleanHTML();

        if (newValue === "" && this.isActive()) {
            // The content was entirely empty so get the empty content placeholder.
            newValue = this._getEmptyContent();
        }

        // Only call this when there has been an actual change to reduce processing.
        if (oldValue !== newValue) {
            // Insert the cleaned content.
            this.textarea.set('value', newValue);

            // Trigger handlers for this action.
            this.fire('change');
        }

        return this;
    },

    /**
     * Set up the watchers for textarea navigation.
     *
     * @method setupTextareaNavigation
     * @chainable
     */
    setupTextareaNavigation: function() {
//        return;
        // Listen for Arrow down, underscore, hat (^) and Up Arrow  keys.
        this._registerEventHandle(this._wrapper.delegate('key',
                this.textareaKeyboardNavigation,
                'down:40,95',
                '.' + CSS.CONTENT,
                this));
        this._registerEventHandle(this._wrapper.delegate('focus',
                function(e) {
                    this._setTabFocus(e.currentTarget);
                }, '.' + CSS.CONTENT , this));

        this._registerEventHandle(this._wrapper.delegate('key',
                this.textareaKeyboardNavigation,
                'down:38,94',
                '.' + CSS.CONTENT,
                this));
        console.log('setup textarea keyboard navigation');

        return this;
    },

    /**
     * Implement arrow key navigation for the buttons in the toolbar.
     *
     * @method toolbarKeyboardNavigation
     * @param {EventFacade} e - the keyboard event.
     */
    textareaKeyboardNavigation: function(e) {

        // Moving left or right ignore.
//        if (e.keyCode === 37 || e.keyCode === 39) {
//          return;;
//      }
        // Prevent the default browser behaviour.
        e.preventDefault();
        
        // From editor-plugins_buttons::callbackWrapper().
        if (!(YUI.Env.UA.android || this.isActive())) {
            // We must not focus for Android here, even if the editor is not active because the keyboard auto-completion
            // changes the cursor position.
            // If we save that change, then when we restore the change later we get put in the wrong place.
            // Android is fine to save the selection without the editor being in focus.
            this.focus();
        }

        // Save the selection.
//        this.saveSelection();
//
//        // Restore selection before making changes.
//        this.restoreSelection();
        
        var command = '', type = 1;
        
        // Cross browser event object.
        var evt = window.event || e;
        var code =  evt.keyCode ? evt.keyCode : evt.charCode;
        // Call superscript.
        if ((code === 38) || (code === 94)) {
            command = 'superscript';
        // Call subscript.
        } else if ((code === 40) || (code === 95)) {
            command = 'subscript';
        }

       
        // On cursor moves we loops through the buttons.
//        var buttons = this.toolbar.all('button'),
//            direction = 1,
//            button,
//            current = e.target.ancestor('button', true);
//
//        if (e.keyCode === 37) {
//            // Moving left so reverse the direction.
//            direction = -1;
//        }
        
        console.log('setup textareaKeyboardNavigation');
        this._applyTextCommand(command, type);

//        button = this._findFirstFocusable(buttons, current, direction);
//        if (button) {
//            button.focus();
//            this._setTabFocus(button);
//        } else {
//            Y.log("Unable to find a button to focus on", 'debug', LOGNAME);
//        }
    },

    /**
     * 
     */
    _handle_key_press: function() {
        var type = 0;
        var keyEvent = 'press';
            if (Y.UA.webkit || Y.UA.ie) {
            keyEvent = 'down';
        }
        this.editor.on('key' + keyEvent, function(e) {
            //Cross browser event object.
            var evt = window.event || e;
            var code =  evt.keyCode ? evt.keyCode : evt.charCode;
            // Call superscript.
            if ((code === 38) || (code === 94)) {
                evt.preventDefault();
                type = 1;
                this._applyTextCommand(type);
            // Call subscript.
            } else if ((code === 40) || (code === 95)) {
                evt.preventDefault();
                type = -1;
                this._applyTextCommand(type);
            }
            // Pass on the type.
            //this._applySupSub(type);
            
//            this._buttonHandlers.push(this.editor.delegate('key', keyEvent, code, CSS.EDITORWRAPPER, this), this);
        }, this);
    },

    /**
     * Prevent carriage return to produce a new line.
     */
     _preventEnter: function() {
         var keyEvent = 'keypress';
         if (Y.UA.webkit || Y.UA.ie) {
             keyEvent = 'keydown';
         }
         this.editor.on(keyEvent, function(e) {
             //Cross browser event object.
             var evt = window.event || e;
             if (evt.keyCode === 13) { // Enter.
                 // do nothing.
                 evt.preventDefault();
             }
         }, this);
     },
};

Y.Base.mix(Y.M.editor_ousupsub.Editor, [EditorTextArea]);
