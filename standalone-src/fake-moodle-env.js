// Miscellaneous core Javascript functions for Moodle.
// Global M object is initilised in inline javascript.

M = {};
M.str = M.str || {};
M.yui = M.yui || {};

M.util = M.util || {};
M.util.image_url = M.util.image_url || function(imagename, component) {
    return M.iconrooturl + imagename.replace("e/", "/") + ".svg";
};
M.util.get_string = M.util.get_string || function(identifier, component, a) {
    var stringvalue;

    if (!M.str.hasOwnProperty(component) || !M.str[component].hasOwnProperty(identifier)) {
        stringvalue = '[[' + identifier + ',' + component + ']]';
        if (M.cfg.developerdebug) {
            console.log('undefined string ' + stringvalue, 'warn', 'M.util.get_string');
        }
        return stringvalue;
    }

    stringvalue = M.str[component][identifier];

    if (typeof a == 'undefined') {
        // no placeholder substitution requested
        return stringvalue;
    }

    if (typeof a == 'number' || typeof a == 'string') {
        // replace all occurrences of {$a} with the placeholder value
        stringvalue = stringvalue.replace(/\{\$a\}/g, a);
        return stringvalue;
    }

    if (typeof a == 'object') {
        // replace {$a->key} placeholders
        for (var key in a) {
            if (typeof a[key] != 'number' && typeof a[key] != 'string') {
                if (M.cfg.developerdebug) {
                    console.log('invalid value type for $a->' + key, 'warn', 'M.util.get_string');
                }
                continue;
            }
            var search = '{$a->' + key + '}';
            stringvalue = stringvalue.replace(search, a[key]);
        }
        return stringvalue;
    }

    if (M.cfg.developerdebug) {
        console.log('incorrect placeholder type', 'warn', 'M.util.get_string');
    }
    return stringvalue;
};

function init_ousupsub(id, type) {
    var requiredStrings = %%langstrings%%;
    for (var component in requiredStrings) {
        M.str[component] = M.str[component] || {};
        for (var key in requiredStrings[component]) {
            M.str[component][key] = M.str[component][key] || requiredStrings[component][key];
        }
    }

    var thisscripturl = document.getElementById('ousupsubloader').getAttribute('src');
    M.iconrooturl = thisscripturl.substring(0, thisscripturl.lastIndexOf("/"));

    plugins = [];
    if (type === 'both' || type === 'superscript') {
        plugins.push({"name": "superscript", "params": []});
    }
    if (type === 'both' || type === 'subscript') {
        plugins.push({"name": "subscript", "params": []});
    }
    YUI().use("node", function(Y) {
        Y.use("moodle-editor_ousupsub-editor",
            function(Y) {
                YUI.M.editor_ousupsub.createEditor(
                    {"elementid" : id, "content_css" : "", "contextid" : 0, "language" : "en",
                     "directionality" : "ltr", "plugins" : [{"group" : "style1", "plugins" : plugins}],"pageHash" : ""});
                window.Y = Y; // Required for Behat.
            }
        );
    });
};
