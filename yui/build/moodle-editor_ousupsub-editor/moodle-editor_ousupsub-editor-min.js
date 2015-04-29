YUI.add("moodle-editor_ousupsub-editor",function(e,t){function i(){i.superclass.constructor.apply(this,arguments)}function a(){}function f(){}function l(){}function c(){}function h(){}function p(){}function d(){}var n="moodle-editor_ousupsub-editor",r={CONTENT:"editor_ousupsub_content",CONTENTWRAPPER:"editor_ousupsub_content_wrap",TOOLBAR:"editor_ousupsub_toolbar",WRAPPER:"editor_ousupsub",HIGHLIGHT:"highlight"};e.extend(i,e.Base,{BLOCK_TAGS:["address","article","aside","audio","blockquote","canvas","dd","div","dl","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","noscript","ol","output","p","pre","section","table","tfoot","ul","video"],PLACEHOLDER_CLASS:"ousupsub-tmp-class",ALL_NODES_SELECTOR:"[style],font[face]",FONT_FAMILY:"fontFamily",_wrapper:null,editor:null,textarea:null,textareaLabel:null,plugins:null,_eventHandles:null,initializer:function(){var t;this.textarea=e.one(document.getElementById(this.get("elementid")));if(!this.textarea)return;YUI.M.editor_ousupsub.addEditorReference(this.get("elementid"),this),this._eventHandles=[],this._wrapper=e.Node.create('<div class="'+r.WRAPPER+'" />'),t=e.Handlebars.compile('<div id="{{elementid}}editable" contenteditable="true" autocapitalize="none" autocorrect="off" role="textbox" spellcheck="false" aria-live="off" class="{{CSS.CONTENT}}" />'),this.editor=e.Node.create(t({elementid:this.get("elementid"),CSS:r})),this.textareaLabel=e.one('[for="'+this.get("elementid")+'"]'),this.textareaLabel&&(this.textareaLabel.generateID(),this.editor.setAttribute("aria-labelledby",this.textareaLabel.get("id"))),this.setupToolbar();var n=e.Node.create('<div class="'+r.CONTENTWRAPPER+'" />');n.appendChild(this.editor),this._wrapper.appendChild(n);var i=this.textarea.getAttribute("cols")*6+41+"px";this.editor.setStyle("width",i),this.editor.setStyle("minWidth",i),this.editor.setStyle("maxWidth",i),this.disableCssStyling(),document.queryCommandSupported("DefaultParagraphSeparator")&&document.execCommand("DefaultParagraphSeparator",!1,"p"),this.textarea.get("parentNode").insert(this._wrapper,this.textarea),this.textarea.hide(),this.updateFromTextArea(),this.publishEvents(),this.setupSelectionWatchers(),this.setupAutomaticPolling(),this.setupPlugins(),this.setupNotifications()},destructor:function(){e.Array.each(this.plugins,function(e,t){e.destroy(),this.plugins[t]=undefined},this),(new e.EventHandle(this._eventHandles)).detach(),this.textarea.show(),this._wrapper.remove(!0),YUI.M.editor_ousupsub.removeEditorReference(this.get("elementid"),this)},focus:function(){return this.editor.focus(),this},publishEvents:function(){return this.publish("change",{broadcast:!0,preventable:!0}),this.publish("pluginsloaded",{fireOnce:!0}),this.publish("ousupsub:selectionchanged",{prefix:"ousupsub"}),this},setupAutomaticPolling:function(){return this._registerEventHandle(this.editor.on(["keyup","cut"],this.updateOriginal,this)),this._registerEventHandle(this.editor.on("paste",this.pasteCleanup,this)),this._registerEventHandle(this.editor.on("drop",this.updateOriginalDelayed,this)),this},updateOriginalDelayed:function(){return e.soon(e.bind(this.updateOriginal,this)),this},setupPlugins:function(){this.plugins={};var t=this.get("plugins"),n,r,i,s,o;for(n in t){r=t[n];if(!r.plugins)continue;for(i in r.plugins){s=r.plugins[i],o=e.mix({name:s.name,group:r.group,editor:this.editor,toolbar:this.toolbar,host:this},s);if(typeof e.M["ousupsub_"+s.name]=="undefined")continue;this.plugins[s.name]=new e.M["ousupsub_"+s.name].Button(o)}}return this.fire("pluginsloaded"),this},enablePlugins:function(e){this._setPluginState(!0,e)},disablePlugins:function(e){this._setPluginState(!1,e)},_setPluginState:function(t,n){var r="disableButtons";t&&(r="enableButtons"),n?this.plugins[n][r]():e.Object.each(this.plugins,function(e){e[r]()},this)},_registerEventHandle:function(e){this._eventHandles.push(e)}},{NS:"editor_ousupsub",ATTRS:{elementid:{value:null,writeOnce:!0},contextid:{value:null,writeOnce:!0},plugins:{value:{},writeOnce:!0}}}),e.augment(i,e.EventTarget),e.namespace("M.editor_ousupsub").Editor=i,e.namespace("M.editor_ousupsub.Editor").init=function(e){return YUI.M.editor_ousupsub.createEditor(e)};var s="moodle-editor_ousupsub-editor-notify",o="info",u="warning";a.ATTRS={},a.prototype={messageOverlay:null,hideTimer:null,setupNotifications:function(){var e=new Image,t=new Image;return e.src=M.util.image_url("i/warning","moodle"),t.src=M.util.image_url("i/info","moodle"),this},showMessage:function(t,n,r){var i="",s,a;return this.messageOverlay===null&&(this.messageOverlay=e.Node.create('<div class="editor_ousupsub_notification"></div>'),this.messageOverlay.hide(!0),this.textarea.get("parentNode").append(this.messageOverlay),this.messageOverlay.on("click",function(){this.messageOverlay.hide(!0)},this)),this.hideTimer!==null&&this.hideTimer.cancel(),n===u?i='<img src="'+M.util.image_url("i/warning","moodle")+'" alt="'+M.util.get_string("warning","moodle")+'"/>':n===o&&(i='<img src="'+M.util.image_url("i/info","moodle")+'" alt="'+M.util.get_string("info","moodle")+'"/>'),s=parseInt(r,10),s<=0&&(s=6e4),n="ousupsub_"+n,a=e.Node.create('<div class="'+n+'" role="alert" aria-live="assertive">'+i+" "+e.Escape.html(t)+"</div>"),this.messageOverlay.empty(),this.messageOverlay.append(a),this.messageOverlay.show(!0),this.hideTimer=e.later(s,this,function(){this.hideTimer=null,this.messageOverlay.hide(!0)}),this}},e.Base.mix(e.M.editor_ousupsub.Editor,[a]),f.ATTRS={},f.prototype={_getEmptyContent:function(){return e.UA.ie&&e.UA.ie<10?"<p></p>":"<p><br></p>"},updateFromTextArea:function(){this.editor.setHTML(""),this.editor.append(this.textarea.get("value")),this.cleanEditorHTML(),this.editor.getHTML()===""&&this.editor.setHTML(this._getEmptyContent())},updateOriginal:function(){var e=this.textarea.get("value"),t=this.getCleanHTML();return t===""&&this.isActive()&&(t=this._getEmptyContent()),e!==t&&(this.textarea.set("value",t),this.fire("change")),this}},e.
Base.mix(e.M.editor_ousupsub.Editor,[f]),l.ATTRS={},l.prototype={getCleanHTML:function(){var t=this.editor.cloneNode(!0),n,r="<p>",i="</p>";e.each(t.all('[id^="yui"]'),function(e){e.removeAttribute("id")}),e.each(t.all('[id^="selectionBoundary_"]'),function(e){e.remove()}),t.all(".ousupsub_control").remove(!0),n=t.get("innerHTML");if(n==="<p></p>"||n==="<p><br></p>")return"";if(n.indexOf(r)===0){var s=n.length-(r.length+i.length);n=n.substr(r.length,s)}return this._cleanHTML(n)},cleanEditorHTML:function(){var e=this.editor.get("innerHTML");return e.indexOf("<p>")!==0&&(e="<p>"+e+"</p>"),this.editor.set("innerHTML",this._cleanHTML(e)),this},_cleanHTML:function(e){var t=[{regex:/<p[^>]*>(&nbsp;|\s)*<\/p>/gi,replace:""},{regex:/<style[^>]*>[\s\S]*?<\/style>/gi,replace:""},{regex:/<!--(?![\s\S]*?-->)/gi,replace:""},{regex:/<\/?(?:title|meta|style|st\d|head|font|html|body|link)[^>]*?>/gi,replace:""}];return this._filterContentWithRules(e,t)},_filterContentWithRules:function(e,t){var n=0;for(n=0;n<t.length;n++)e=e.replace(t[n].regex,t[n].replace);return e},pasteCleanup:function(e){if(e.type==="paste"){var t=e._event;if(t&&t.clipboardData&&t.clipboardData.getData){var n=t.clipboardData.types,r=!1;if(!n)r=!1;else if(typeof n.contains=="function")r=n.contains("text/html");else{if(typeof n.indexOf!="function")return this.fallbackPasteCleanupDelayed(),!0;r=n.indexOf("text/html")>-1;if(!r)if(n.indexOf("com.apple.webarchive")>-1||n.indexOf("com.apple.iWork.TSPNativeData")>-1)return this.fallbackPasteCleanupDelayed(),!0}if(r){var i;try{i=t.clipboardData.getData("text/html")}catch(s){return this.fallbackPasteCleanupDelayed(),!0}e.preventDefault(),i=this._cleanPasteHTML(i);var o=window.rangy.saveSelection();return this.insertContentAtFocusPoint(i),window.rangy.restoreSelection(o),window.rangy.getSelection().collapseToEnd(),this.updateOriginal(),!1}return this.updateOriginalDelayed(),!0}return this.fallbackPasteCleanupDelayed(),!0}return this.updateOriginalDelayed(),!0},fallbackPasteCleanup:function(){var e=window.rangy.saveSelection(),t=this.editor.get("innerHTML");return this.editor.set("innerHTML",this._cleanPasteHTML(t)),this.updateOriginal(),window.rangy.restoreSelection(e),this},fallbackPasteCleanupDelayed:function(){return e.soon(e.bind(this.fallbackPasteCleanup,this)),this},_cleanPasteHTML:function(e){if(!e||e.length===0)return"";var t=[{regex:/<\s*\/html\s*>([\s\S]+)$/gi,replace:""},{regex:/<!--\[if[\s\S]*?endif\]-->/gi,replace:""},{regex:/<!--(Start|End)Fragment-->/gi,replace:""},{regex:/<xml[^>]*>[\s\S]*?<\/xml>/gi,replace:""},{regex:/<\?xml[^>]*>[\s\S]*?<\\\?xml>/gi,replace:""},{regex:/<\/?\w+:[^>]*>/gi,replace:""}];e=this._filterContentWithRules(e,t),e=this._cleanHTML(e);if(e.length===0||!e.match(/\S/))return e;var n=document.createElement("div");return n.innerHTML=e,e=n.innerHTML,n.innerHTML="",t=[{regex:/(<[^>]*?style\s*?=\s*?"[^>"]*?)(?:[\s]*MSO[-:][^>;"]*;?)+/gi,replace:"$1"},{regex:/(<[^>]*?class\s*?=\s*?"[^>"]*?)(?:[\s]*MSO[_a-zA-Z0-9\-]*)+/gi,replace:"$1"},{regex:/(<[^>]*?class\s*?=\s*?"[^>"]*?)(?:[\s]*Apple-[_a-zA-Z0-9\-]*)+/gi,replace:"$1"},{regex:/<a [^>]*?name\s*?=\s*?"OLE_LINK\d*?"[^>]*?>\s*?<\/a>/gi,replace:""},{regex:/<span(?![^>]*?rangySelectionBoundary[^>]*?)[^>]*>(&nbsp;|\s)*<\/span>/gi,replace:""}],e=this._filterContentWithRules(e,t),e=this._cleanHTML(e),e}},e.Base.mix(e.M.editor_ousupsub.Editor,[l]),c.ATTRS={},c.prototype={toolbar:null,openMenus:null,setupToolbar:function(){return this.toolbar=e.Node.create('<div class="'+r.TOOLBAR+'" role="toolbar" aria-live="off"/>'),this.openMenus=[],this._wrapper.appendChild(this.toolbar),this.textareaLabel&&this.toolbar.setAttribute("aria-labelledby",this.textareaLabel.get("id")),this.setupToolbarNavigation(),this}},e.Base.mix(e.M.editor_ousupsub.Editor,[c]),h.ATTRS={},h.prototype={_tabFocus:null,setupToolbarNavigation:function(){return this._registerEventHandle(this._wrapper.delegate("key",this.toolbarKeyboardNavigation,"down:37,39","."+r.TOOLBAR,this)),this._registerEventHandle(this._wrapper.delegate("focus",function(e){this._setTabFocus(e.currentTarget)},"."+r.TOOLBAR+" button",this)),this._registerEventHandle(this._wrapper.delegate("key",this._add_to_console,"up:38,40","."+r.TOOLBAR,this)),console.log("setuptool navigation"),this},_add_to_console:function(e){console.log("called _add_to_console")},_supsub_key_press:function(e){switch(e.type){case"sup":this.writeSupString(e.target);break;case"sub":this.writeSubString(e.target)}e.preventDefault()},toolbarKeyboardNavigation:function(e){e.preventDefault();var t=this.toolbar.all("button"),n=1,r,i=e.target.ancestor("button",!0);e.keyCode===37&&(n=-1),r=this._findFirstFocusable(t,i,n),r&&(r.focus(),this._setTabFocus(r))},_findFirstFocusable:function(e,t,n){var r=0,i,s,o,u;u=e.indexOf(t),u<-1&&(u=0);while(r<e.size()){u+=n,u<0?u=e.size()-1:u>=e.size()&&(u=0),s=e.item(u),r++;if(s.hasAttribute("hidden")||s.hasAttribute("disabled"))continue;i=s.ancestor(".ousupsub_group");if(i.hasAttribute("hidden"))continue;o=s;break}return o},checkTabFocus:function(){return this._tabFocus&&(this._tabFocus.hasAttribute("disabled")||this._tabFocus.hasAttribute("hidden")||this._tabFocus.ancestor(".ousupsub_group").hasAttribute("hidden"))&&(button=this._findFirstFocusable(this.toolbar.all("button"),this._tabFocus,-1),button&&(this._tabFocus.compareTo(document.activeElement)&&button.focus(),this._setTabFocus(button))),this},_setTabFocus:function(e){return this._tabFocus&&this._tabFocus.setAttribute("tabindex","-1"),this._tabFocus=e,this._tabFocus.setAttribute("tabindex",0),this.toolbar.setAttribute("aria-activedescendant",this._tabFocus.generateID()),this}},e.Base.mix(e.M.editor_ousupsub.Editor,[h]),p.ATTRS={},p.prototype={_selections:null,_lastSelection:null,_focusFromClick:!1,setupSelectionWatchers:function(){return this._registerEventHandle(this.on("ousupsub:selectionchanged",this.saveSelection,this)),this._registerEventHandle(this.editor.on("focus",this.restoreSelection,this)),this._registerEventHandle(this.editor
.on("mousedown",function(){this._focusFromClick=!0},this)),this._registerEventHandle(this.editor.on("blur",function(){this._focusFromClick=!1,this.updateOriginal()},this)),this._registerEventHandle(this.editor.on(["keyup","focus"],function(t){e.soon(e.bind(this._hasSelectionChanged,this,t))},this)),this._registerEventHandle(this.editor.on("gesturemoveend",function(t){e.soon(e.bind(this._hasSelectionChanged,this,t))},{standAlone:!0},this)),this},isActive:function(){var e=rangy.createRange(),t=rangy.getSelection();return t.rangeCount?!document.activeElement||!this.editor.compareTo(document.activeElement)&&!this.editor.contains(document.activeElement)?!1:(e.selectNode(this.editor.getDOMNode()),e.intersectsRange(t.getRangeAt(0))):!1},getSelectionFromNode:function(e){var t=rangy.createRange();return t.selectNode(e.getDOMNode()),[t]},saveSelection:function(){this.isActive()&&(this._selections=this.getSelection())},restoreSelection:function(){this._focusFromClick||this._selections&&this.setSelection(this._selections),this._focusFromClick=!1},getSelection:function(){return rangy.getSelection().getAllRanges()},selectionContainsNode:function(e){return rangy.getSelection().containsNode(e.getDOMNode(),!0)},selectionFilterMatches:function(e,t,n){typeof n=="undefined"&&(n=!0),t||(t=this.getSelectedNodes());var r=t.size()>0,i=!1,s=this.editor,o=function(e){return e===s};return s.one(e)?(t.each(function(t){if(n){if(!r||!t.ancestor(e,!0,o))r=!1}else!i&&t.ancestor(e,!0,o)&&(i=!0)},this),n?r:i):!1},getSelectedNodes:function(){var t=new e.NodeList,n,r,i,s,o;r=rangy.getSelection(),r.rangeCount?i=r.getRangeAt(0):i=rangy.createRange(),i.collapsed&&i.commonAncestorContainer!==this.editor.getDOMNode()&&i.commonAncestorContainer!==e.config.doc&&(i=i.cloneRange(),i.selectNode(i.commonAncestorContainer)),n=i.getNodes();for(o=0;o<n.length;o++)s=e.one(n[o]),this.editor.contains(s)&&t.push(s);return t},_hasSelectionChanged:function(e){var t=rangy.getSelection(),n,r=!1;return t.rangeCount?n=t.getRangeAt(0):n=rangy.createRange(),this._lastSelection&&!this._lastSelection.equals(n)?(r=!0,this._fireSelectionChanged(e)):(this._lastSelection=n,r)},_fireSelectionChanged:function(e){this.fire("ousupsub:selectionchanged",{event:e,selectedNodes:this.getSelectedNodes()})},getSelectionParentNode:function(){var e=rangy.getSelection();return e.rangeCount?e.getRangeAt(0).commonAncestorContainer:!1},setSelection:function(e){var t=rangy.getSelection();t.setRanges(e)},insertContentAtFocusPoint:function(t){var n=rangy.getSelection(),r,i=e.Node.create(t);return n.rangeCount&&(r=n.getRangeAt(0)),r&&(r.deleteContents(),r.insertNode(i.getDOMNode())),i}},e.Base.mix(e.M.editor_ousupsub.Editor,[p]),d.ATTRS={},d.prototype={disableCssStyling:function(){try{document.execCommand("styleWithCSS",0,!1)}catch(e){try{document.execCommand("useCSS",0,!0)}catch(t){try{document.execCommand("styleWithCSS",!1,!1)}catch(n){}}}},enableCssStyling:function(){try{document.execCommand("styleWithCSS",0,!0)}catch(e){try{document.execCommand("useCSS",0,!1)}catch(t){try{document.execCommand("styleWithCSS",!1,!0)}catch(n){}}}},toggleInlineSelectionClass:function(e){var t=e.join(" "),n=this.getSelection(),r=rangy.createCssClassApplier(t,{normalize:!0});r.toggleSelection(),this.setSelection(n)},formatSelectionInlineStyle:function(e){var t=this.PLACEHOLDER_CLASS,n=this.getSelection(),r=rangy.createCssClassApplier(t,{normalize:!0});r.applyToSelection(),this.editor.all("."+t).each(function(n){n.removeClass(t).setStyles(e)},this),this.setSelection(n)},formatSelectionBlock:function(t,n){var r=this.getSelectionParentNode(),i,s,o,u,a,f;if(!r)return!1;i=this.editor,r=e.one(r),s=r.ancestor(function(e){var t=e.get("tagName");return t&&(t=t.toLowerCase()),e===i||t==="td"||t==="th"},!0),s&&(i=s),o=r.ancestor(this.BLOCK_TAGS.join(", "),!0),o&&(a=o.ancestor(function(e){return e===i},!1),a||(o=!1)),o||(u=e.Node.create("<p></p>"),i.get("childNodes").each(function(e){u.append(e.remove())}),i.append(u),o=u),t&&t!==""&&(f=e.Node.create("<"+t+"></"+t+">"),f.setAttrs(o.getAttrs()),o.get("childNodes").each(function(e){e.remove(),f.append(e)}),o.replace(f),o=f),n&&o.setAttrs(n);var l=this.getSelectionFromNode(o);return this.setSelection(l),o}},e.Base.mix(e.M.editor_ousupsub.Editor,[d])},"@VERSION@",{requires:["node","overlay","escape","event","event-simulate","event-custom","yui-throttle","moodle-editor_ousupsub-manager","moodle-editor_ousupsub-rangy","handlebars","timers"]});
