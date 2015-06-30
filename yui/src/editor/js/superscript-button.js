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
 */

/**
 * ousupsub text editor subscript plugin.
 *
 * @namespace M.ousupsub_subscript
 * @class button
 * @extends M.editor_ousupsub.EditorPlugin
 */

Y.namespace('M.ousupsub_superscript').Button = Y.Base.create('button', Y.M.editor_ousupsub.EditorPlugin, [], {
    initializer: function() {
        this._config = {
            exec: 'superscript',

            // Watch the following tags and add/remove highlighting as appropriate:
            tags: 'sup',

            // Key code (up arrow) for the keyboard shortcut which triggers this button:
            // Up arrow should be 38 but doesn't register and is handled elsewhere.
            keys: ['94'],

            icon: 'e/superscript',
            callback: this._applyTextCommand
        };
        this.addButton(this._config);
    }
});
