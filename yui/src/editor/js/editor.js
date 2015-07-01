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
 * The ousupsub WYSIWG pluggable editor, written for Moodle.
 *
 * @module     moodle-editor_ousupsub-editor
 * @package    editor_ousupsub
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @main       moodle-editor_ousupsub-editor
 */

/**
 * @module moodle-editor_ousupsub-editor
 * @submodule editor-base
 */

var LOGNAME = 'moodle-editor_ousupsub-editor';
var CSS = {
        CONTENT: 'editor_ousupsub_content',
        CONTENTWRAPPER: 'editor_ousupsub_content_wrap',
        EDITORWRAPPER: '.editor_ousupsub_content',
        TOOLBAR: 'editor_ousupsub_toolbar',
        WRAPPER: 'editor_ousupsub',
        HIGHLIGHT: 'highlight'
    };

/**
 * The ousupsub editor for Moodle.
 *
 * @namespace M.editor_ousupsub
 * @class Editor
 * @constructor
 * @uses M.editor_ousupsub.EditorClean
 * @uses M.editor_ousupsub.EditorSelection
 * @uses M.editor_ousupsub.EditorStyling
 * @uses M.editor_ousupsub.EditorTextArea
 * @uses M.editor_ousupsub.EditorToolbar
 * @uses M.editor_ousupsub.EditorToolbarNav
 */

function Editor() {
    Editor.superclass.constructor.apply(this, arguments);
}

