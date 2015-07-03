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
 * Builds a standalone demonstration version of the ousupsub editor
 *
 * This script is designed to run from the command line and is safe to re-run
 * at any time when the plugin is updated.
 *
 * @package editor_ousupsub
 * @copyright 2015 The Open University
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

if (isset($_SERVER['REMOTE_ADDR'])) {
    die(); // No access from web!
}

// Is not really necessary but adding it as is a CLI_SCRIPT.
define('CLI_SCRIPT', true);
define('CACHE_DISABLE_ALL', true);

require_once(__DIR__ . '/../../../config.php');
require_once($CFG->libdir . '/filelib.php');

error_reporting(E_ALL | E_STRICT);
error_reporting(-1);
ini_set('display_errors', true);
ini_set('display_startup_errors', true);

ousupsub_texteditor_standalone_builder::create_standalone();

/**
 * Creates demonstration editor.
 */
class ousupsub_texteditor_standalone_builder {
    private static $paths = array(
        'root' => 'standalone',
        'index' => 'index.html',
        'ousupsubjs' => 'moodle-editor_ousupsub.js',
        'stylecss' => 'styles.css',
        'readme' => 'readme.txt',
        'readmestandalone' => 'standalone-src/readme.txt',
        'yuiversion' => '3.17.2',
        'wwwroot' => '../../..'
    );
    private static $yuisuffix = '-min';

    public static function create_standalone () {
        self::delete_standalone();
        self::create_standalone_folder();
        self::create_readme_file();
        self::create_index_page();
        self::copy_icons();
        self::create_css_file();
        self::create_javascript_files();
    }

    public static function delete_standalone () {
        $path = self::create_path('root');
        if (fulldelete($path)) {
            self::echo_result("Emptied standalone folder.");
        }
    }

    /**
     * Create the root folder.
     */
    public static function create_standalone_folder() {
        $path = self::create_path('root/ousupsub');
        self::create_folder($path);
    }

    /**
     * Create the language string.
     */
    public static function create_language_string() {
        $components = array(
            'moodle' => array('error', 'morehelp'),
            'editor_ousupsub' => array('editor_command_keycode', 'editor_control_keycode',
                                        'plugin_title_shortcut', 'subscript', 'superscript'),
        );

        $output = array();
        foreach ($components as $component => $keys) {
            $output[$component] = array();
            foreach ($keys as $key) {
                $output[$component][$key] = get_string($key, $component);
            }
        }
        self::echo_result("Create language strings.");
        return json_encode($output);
    }

    /**
     * Create readme file.
     */
    public static function create_readme_file() {

        // Create the readme file.
        $pathfrom = self::create_path('readmestandalone');
        $contents = file_get_contents($pathfrom);

        // Path to save file to.
        $pathto = self::create_path('root/readme');
        if (file_put_contents($pathto, $contents, 0)) {
            self::echo_result("Created readme.txt.");
        }
    }

    /**
     * Create the index page.
     */
    public static function create_index_page() {
        $replacements = array(
            '%%ousupsubjspath%%' => self::create_path('ousupsub/ousupsubjs'),
            '%%stylespath%%' => self::create_path('ousupsub/stylecss'),
            '%%yuipath%%' => self::create_path('ousupsub/yui/yuiversion/yui/yui' .
                    self::$yuisuffix . '.js'),
        );

        $html = file_get_contents(self::create_path('standalone-src/index.html'));
        $html = str_replace(array_keys($replacements), array_values($replacements), $html);

        $path = self::create_path('root/index');
        if (file_put_contents($path, $html, 0)) {
                self::echo_result("Create index file.");
        }
    }

    /**
     * Copy button icons.
     */
    public static function copy_icons() {
        global $CFG;
        $names = array('subscript', 'superscript');
        $preferredlocation = $CFG->dirroot . '/theme/ou/pix/editor/';
        $fallbacklocation = $CFG->dirroot . '/pix/e/';

        // OU sup sub icons.
        foreach ($names as $name) {
            $source = $preferredlocation . $name . '.svg';
            if (!is_readable($source)) {
                $source = $fallbacklocation . $name . '.svg';
            }
            $destination = self::create_path('root/ousupsub/'.$name.'.svg');
            if (copy($source, $destination)) {
                self::echo_result("Copy ousupsub ".$name." icon.");
            }
        }
    }

