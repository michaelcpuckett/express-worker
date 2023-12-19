(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ExpressWorker = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
!function(e,t,r,n,o){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof i[n]&&i[n],s=a.cache||{},f="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function c(t,r){if(!s[t]){if(!e[t]){var o="function"==typeof i[n]&&i[n];if(!r&&o)return o(t,!0);if(a)return a(t,!0);if(f&&"string"==typeof t)return f(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}p.resolve=function(r){var n=e[t][1][r];return null!=n?n:r},p.cache={};var d=s[t]=new c.Module(t);e[t][0].call(d.exports,p,d,d.exports,this)}return s[t].exports;function p(e){var t=p.resolve(e);return!1===t?{}:c(t)}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.exports={}},c.modules=e,c.cache=s,c.parent=a,c.register=function(t,r){e[t]=[function(e,t){t.exports=r},{}]},Object.defineProperty(c,"root",{get:function(){return i[n]}}),i[n]=c;for(var u=0;u<t.length;u++)c(t[u]);if(r){var d=c(r);"object"==typeof exports&&"undefined"!=typeof module?module.exports=d:"function"==typeof define&&define.amd?define(function(){return d}):o&&(this[o]=d)}}({"8RSWf":[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"_ExpressWorkerRequest",()=>i),n.export(r,"ExpressWorker",()=>c),n.export(r,"applyAdditionalRequestProperties",()=>u);var o=e("path-to-regexp");class i{_self;params={};constructor(e){this._self=e}}class a extends Response{_body="";_blob=null;_redirect="";_ended=!1;_headers=new Headers;_status=200;__html(e){return this._body=e,this._headers.set("Content-Type","text/html"),this}__text(e){return this._body=e,this._headers.set("Content-Type","text/plain"),this}__json(e){return this._body=JSON.stringify(e),this._headers.set("Content-Type","application/json"),this}__blob(e){return this._blob=e,this._headers.set("Content-Type",e.type),this}__send(e){return"string"==typeof e?this._headers.has("Content-Type")?this._body=e:this.__html(e):this.__json(e),this.end(),this}__status(e){return this._status=e,this}set(e,t){return this._headers.set(e,t),this}end(){return this._ended=!0,this}redirect(e){return this._redirect=e,this}}let s={get:(e,t)=>"formData"===t?e._self.formData.bind(e._self):"blob"===t?e._self.blob.bind(e._self):"json"===t?e._self.json.bind(e._self):"text"===t?e._self.text.bind(e._self):"arrayBuffer"===t?e._self.arrayBuffer.bind(e._self):"body"===t?e._self.body:"headers"===t?e._self.headers:"url"===t?e._self.url:"method"===t?e._self.method:e[t]},f={get:(e,t)=>"body"===t?e._body:"headers"===t?e._headers:"blob"===t?e.__blob:"html"===t?e.__html:"text"===t?e.__text:"json"===t?e.__json:"send"===t?e.__send:"status"===t?e.__status:"_self"===t?e:e[t],set:(e,t,r)=>("status"===t?e.__status(r):"body"===t?e._body=r:e[t]=r,!0)};class c{_debug=!1;_forward=!1;paths={GET:[],POST:[],PATCH:[],PUT:[],DELETE:[],USE:[]};boundFetchHandler=this.handleFetch.bind(this);constructor(e){self.addEventListener("fetch",this.boundFetchHandler),e?.debug&&(this._debug=!0,console.log("ExpressWorker initialized")),e?.forward&&(this._forward=!0)}get(e,t){this.paths.GET.push([e,t])}post(e,t){this.paths.POST.push([e,t])}put(e,t){this.paths.PUT.push([e,t])}patch(e,t){this.paths.PATCH.push([e,t])}delete(e,t){this.paths.DELETE.push([e,t])}use(e){this.paths.USE.push(e.bind(this))}async handleRequest(e){if(!(e instanceof FetchEvent))throw Error("Event must be a FetchEvent");let t=e.request,r=new Proxy(new i(t),s),n=new Proxy(new a,f);if(!(r instanceof i&&"params"in r))throw Error("Request must be a modified request");if(!(n instanceof a&&"_body"in n&&"_headers"in n))throw Error("Response must be a modified response");for(let e of this.paths.USE)if(await e(r,n),n._ended)break;let c=!1;for(let[e,i]of this.paths[t.method]){if(n._ended)break;if("*"===e)continue;let a=[],s=(0,o.pathToRegexp)(e,a).exec(new URL(t.url).pathname);if(!s)continue;let f=Object.fromEntries(a.map((e,t)=>[e.name,s?.[t+1]]).filter(Boolean));r.params=f,await i(r,n),c=!0}if(!c)for(let[e,o]of this.paths[t.method]){if(n._ended)break;"*"===e&&(await o(r,n),c=!0)}if(!c)return this._forward?fetch(t):new Response("Not Found",{status:404});let{_body:u,_status:d,_headers:p,_blob:h,_redirect:l}=n;return(this._debug&&console.log(this,r._self,n._self),l)?Response.redirect(l,303):new Response(h||u||"",{status:d,headers:p})}handleFetch(e){if(!(e instanceof FetchEvent))throw Error("ExpressWorkerApp must be initialized with a FetchEvent");if(this.isMethodEnum(e.request.method))return e.respondWith(this.handleRequest(e))}isMethodEnum(e){return"GET"===e||"POST"===e||"PATCH"===e||"PUT"===e||"DELETE"===e}__reset(){this.paths={GET:[],POST:[],PATCH:[],PUT:[],DELETE:[],USE:[]}}}function u(e){return async(t,r)=>await e(t,r)}},{"path-to-regexp":"bN5Da","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bN5Da:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function o(e,t){void 0===t&&(t={});for(var r=function(e){for(var t=[],r=0;r<e.length;){var n=e[r];if("*"===n||"+"===n||"?"===n){t.push({type:"MODIFIER",index:r,value:e[r++]});continue}if("\\"===n){t.push({type:"ESCAPED_CHAR",index:r++,value:e[r++]});continue}if("{"===n){t.push({type:"OPEN",index:r,value:e[r++]});continue}if("}"===n){t.push({type:"CLOSE",index:r,value:e[r++]});continue}if(":"===n){for(var o="",i=r+1;i<e.length;){var a=e.charCodeAt(i);if(a>=48&&a<=57||a>=65&&a<=90||a>=97&&a<=122||95===a){o+=e[i++];continue}break}if(!o)throw TypeError("Missing parameter name at ".concat(r));t.push({type:"NAME",index:r,value:o}),r=i;continue}if("("===n){var s=1,f="",i=r+1;if("?"===e[i])throw TypeError('Pattern cannot start with "?" at '.concat(i));for(;i<e.length;){if("\\"===e[i]){f+=e[i++]+e[i++];continue}if(")"===e[i]){if(0==--s){i++;break}}else if("("===e[i]&&(s++,"?"!==e[i+1]))throw TypeError("Capturing groups are not allowed at ".concat(i));f+=e[i++]}if(s)throw TypeError("Unbalanced pattern at ".concat(r));if(!f)throw TypeError("Missing pattern at ".concat(r));t.push({type:"PATTERN",index:r,value:f}),r=i;continue}t.push({type:"CHAR",index:r,value:e[r++]})}return t.push({type:"END",index:r,value:""}),t}(e),n=t.prefixes,o=void 0===n?"./":n,i="[^".concat(c(t.delimiter||"/#?"),"]+?"),a=[],s=0,f=0,u="",d=function(e){if(f<r.length&&r[f].type===e)return r[f++].value},p=function(e){var t=d(e);if(void 0!==t)return t;var n=r[f],o=n.type,i=n.index;throw TypeError("Unexpected ".concat(o," at ").concat(i,", expected ").concat(e))},h=function(){for(var e,t="";e=d("CHAR")||d("ESCAPED_CHAR");)t+=e;return t};f<r.length;){var l=d("CHAR"),_=d("NAME"),m=d("PATTERN");if(_||m){var v=l||"";-1===o.indexOf(v)&&(u+=v,v=""),u&&(a.push(u),u=""),a.push({name:_||s++,prefix:v,suffix:"",pattern:m||i,modifier:d("MODIFIER")||""});continue}var x=l||d("ESCAPED_CHAR");if(x){u+=x;continue}if(u&&(a.push(u),u=""),d("OPEN")){var v=h(),E=d("NAME")||"",y=d("PATTERN")||"",b=h();p("CLOSE"),a.push({name:E||(y?s++:""),pattern:E&&!y?i:y,prefix:v,suffix:b,modifier:d("MODIFIER")||""});continue}p("END")}return a}function i(e,t){return a(o(e,t),t)}function a(e,t){void 0===t&&(t={});var r=u(t),n=t.encode,o=void 0===n?function(e){return e}:n,i=t.validate,a=void 0===i||i,s=e.map(function(e){if("object"==typeof e)return new RegExp("^(?:".concat(e.pattern,")$"),r)});return function(t){for(var r="",n=0;n<e.length;n++){var i=e[n];if("string"==typeof i){r+=i;continue}var f=t?t[i.name]:void 0,c="?"===i.modifier||"*"===i.modifier,u="*"===i.modifier||"+"===i.modifier;if(Array.isArray(f)){if(!u)throw TypeError('Expected "'.concat(i.name,'" to not repeat, but got an array'));if(0===f.length){if(c)continue;throw TypeError('Expected "'.concat(i.name,'" to not be empty'))}for(var d=0;d<f.length;d++){var p=o(f[d],i);if(a&&!s[n].test(p))throw TypeError('Expected all "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(p,'"'));r+=i.prefix+p+i.suffix}continue}if("string"==typeof f||"number"==typeof f){var p=o(String(f),i);if(a&&!s[n].test(p))throw TypeError('Expected "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(p,'"'));r+=i.prefix+p+i.suffix;continue}if(!c){var h=u?"an array":"a string";throw TypeError('Expected "'.concat(i.name,'" to be ').concat(h))}}return r}}function s(e,t){var r=[];return f(p(e,r,t),r,t)}function f(e,t,r){void 0===r&&(r={});var n=r.decode,o=void 0===n?function(e){return e}:n;return function(r){var n=e.exec(r);if(!n)return!1;for(var i=n[0],a=n.index,s=Object.create(null),f=1;f<n.length;f++)!function(e){if(void 0!==n[e]){var r=t[e-1];"*"===r.modifier||"+"===r.modifier?s[r.name]=n[e].split(r.prefix+r.suffix).map(function(e){return o(e,r)}):s[r.name]=o(n[e],r)}}(f);return{path:i,index:a,params:s}}}function c(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function u(e){return e&&e.sensitive?"":"i"}function d(e,t,r){void 0===r&&(r={});for(var n=r.strict,o=void 0!==n&&n,i=r.start,a=r.end,s=r.encode,f=void 0===s?function(e){return e}:s,d=r.delimiter,p=r.endsWith,h="[".concat(c(void 0===p?"":p),"]|$"),l="[".concat(c(void 0===d?"/#?":d),"]"),_=void 0===i||i?"^":"",m=0;m<e.length;m++){var v=e[m];if("string"==typeof v)_+=c(f(v));else{var x=c(f(v.prefix)),E=c(f(v.suffix));if(v.pattern){if(t&&t.push(v),x||E){if("+"===v.modifier||"*"===v.modifier){var y="*"===v.modifier?"?":"";_+="(?:".concat(x,"((?:").concat(v.pattern,")(?:").concat(E).concat(x,"(?:").concat(v.pattern,"))*)").concat(E,")").concat(y)}else _+="(?:".concat(x,"(").concat(v.pattern,")").concat(E,")").concat(v.modifier)}else"+"===v.modifier||"*"===v.modifier?_+="((?:".concat(v.pattern,")").concat(v.modifier,")"):_+="(".concat(v.pattern,")").concat(v.modifier)}else _+="(?:".concat(x).concat(E,")").concat(v.modifier)}}if(void 0===a||a)o||(_+="".concat(l,"?")),_+=r.endsWith?"(?=".concat(h,")"):"$";else{var b=e[e.length-1],g="string"==typeof b?l.indexOf(b[b.length-1])>-1:void 0===b;o||(_+="(?:".concat(l,"(?=").concat(h,"))?")),g||(_+="(?=".concat(l,"|").concat(h,")"))}return new RegExp(_,u(r))}function p(e,t,r){var n;return e instanceof RegExp?function(e,t){if(!t)return e;for(var r=/\((?:\?<(.*?)>)?(?!\?)/g,n=0,o=r.exec(e.source);o;)t.push({name:o[1]||n++,prefix:"",suffix:"",modifier:"",pattern:""}),o=r.exec(e.source);return e}(e,t):Array.isArray(e)?(n=e.map(function(e){return p(e,t,r).source}),new RegExp("(?:".concat(n.join("|"),")"),u(r))):d(o(e,r),t,r)}n.defineInteropFlag(r),n.export(r,"parse",()=>o),n.export(r,"compile",()=>i),n.export(r,"tokensToFunction",()=>a),n.export(r,"match",()=>s),n.export(r,"regexpToFunction",()=>f),n.export(r,"tokensToRegexp",()=>d),n.export(r,"pathToRegexp",()=>p)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,r){r.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},r.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.exportAll=function(e,t){return Object.keys(e).forEach(function(r){"default"===r||"__esModule"===r||Object.prototype.hasOwnProperty.call(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[r]}})}),t},r.export=function(e,t,r){Object.defineProperty(e,t,{enumerable:!0,get:r})}},{}]},["8RSWf"],"8RSWf","parcelRequire24ce");


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
