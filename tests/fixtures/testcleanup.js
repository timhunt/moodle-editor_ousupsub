/**
 * 
 */



var testcases = [
                 {input: "<span><sup>12</sup></span>", expectedoutput: "<sup>12</sup>"}
//                {input: "<sup>1</sup><sup>2</sup>", expectedoutput: "<sup>12</sup>"}
                // Etc. lots more cases.
                    
];


function init_ousupsub(id, params) {
    M.str = {"moodle":{"error":"Error","morehelp":"More help","changesmadereallygoaway":"You have made changes. Are you sure you want to navigate away and lose your changes?"},"ousupsub_subscript":{"pluginname":"Subscript"},"ousupsub_superscript":{"pluginname":"Superscript"},"editor_ousupsub":{"editor_command_keycode":"Cmd + {$a}","editor_control_keycode":"Ctrl + {$a}","plugin_title_shortcut":"{$a->title} [{$a->shortcut}]","plugin_title_shortcut":"{$a->title} [{$a->shortcut}]"},"error":{"serverconnection":"Error connecting to the server"}}
    plugins = [];
    if (params.superscript) {
        plugins[plugins,length] = {"name":"superscript","params":[]};
    }
    if (params.subscript) {
        plugins[plugins.length] = {"name":"subscript","params":[]};
    }
    var YUI_config = {
                         
                         base: "resources/yui/3.17.2/"
                      }
    YUI().use("node", function(Y) {
    Y.use("moodle-editor_ousupsub-editor","moodle-ousupsub_subscript-button","moodle-ousupsub_superscript-button",
            function() {YUI.M.editor_ousupsub.createEditor(
            {"elementid":id,"content_css":"","contextid":0,"language":"en",
                "directionality":"ltr","plugins":[{"group":"style1","plugins":plugins}],"pageHash":""});
    });

    });
};

// Initialise an editor to test with.
init_ousupsub("id_description_editor", {"subscript":true, "superscript":true});

function get_editor(id) {
    return YUI.M.editor_ousupsub.getEditor(id);
}

function run_tests() {
    YUI().use("node", function(Y) {
        Y.use("moodle-editor_ousupsub-editor","moodle-ousupsub_subscript-button","moodle-ousupsub_superscript-button",
                        function() {
            var editor = get_editor("id_description_editor");
            for(var i=0; i<testcases.length;i++) {
                run_test(editor, testcases[i]);
            }
        });
                });
}


function run_test(editor, test) {
    var inputText = test.input;
    editor.editor.set('innerHTML', inputText);
    editor.plugins.subscript._removeNodesByName(editor.editor._node, 'span');
    var outputText = editor.editor.get('innerHTML'); 
    
    // Display output. TODO update the html table instead of using log calls.
    console.log("input text = "+inputText);
    console.log("output text = "+outputText);
    console.log("expect output text = "+test.expectedoutput);
    var matched = test.expectedoutput == outputText;
    console.log("matched = "+matched);
}

run_tests();