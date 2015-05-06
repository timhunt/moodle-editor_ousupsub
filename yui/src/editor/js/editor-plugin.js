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
 * ousupsub editor plugin.
 *
 * @module moodle-editor_ousupsub-plugin
 * @submodule plugin-base
 * @package    editor_ousupsub
 * @copyright  2014 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * A Plugin for the ousupsub Editor used in Moodle.
 *
 * This class should not be directly instantiated, and all Editor plugins
 * should extend this class.
 *
 * @namespace M.editor_ousupsub
 * @class EditorPlugin
 * @main
 * @constructor
 * @uses M.editor_ousupsub.EditorPluginButtons
 */

function EditorPlugin() {
    EditorPlugin.superclass.constructor.apply(this, arguments);
}

var GROUPSELECTOR = '.ousupsub_group.',
    GROUP = '_group';

Y.extend(EditorPlugin, Y.Base, {
    /**
     * The name of the current plugin.
     *
     * @property name
     * @type string
     */
    name: null,

    /**
     * A Node reference to the editor.
     *
     * @property editor
     * @type Node
     */
    editor: null,

    /**
     * A Node reference to the editor toolbar.
     *
     * @property toolbar
     * @type Node
     */
    toolbar: null,

    /**
     * Event Handles to clear on plugin destruction.
     *
     * @property _eventHandles
     * @private
     */
    _eventHandles: null,

    initializer: function(config) {
        // Set the references to configuration parameters.
        this.name = config.name;
        this.toolbar = config.toolbar;
        this.editor = config.editor;

        // Set up the prototypal properties.
        // These must be set up here becuase prototypal arrays and objects are copied across instances.
        this.buttons = {};
        this.buttonNames = [];
        this.buttonStates = {};
        this.menus = {};
        this._primaryKeyboardShortcut = [];
        this._buttonHandlers = [];
        this._menuHideHandlers = [];
        this._highlightQueue = {};
        this._eventHandles = [];
    },

    destructor: function() {
        // Detach all EventHandles.
        new Y.EventHandle(this._eventHandles).detach();
    },

    /**
     * Mark the content ediable content as having been changed.
     *
     * This is a convenience function and passes through to {{#crossLink "M.editor_ousupsub.EditorTextArea/updateOriginal"}}updateOriginal{{/crossLink}}.
     *
     * @method markUpdated
     */
    markUpdated: function() {
        // Save selection after changes to the DOM. If you don't do this here,
        // subsequent calls to restoreSelection() will fail expecting the
        // previous DOM state.
        this.get('host').saveSelection();

        return this.get('host').updateOriginal();
    },

    /**
     * Register an event handle for disposal in the destructor.
     *
     * @method registerEventHandle
     * @param {EventHandle} The Event Handle as returned by Y.on, and Y.delegate.
     */
    registerEventHandle: function(handle) {
        this._eventHandles.push(handle);
    }
}, {
    NAME: 'editorPlugin',
    ATTRS: {
        /**
         * The editor instance that this plugin was instantiated by.
         *
         * @attribute host
         * @type M.editor_ousupsub.Editor
         * @writeOnce
         */
        host: {
            writeOnce: true
        },

        /**
         * The toolbar group that this button belongs to.
         *
         * When setting, the name of the group should be specified.
         *
         * When retrieving, the Node for the toolbar group is returned. If
         * the group doesn't exist yet, then it is created first.
         *
         * @attribute group
         * @type Node
         * @writeOnce
         */
        group: {
            writeOnce: true,
            getter: function(groupName) {
                var group = this.toolbar.one(GROUPSELECTOR + groupName + GROUP);
                if (!group) {
                    group = Y.Node.create('<div class="ousupsub_group ' +
                            groupName + GROUP + '"></div>');
                    this.toolbar.append(group);
                }

                return group;
            }
        }
    }
});

Y.namespace('M.editor_ousupsub').EditorPlugin = EditorPlugin;