    /**
     * Create CSS file.
     */
    public static function create_css_file() {

        // Create the static file. The unconventional indenting is required to produce conventional
        // indenting in the file produced.
        $contents = '
body {
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  background-color: #fff;
}';
        $contents .= file_get_contents(self::create_path('stylecss'));

        // Path to save file to.
        if (file_put_contents(self::create_path('root/ousupsub/stylecss'), $contents, 0)) {
            self::echo_result("Created styles.css.");
        }
    }

    /**
     * Copy the javascript files required by the editor.
     */
    public static function create_javascript_files() {

        // Read files into memory.
        // Create the static file.
        $combinedcontents = self::create_javascript_static();

        // Load the YUI editor files.
        // path to get the editor yui files from.
        $editoryuipath = 'yui/build/moodle-editor_ousupsub-%%PART%%/moodle-editor_ousupsub-%%PART%%-min.js';
        //$editoryuipath = 'yui/build/moodle-editor_ousupsub-%%PART%%/moodle-editor_ousupsub-%%PART%%.js';
        $names = array('editor', 'rangy');
        foreach ($names as $name) {
            $path = str_replace('%%PART%%', $name, $editoryuipath);
            $combinedcontents .= file_get_contents($path);
        }

        // Save combined file.
        $combinedpath = self::create_path('root/ousupsub/ousupsubjs');
        if (file_put_contents ( $combinedpath, $combinedcontents, 0)) {
            self::echo_result("Copied editor javascript files.");
        }

        self::copy_yui_javascript_files();
    }

    /**
     * Create the general javascript functions.
     */
    public static function create_javascript_static() {
        $js = file_get_contents(self::create_path('standalone-src/fake-moodle-env.js'));
        $js = str_replace('%%langstrings%%', self::create_language_string(), $js);
        return $js;
    }

    /**
     * Copy YUI js files.
     */
    public static function copy_yui_javascript_files() {
        $source = self::create_path('wwwroot/lib/yuilib/yuiversion');
        $destination = self::create_path('root/ousupsub/yui/yuiversion');
        $names = array('attribute-base', 'attribute-core', 'attribute-extras',
                'attribute-observable', 'base-base', 'base-build', 'base-core',
                'base-observable', 'base-pluginhost', 'dom-base',
                'dom-core', 'dom-screen', 'dom-style', 'event-base', 'event-custom-base',
                'event-custom-complex', 'event-delegate', 'event-focus', 'event-key',
                'event-synthetic', 'event-tap', 'event-touch', 'node-base', 'node-core',
                'node-event-delegate', 'node-screen', 'node-style', 'oop',
                'pluginhost-base', 'pluginhost-config',
                'selector', 'selector-native', 'yui');
        foreach ($names as $name) {
            $folderpath = '/'.$name;
            self::create_folder($destination.$folderpath);
            $modulepath = $folderpath.'/'.$name.self::$yuisuffix.'.js';
            if (copy($source.$modulepath, $destination.$modulepath)) {
                self::echo_result("Copy YUI module " . $name . ".");
            }
        }

        $cssnames = array('widget-base', 'widget-stack');
        foreach ($cssnames as $name) {
            $folderpath = '/'.$name.'/assets/skins/sam';
            self::create_folder($destination.$folderpath);
            $cssmodulepath = $folderpath.'/'.$name.'.css';
            if (copy($source.$cssmodulepath, $destination.$cssmodulepath)) {
                self::echo_result("Copy YUI skin ".$name.".");
            }
        }
    }

    /**
     * Create a folder on the file system give a path.
     */
    public static function create_folder($path) {
        global $CFG;
        if (!file_exists($path)) {
            mkdir($path, $CFG->directorypermissions, true);
        }

        return true;
    }

    /**
     * Create a php folder path given keys from the $paths array.
     */
    public static function create_path($ids) {
        $keys = explode('/', $ids);
        $path = '';
        foreach ($keys as $key) {
            $path .= strlen($path) ? '/' : '';
            $path .= array_key_exists($key, self::$paths) ? self::$paths[$key] : $key;
        }
        return $path;
    }

    /**
     * Create a folder on the file system give a path.
     */
    public static function echo_result($msg) {
        echo $msg."\r\n";
    }
}
