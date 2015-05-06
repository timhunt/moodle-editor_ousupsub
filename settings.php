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
 * OU sup-sub admin settings.
 *
 * @package   editor_ousupsub
 * @copyright 2015 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$settings = new admin_settingpage('editorsettingsousupsub',
        new lang_string('settings', 'editor_ousupsub'));
if ($ADMIN->fulltree) {
    $settings->add(new admin_setting_configcheckbox('editor_ousupsub/use',
            get_string('useeditor', 'editor_ousupsub'),
            get_string('useeditor_desc', 'editor_ousupsub'), 0));
}
