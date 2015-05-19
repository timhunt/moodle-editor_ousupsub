The new OU Superscript/subscript editor

This is a very cut-down configuration of ATTO that just lets users
edit one line of input with superscripts and subscripts, for use in Moodle.

This editor was created by Colin Chambers of the Open University
http://www.open.ac.uk/.

This should be compatible with Moodle 2.8+. Older versions are available if you
need to support older versions of Moodle.

To install using git, type this commands in the root of your Moodle install
    git clone git://github.com/colchambers/moodle-editor_ousupsub.git lib/editor/ousupsub
    echo '/lib/editor/ousupsub' >> .git/info/exclude

Alternatively, download the zip from
    https://github.com/colchambers/moodle-editor_ousupsub/zipball/master
unzip it into the lib/editor folder, and then rename the extracted folder to ousupsub.

Then run the moodle update process
Administration > site administration > notifications

This is the main repository where the plugin exists. Everywhere else is just a copy of this repository. The editor 
is a child of the moodle atto plugin and as much as possible we’re keeping the general file and code structure the 
same to ease maintenance and make the plugin sustainable. 

The plugin is built for and maintained by the Open University (OU) to replace their existing TinyMCE based supsub 
editor. This editor is used primarily on two OU specific question types (pattern match and variable numeric) and 
supports a reduced set of requirements specific to the needs of many questions in fields such as maths and chemistry.

These requirements are summarised as:
* Allow only alphanumeric text. No html tags except <sup> and <sub>
* Provide a superscript or subscript button or both along with related functionality
* Prevent nesting of superscript and subscript tags
* No text wrapping is allowed along with no paragraphs. Everything is on one line 
* Configurable height and width of editor
* Provide a standalone version of the same editor for offline situations such as ereaders
* Editor can placed where required including inline with text

Standalone version
More details are in readme_standalone.txt that gets added to the /standalone folder
A standalone/offline version of the editor is also provided in the /standalone folder. This provides all the 
functionality of the editor in a package that works in an ereader or mobile app or on a desktop to demonstrate
the functionality of the editor outside of moodle. There feature is currently in beta.

The standalone version is kept up to date by running the buildstandalone.php in the same way you run a behat script
The full command we use is php lib/editor/ousupsub/buildstandalone.php

Running this script outputs a list of files and features that have been created. First it deletes the contents of the 
standalone folder and then it recreates the standalone files. This ensures the standalone version is as up to date with
the plugin. This task is performed during development of the editor. If you are using it out of the box you shouldn't 
need to run this script.

Testing
Automated testing is through behat and custom javascript unit tests. There is a behat test for the moodle plugin and an 
identical test for the standalone version

The javascript unit tests run in a browser. Load /tests/fixtures/testcleanup.html in a specific browser to see if the 
tests pass in that browser.

The editor will work any where moodle editors work but it's designed to be used with specific OU question types 
The main places to test are:
* pattern match questions (OU specific question type)
* variable numeric  questions (OU specific question type)

HTML Output
To understand exactly what this editor will and will not do it's best to understand the html it will or will not allow. 
That is described in the behat tests at tests/behat/ousupsub.feature. You do not need to understand web development
to understand these tests and you don't have to be able to run them either. 

Here is a simple example we tell the browser what to do. Select the whole of the word "subscript". In behat we write 
    # Apply subscript
    When I select the range "'',16,'',25" in the "Description" ousupsub editor

Then we ask the brower to apply subscript to the word we have selected
    And I click on "Subscript" "button"

Then we check that subscript was applied correctly. 
    Then I should see "Superscript and <sub>Subscript</sub>" in the "Description" ousupsub editor

That is how you read the behat tests and how you know what to expect the editor to do.

Libraries: Imported from the atto readme
Description of the import of libraries associated with the ousupsub editor.

1)  Rangy (version 1.2.3)
    * Download the latest stable release;
    * Copy the content of the 'currentrelease/uncompressed' folder into yui/src/rangy/js
    * Run shifter against yui/src/rangy

    Notes:
    * We have patched 1.2.3 with a backport fix from the next release of Rangy which addresses an incompatibility
      between Rangy and HTML5Shiv which is used in the bootstrapclean theme. See MDL-44798 for further information.
