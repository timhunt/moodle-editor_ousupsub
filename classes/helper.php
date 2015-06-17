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
 * Superscript-subscript editor helper functions.
 *
 * @package    editor_ousupsub
 * @copyright  2015 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();


/**
 * Superscript-subscript editor helper functions.
 *
 * @copyright  2015 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class editor_ousupsub_helper {
    public static function get_editor() {
        // Show tinymce version is browser is IE and below version 9 or new editor is not enabled.
        $props = core_useragent::check_ie_properties();
        if (($props && $props['version'] < 9) || !get_config('editor_ousupsub', 'use')) {
            return get_texteditor('supsub');
        } else {
            return get_texteditor('ousupsub');
        }
    }
}