Y.extend(Editor, Y.Base, {

    /**
     * List of known block level tags.
     * Taken from "https://developer.mozilla.org/en-US/docs/HTML/Block-level_elements".
     *
     * @property BLOCK_TAGS
     * @type {Array}
     */
    BLOCK_TAGS : [
        'address',
        'article',
        'aside',
        'audio',
        'blockquote',
        'canvas',
        'dd',
        'div',
        'dl',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'hgroup',
        'hr',
        'noscript',
        'ol',
        'output',
        'p',
        'pre',
        'section',
        'table',
        'tfoot',
        'ul',
        'video'
    ],

    PLACEHOLDER_CLASS: 'ousupsub-tmp-class',
    ALL_NODES_SELECTOR: '[style],font[face]',
    FONT_FAMILY: 'fontFamily',

    /**
     * The wrapper containing the editor.
     *
     * @property _wrapper
     * @type Node
     * @private
     */
    _wrapper: null,

    /**
     * A reference to the content editable Node.
     *
     * @property editor
     * @type Node
     */
    editor: null,

    /**
     * A reference to the toolbar Node.
     *
     * @property toolbar
     * @type Node
     */
    toolbar: null,

    /**
     * A reference to the original text area.
     *
     * @property textarea
     * @type Node
     */
    textarea: null,

    /**
     * A reference to the label associated with the original text area.
     *
     * @property textareaLabel
     * @type Node
     */
    textareaLabel: null,

    /**
     * A reference to the list of plugins.
     *
     * @property plugins
     * @type object
     */
    plugins: null,

    /**
     * Event Handles to clear on editor destruction.
     *
     * @property _eventHandles
     * @private
     */
    _eventHandles: null,

    initializer: function() {
        // Note - it is not safe to use a CSS selector like '#' + elementid because the id
        // may have colons in it - e.g.  quiz.
        this.textarea = Y.one(document.getElementById(this.get('elementid')));

        if (!this.textarea) {
            // No text area found.
            Y.log('Text area not found - unable to setup editor for ' + this.get('elementid'),
                    'error', LOGNAME);
            return;
        }

        // Add the editor to the manager.
        YUI.M.editor_ousupsub.addEditorReference(this.get('elementid'), this);

        this._eventHandles = [];

        this._wrapper = Y.Node.create('<div class="' + CSS.WRAPPER + '" />');
        this.editor = Y.Node.create('<div id="' + this.get('elementid') + 'editable" ' +
                'contenteditable="true" ' +
                'autocapitalize="none" ' +
                'autocorrect="off" ' +
                'role="textbox" ' +
                'spellcheck="false" ' +
                'aria-live="off" ' +
                'class="' + CSS.CONTENT + '" />');

        // Add a labelled-by attribute to the contenteditable.
        this.textareaLabel = Y.one('[for="' + this.get('elementid') + '"]');
        if (this.textareaLabel) {
            this.textareaLabel.generateID();
            this.editor.setAttribute('aria-labelledby', this.textareaLabel.get("id"));
        }

        // Add everything to the wrapper.
        this.setupToolbar();

        // Editable content wrapper.
        var content = Y.Node.create('<div class="' + CSS.CONTENTWRAPPER + '" />');
        content.appendChild(this.editor);
        this._wrapper.appendChild(content);

        // Set the visible width and height.
        var width = (this.textarea.getAttribute('cols') * 6 + 41) + 'px';
        this.editor.setStyle('width', width);
        this.editor.setStyle('minWidth', width);
        this.editor.setStyle('maxWidth', width);

        var rows = this.textarea.getAttribute('rows');
        var height = (rows * 6 + 13) + 'px';
        this.editor.setStyle('height', height);
        this.editor.setStyle('minHeight', height);
        this.editor.setStyle('maxHeight', height);

        // IE needs the editor wrapper height to be set too. It include 4px of padding.
        height = (rows * 6 + 17) + 'px';
        content.setStyle('height', height);
        content.setStyle('minHeight', height);
        content.setStyle('maxHeight', height);

        // Disable odd inline CSS styles.
        this.disableCssStyling();

        // Use paragraphs not divs.
        if (document.queryCommandSupported('DefaultParagraphSeparator')) {
            document.execCommand('DefaultParagraphSeparator', false, 'p');
        }

        // Add the toolbar and editable zone to the page.
        this.textarea.get('parentNode').insert(this._wrapper, this.textarea);

        // Hide the old textarea.
        this.textarea.hide();

        // Copy the text to the contenteditable div.
        this.updateFromTextArea();

        // Add keyboard navigation for the textarea.
        this.setupTextareaNavigation();

        // Prevent carriage return to produce a new line.
        this._preventEnter();

        // Publish the events that are defined by this editor.
        this.publishEvents();

        // Add handling for saving and restoring selections on cursor/focus changes.
        this.setupSelectionWatchers();

        // Add polling to update the textarea periodically when typing long content.
        this.setupAutomaticPolling();

        // Setup plugins.
        this.setupPlugins();
    },

    destructor: function() {
        // Destroy each of the plugins - they may have destruction phases.
        Y.Array.each(this.plugins, function(item, key) {
            item.destroy();
            this.plugins[key] = undefined;
        }, this);

        // Clear any event handles we created.
        new Y.EventHandle(this._eventHandles).detach();

        // Return the editor back to it's original state.
        this.textarea.show();
        this._wrapper.remove(true);

        // Finally remove this reference from the manager.
        YUI.M.editor_ousupsub.removeEditorReference(this.get('elementid'), this);
    },

    /**
     * Focus on the editable area for this editor.
     *
     * @method focus
     * @chainable
     */
    focus: function() {
        this.editor.focus();
        return this;
    },

    /**
     * Publish events for this editor instance.
     *
     * @method publishEvents
     * @private
     * @chainable
     */
    publishEvents: function() {
        /**
         * Fired when changes are made within the editor.
         *
         * @event change
         */
        this.publish('change', {
            broadcast: true,
            preventable: true
        });

        /**
         * Fired when all plugins have completed loading.
         *
         * @event pluginsloaded
         */
        this.publish('pluginsloaded', {
            fireOnce: true
        });

        this.publish('ousupsub:selectionchanged', {
            prefix: 'ousupsub'
        });

        return this;
    },

    /**
     * Set up automated polling of the text area to update the textarea.
     *
     * @method setupAutomaticPolling
     * @chainable
     */
    setupAutomaticPolling: function() {
        this._registerEventHandle(this.editor.on(['keyup', 'cut'], this.updateOriginal, this));
        this._registerEventHandle(this.editor.on('paste', this.pasteCleanup, this));

        // Call this.updateOriginal after dropped content has been processed.
        this._registerEventHandle(this.editor.on('drop', this.updateOriginalDelayed, this));

        return this;
    },

    /**
     * Calls updateOriginal on a short timer to allow native event handlers to run first.
     *
     * @method updateOriginalDelayed
     * @chainable
     */
    updateOriginalDelayed: function() {
        setTimeout(Y.bind(this.updateOriginal, this), 0);

        return this;
    },

    setupPlugins: function() {
        // Clear the list of plugins.
        this.plugins = {};

        var plugins = this.get('plugins');

        var groupIndex,
            group,
            pluginIndex,
            plugin;

        for (groupIndex in plugins) {
            group = plugins[groupIndex];
            if (!group.plugins) {
                // No plugins in this group - skip it.
                continue;
            }
            for (pluginIndex in group.plugins) {
                plugin = group.plugins[pluginIndex];
                if (plugin.name === 'superscript') {
                    this.plugins.superscript = new Y.M.editor_ousupsub.EditorPlugin({
                        name: 'superscript',
                        group: group.group,
                        editor: this.editor,
                        toolbar: this.toolbar,
                        host: this,
                        exec: 'superscript',
                        tags: 'sup',
                        // Key code (up arrow) for the keyboard shortcut which triggers this button:
                        // Up arrow should be 38 but doesn't register and is handled elsewhere.
                        keys: ['94'],
                        icon: 'e/superscript'
                    });
                } else if (plugin.name === 'subscript') {
                    this.plugins.subscript = new Y.M.editor_ousupsub.EditorPlugin({
                        name: 'subscript',
                        group: group.group,
                        editor: this.editor,
                        toolbar: this.toolbar,
                        host: this,
                        exec: 'subscript',
                        tags: 'sub',
                        // Key codes (underscore) for the keyboard shortcut which triggers this button:
                        // Down arrow should be 40 but doesn't register.
                        keys: ['95'],
                        icon: 'e/subscript'
                    });
                }
            }
        }

        // Some plugins need to perform actions once all plugins have loaded.
        this.fire('pluginsloaded');

        return this;
    },

    enablePlugins: function(plugin) {
        this._setPluginState(true, plugin);
    },

    disablePlugins: function(plugin) {
        this._setPluginState(false, plugin);
    },

    _setPluginState: function(enable, plugin) {
        var target = 'disableButtons';
        if (enable) {
            target = 'enableButtons';
        }

        if (plugin) {
            this.plugins[plugin][target]();
        } else {
            Y.Object.each(this.plugins, function(currentPlugin) {
                currentPlugin[target]();
            }, this);
        }
    },

    /**
     * Register an event handle for disposal in the destructor.
     *
     * @method _registerEventHandle
     * @param {EventHandle} The Event Handle as returned by Y.on, and Y.delegate.
     * @private
     */
    _registerEventHandle: function(handle) {
        this._eventHandles.push(handle);
    },

    /**
     * Setup the toolbar on the editor.
     *
     * @method setupToolbar
     * @chainable
     */
    setupToolbar: function() {
        this.toolbar = Y.Node.create('<div class="' + CSS.TOOLBAR + '" role="toolbar" aria-live="off"/>');
        this._wrapper.appendChild(this.toolbar);

        if (this.textareaLabel) {
            this.toolbar.setAttribute('aria-labelledby', this.textareaLabel.get("id"));
        }

        return this;
    },

    /**
     * Disable CSS styling. Use HTML elements instead.
     *
     * @method disableCssStyling
     */
    disableCssStyling: function() {
        try {
            document.execCommand("styleWithCSS", 0, false);
        } catch (e1) {
            try {
                document.execCommand("useCSS", 0, true);
            } catch (e2) {
                try {
                    document.execCommand('styleWithCSS', false, false);
                } catch (e3) {
                    // We did our best.
                }
            }
        }
    },

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
        return '';
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
        // Listen for Arrow down, underscore, hat (^) and Up Arrow  keys.
        this._registerEventHandle(this._wrapper.delegate('key',
                this.textareaKeyboardNavigation,
                'down:40,95',
                '.' + CSS.CONTENT,
                this));
        this._registerEventHandle(this._wrapper.delegate('key',
                this.textareaKeyboardNavigation,
                'down:38,94',
                '.' + CSS.CONTENT,
                this));

        return this;
    },

    /**
     * Implement arrow key navigation for the buttons in the toolbar.
     *
     * @method textareaKeyboardNavigation
     * @param {EventFacade} e - the keyboard event.
     */
    textareaKeyboardNavigation: function(e) {

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

        var command = '', mode = 1;
        // Cross browser event object.
        var evt = window.event || e;
        var code = evt.keyCode ? evt.keyCode : evt.charCode;
        // Call superscript.
        if ((code === 38) || (code === 94)) {
            command = 'superscript';
        // Call subscript.
        } else if ((code === 40) || (code === 95)) {
            command = 'subscript';
        }

        this._applyTextCommand(command, mode);
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
                 if(!evt.preventDefault) {
                     evt.returnValue = false;
                     return;
                 }
                 evt.preventDefault();
             }
         }, this);
     }

}, {
    NS: 'editor_ousupsub',
    ATTRS: {
        /**
         * The unique identifier for the form element representing the editor.
         *
         * @attribute elementid
         * @type String
         * @writeOnce
         */
        elementid: {
            value: null,
            writeOnce: true
        },

        /**
         * The contextid of the form.
         *
         * @attribute contextid
         * @type Integer
         * @writeOnce
         */
        contextid: {
            value: null,
            writeOnce: true
        },

        /**
         * Plugins with their configuration.
         *
         * The plugins structure is:
         *
         *     [
         *         {
         *             "group": "groupName",
         *             "plugins": [
         *                 "pluginName": {
         *                     "configKey": "configValue"
         *                 },
         *                 "pluginName": {
         *                     "configKey": "configValue"
         *                 }
         *             ]
         *         },
         *         {
         *             "group": "groupName",
         *             "plugins": [
         *                 "pluginName": {
         *                     "configKey": "configValue"
         *                 }
         *             ]
         *         }
         *     ]
         *
         * @attribute plugins
         * @type Object
         * @writeOnce
         */
        plugins: {
            value: {},
            writeOnce: true
        }
    }
});

// The Editor publishes custom events that can be subscribed to.
Y.augment(Editor, Y.EventTarget);

Y.namespace('M.editor_ousupsub').Editor = Editor;

// Function for Moodle's initialisation.
Y.namespace('M.editor_ousupsub.Editor').init = function(config) {
    Y.log("Y.M.editor_ousupsub.Editor.init has been deprecated since Moodle 2.8." +
            "Please use YUI.M.editor_ousupsub.createEditor instead", "warn", LOGNAME);
    return YUI.M.editor_ousupsub.createEditor(config);
};
