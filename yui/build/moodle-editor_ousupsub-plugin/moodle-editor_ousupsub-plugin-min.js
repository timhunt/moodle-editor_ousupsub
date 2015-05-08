YUI.add("moodle-editor_ousupsub-plugin",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}function l(){}var r=".ousupsub_group.",i="_group";e.extend(n,e.Base,{name:null,editor:null,toolbar:null,_eventHandles:null,initializer:function(e){this.name=e.name,this.toolbar=e.toolbar,this.editor=e.editor,this.buttons={},this.buttonNames=[],this.buttonStates={},this.menus={},this._primaryKeyboardShortcut=[],this._buttonHandlers=[],this._menuHideHandlers=[],this._highlightQueue={},this._eventHandles=[]},destructor:function(){(new e.EventHandle(this._eventHandles)).detach()},markUpdated:function(){return this.get("host").saveSelection(),this.get("host").updateOriginal()},registerEventHandle:function(e){this._eventHandles.push(e)}},{NAME:"editorPlugin",ATTRS:{host:{writeOnce:!0},group:{writeOnce:!0,getter:function(t){var n=this.toolbar.one(r+t+i);return n||(n=e.Node.create('<div class="ousupsub_group '+t+i+'"></div>'),this.toolbar.append(n)),n}}}}),e.namespace("M.editor_ousupsub").EditorPlugin=n;var s='<button class="{{buttonClass}} ousupsub_hasmenu" tabindex="-1" type="button" title="{{title}}"><img class="icon" aria-hidden="true" role="presentation" width="16" height="16" style="background-color:{{config.menuColor}};" src="{{config.iconurl}}" /><img class="icon" aria-hidden="true" role="presentation" width="16" height="16" src="{{image_url "t/expanded" "moodle"}}"/></button>',o="disabled",u="highlight",a="moodle-editor_ousupsub-editor-plugin",f={EDITORWRAPPER:".editor_ousupsub_content"};l.ATTRS={},l.prototype={buttons:null,buttonNames:null,buttonStates:null,menus:null,DISABLED:0,ENABLED:1,_buttonHandlers:null,_menuHideHandlers:null,_primaryKeyboardShortcut:null,_highlightQueue:null,addButton:function(t){var n=this.get("group"),r=this.name,i="ousupsub_"+r+"_button",s,o=this.get("host");t.exec&&(i=i+"_"+t.exec),t.buttonName?i=i+"_"+t.buttonName:t.buttonName=t.exec||r,t.buttonClass=i,t=this._normalizeIcon(t),t.title||(t.title="pluginname");var u=M.util.get_string(t.title,"ousupsub_"+r);s=e.Node.create('<button type="button" class="'+i+'"'+'tabindex="-1">'+'<img class="icon" aria-hidden="true" role="presentation" width="16" height="16" src="'+t.iconurl+'"/>'+"</button>"),s.setAttribute("title",u),n.append(s);var a=this.toolbar.getAttribute("aria-activedescendant");a||(s.setAttribute("tabindex","0"),this.toolbar.setAttribute("aria-activedescendant",s.generateID()),this.get("host")._tabFocus=s),t=this._normalizeCallback(t),this._buttonHandlers.push(this.toolbar.delegate("click",t.callback,"."+i,this)),t.keys&&(typeof t.keyDescription!="undefined"&&(this._primaryKeyboardShortcut[i]=t.keyDescription),this._primaryKeyboardShortcut[i]&&s.setAttribute("title",M.util.get_string("plugin_title_shortcut","editor_ousupsub",{title:u,shortcut:this._primaryKeyboardShortcut[i]})));if(t.tags){var f=!0;typeof t.tagMatchRequiresAll=="boolean"&&(f=t.tagMatchRequiresAll),this._buttonHandlers.push(o.on(["ousupsub:selectionchanged","change"],function(n){typeof this._highlightQueue[t.buttonName]!="undefined"&&this._highlightQueue[t.buttonName].cancel(),this._highlightQueue[t.buttonName]=e.soon(e.bind(function(e){o.selectionFilterMatches(t.tags,e.selectedNodes,f)?this.highlightButtons(t.buttonName):this.unHighlightButtons(t.buttonName)},this,n))},this))}return this._preventEnter(),this._handle_key_press(),this.buttonNames.push(t.buttonName),this.buttons[t.buttonName]=s,this.buttonStates[t.buttonName]=this.ENABLED,s},_preventEnter:function(){var t="keypress";if(e.UA.webkit||e.UA.ie)t="keydown";this.editor.on(t,function(e){var t=window.event||e;t.keyCode===13&&t.preventDefault()},this)},_handle_key_press:function(){var t="keypress";if(e.UA.webkit||e.UA.ie)t="keydown";this.editor.on(t,function(e){var t=window.event||e;t.keyCode===38||t.keyCode===94?this._applyTextCommand(1):(t.keyCode===40||t.keyCode===95)&&this._applyTextCommand(-1)},this)},addBasicButton:function(e){return e.exec?(e.icon||(e.icon="e/"+e.exec),e.callback=function(){document.execCommand(e.exec,!1,null),this.markUpdated()},this.addButton(e)):null},addToolbarMenu:function(t){var n=this.get("group"),r=this.name,i="ousupsub_"+r+"_button",o,u;t.buttonName?i=i+"_"+t.buttonName:t.buttonName=r,t.buttonClass=i,t=this._normalizeIcon(t),t.title||(t.title="pluginname");var a=M.util.get_string(t.title,"ousupsub_"+r);t.menuColor||(t.menuColor="transparent");var f=e.Handlebars.compile(s);return o=e.Node.create(f({buttonClass:i,config:t,title:a})),n.append(o),u=this.toolbar.getAttribute("aria-activedescendant"),u||(o.setAttribute("tabindex","0"),this.toolbar.setAttribute("aria-activedescendant",o.generateID())),this._buttonHandlers.push(this.toolbar.delegate("click",this._showToolbarMenu,"."+i,this,t),this.toolbar.delegate("key",this._showToolbarMenuAndFocus,"40, 32, enter","."+i,this,t)),this.buttonNames.push(t.buttonName),this.buttons[t.buttonName]=o,this.buttonStates[t.buttonName]=this.ENABLED,o},_showToolbarMenu:function(t,n){t.preventDefault();if(!this.isEnabled())return;if(t.currentTarget.ancestor("button",!0).hasAttribute(o))return;var r;this.menus[n.buttonClass]||(n.overlayWidth||(n.overlayWidth="14"),n.innerOverlayWidth||(n.innerOverlayWidth=parseInt(n.overlayWidth,10)-2+"em"),n.overlayWidth=parseInt(n.overlayWidth,10)+"em",this.menus[n.buttonClass]=new e.M.editor_ousupsub.Menu(n),this.menus[n.buttonClass].get("contentBox").delegate("click",this._chooseMenuItem,".ousupsub_menuentry a",this,n)),e.Array.each(this.get("host").openMenus,function(e){e.set("focusAfterHide",null)});var i=this.buttons[n.buttonName];i.focus(),this.get("host")._setTabFocus(i),r=this.menus[n.buttonClass],r.set("focusAfterHide",i),r.show(),r.align(this.buttons[n.buttonName],[e.WidgetPositionAlign.TL,e.WidgetPositionAlign.BL]),this.get("host").openMenus=[r]},_showToolbarMenuAndFocus:function(e,t){this._showToolbarMenu(e,t),this.menus[t.buttonClass].get("boundingBox").one("a").focus()},_chooseMenuItem:function(e,t,n){var r=e.target.ancestor("a",!0).getData("index"),i=this._normalizeCallback
(t.items[r],t.globalItemConfig);n=this.menus[t.buttonClass],n.set("preventHideMenu",!0),i.callback(e,i._callback,i.callbackArgs),n.set("preventHideMenu",!1),n.set("focusAfterHide",this.get("host").editor),n.hide(e)},_normalizeCallback:function(t,n){return t._callbackNormalized?t:(n||(n={}),t._callback=t.callback||n.callback,t.callback=e.rbind(this._callbackWrapper,this,t._callback,t.callbackArgs),t._callbackNormalized=!0,t)},_normalizeIcon:function(e){return e.iconurl||(e.iconComponent||(e.iconComponent="core"),e.iconurl=M.util.image_url(e.icon,e.iconComponent)),e},_callbackWrapper:function(e,t,n){e.preventDefault();if(!this.isEnabled())return;var r=e.currentTarget.ancestor("button",!0);if(r&&r.hasAttribute(o))return;!YUI.Env.UA.android&&!this.get("host").isActive()&&this.get("host").focus(),this.get("host").saveSelection(),r&&this.get("host")._setTabFocus(r);var i=[e,n];return this.get("host").restoreSelection(),t.apply(this,i)},_addKeyboardListener:function(t,n,r){var i="key",s=f.EDITORWRAPPER,o,u,a;if(e.Lang.isArray(n))return e.Array.each(n,function(e){this._addKeyboardListener(t,e,r)},this),this;typeof n=="object"?(n.eventtype&&(i=n.eventtype),n.container&&(s=n.container),o=n.keyCodes,u=t):(a="",o=n,typeof this._primaryKeyboardShortcut[r]=="undefined"&&(this._primaryKeyboardShortcut[r]=this._getDefaultMetaKeyDescription(n)),u=e.bind(function(e,n){if(r==="ousupsub_superscript_button_superscript"){if(o==="40"||o==="95")return;t.apply(this,[n])}else if(r==="ousupsub_subscript_button_subscript"){if(o==="38"||o==="94")return;t.apply(this,[n])}},this,[a])),this._buttonHandlers.push(this.editor.delegate(i,u,o,s,this))},_eventUsesExactKeyModifiers:function(t,n){var r=!0,i;return n.type!=="key"?!1:(i=e.Array.indexOf(t,"alt")>-1,r=r&&(n.altKey&&i||!n.altKey&&!i),i=e.Array.indexOf(t,"ctrl")>-1,r=r&&(n.ctrlKey&&i||!n.ctrlKey&&!i),i=e.Array.indexOf(t,"meta")>-1,r=r&&(n.metaKey&&i||!n.metaKey&&!i),i=e.Array.indexOf(t,"shift")>-1,r=r&&(n.shiftKey&&i||!n.shiftKey&&!i),r)},isEnabled:function(){var t=e.Object.some(this.buttonStates,function(e){return e===this.ENABLED},this);return t},disableButtons:function(e){return this._setButtonState(!1,e)},enableButtons:function(e){return this._setButtonState(!0,e)},_setButtonState:function(t,n){var r="setAttribute";return t&&(r="removeAttribute"),n?this.buttons[n]&&(this.buttons[n][r](o,o),this.buttonStates[n]=t?this.ENABLED:this.DISABLED):e.Array.each(this.buttonNames,function(e){this.buttons[e][r](o,o),this.buttonStates[e]=t?this.ENABLED:this.DISABLED},this),this.get("host").checkTabFocus(),this},highlightButtons:function(e){return this._changeButtonHighlight(!0,e)},unHighlightButtons:function(e){return this._changeButtonHighlight(!1,e)},_changeButtonHighlight:function(t,n){var r="addClass";return t||(r="removeClass"),n?this.buttons[n]&&this.buttons[n][r](u):e.Object.each(this.buttons,function(e){e[r](u)},this),this},_getDefaultMetaKey:function(){return e.UA.os==="macintosh"?"meta":"ctrl"},_getDefaultMetaKeyDescription:function(t){return e.UA.os==="macintosh"?M.util.get_string("editor_command_keycode","editor_ousupsub",String.fromCharCode(t).toLowerCase()):M.util.get_string("editor_control_keycode","editor_ousupsub",String.fromCharCode(t).toLowerCase())},_getKeyEvent:function(){return"down:"},_applyTextCommand:function(e){document.execCommand(this._config.exec,!1,null),this._normaliseTextareaAndGetSelectedNodes(),this.markUpdated()},_getCurrentSelection:function(){var e=this.get("host").getSelection();return!e||e.length===0?null:e[0]},_getWholeText:function(e){var t="";return e.startContainer===e.commonAncestorContainer&&e.endContainer===e.commonAncestorContainer&&(t=e.commonAncestorContainer.wholeText),t},_normaliseTextareaAndGetSelectedNodes:function(){var e=window.rangy.saveSelection(),t=this._getEditorNode();this._removeSingleNodesByName(t,"br");var n=new Array("p","b","i","span","u");for(var r=0;r<n.length;r++)this._removeNodesByName(t,n[r]);this._normaliseTagInTextarea("sup"),this._normaliseTagInTextarea("sub"),window.rangy.restoreSelection(e);var i=this.get("host");e=i.getSelection()[0];var t=this._getEditorNode(i);t.normalize();return;var s,o,u,a,f,l,c,h,t,p,d},_getEditorNode:function(e){return e||(e=this.get("host")),e.editor._node},_updateSelection:function(e,t,n,r){var i=this.get("host"),s=i.getSelection(),o=s[0];o.setStart(e,t),o.setEnd(n,r),i.setSelection(s),this.set("host",i)},_matchesSelectedNode:function(e,t){return e==t||e.contains(t)},_normaliseTagInTextarea:function(e){var t=new Array,n=this._getEditorNode(),r=n.querySelectorAll(e);for(o=0;o<r.length;o++)t.push(r.item(o));var i,s=!1;for(var o=0;o<t.length;o++){node=t[o],i=node.parentNode,s=!1;if(i==n)continue;i.firstChild==node&&i.nodeName.toLowerCase()==e&&(s=!0),this._removeNodesByName(node,e),s&&this._removeNodesByName(i,e)}var r=n.querySelectorAll(e);t=new Array;for(o=0;o<r.length;o++)t.push(r.item(o));for(var o=0;o<t.length;o++){node=t[o];if(!node.previousSibling||node.previousSibling.nodeName.toLowerCase()!=e)continue;this._mergeNodes(node,node.previousSibling)}},_mergeNodes:function(e,t){var n=new Array,r=e.childNodes;for(i=0;i<r.length;i++)n.push(r.item(i));for(var i=0;i<n.length;i++)node=n[i],t.appendChild(node);e.remove()},_removeNodesByName:function(e,t){var n,r=e.nodeName.toLowerCase()==t,i=new Array,s=e.childNodes;e.nodeName.toLowerCase()=="span"&&e.id.indexOf("selectionBoundary_")>-1&&(r=!1);for(o=0;o<s.length;o++)i.push(s.item(o));for(var o=0;o<i.length;o++){n=i[o],n.childNodes&&n.childNodes.length&&this._removeNodesByName(n,t);if(r){var u=e.parentNode;u.insertBefore(n,e)}}r&&e.remove()},_removeSingleNodesByName:function(e,t){var n,r=new Array,i=e.childNodes;for(s=0;s<i.length;s++)r.push(i.item(s));for(var s=0;s<r.length;s++)n=r[s],n.childNodes&&n.childNodes.length&&this._removeSingleNodesByName(n,t),n.nodeName.toLowerCase()==t&&n.remove()},_getTranslatedSelectionNode:function(e,t){var n=e.childNodes[t];return e.childNodes[t].nodeName!=="#text"&&(n=e.childNodes[t].childNodes[0]
),this._getSelectionNode(n)},_getSelectionNode:function(e){return e.nodeName=="#text"?e:e.childNodes[0]},_getAdjustedOffset:function(e,t,n){if(!n||!n.length)return t;var r=null;for(var i=0;i<n.length;i++){r=n[i];if(r.position>t)break;t+=r.tag.length}return t}},e.Base.mix(e.M.editor_ousupsub.EditorPlugin,[l])},"@VERSION@",{requires:["node","base","escape","event","event-outside","handlebars","event-custom","timers"]});
