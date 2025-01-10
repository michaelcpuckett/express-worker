!function(e,t,r,n,o){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof i[n]&&i[n],s=a.cache||{},c="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function f(t,r){if(!s[t]){if(!e[t]){var o="function"==typeof i[n]&&i[n];if(!r&&o)return o(t,!0);if(a)return a(t,!0);if(c&&"string"==typeof t)return c(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}d.resolve=function(r){var n=e[t][1][r];return null!=n?n:r},d.cache={};var p=s[t]=new f.Module(t);e[t][0].call(p.exports,d,p,p.exports,i)}return s[t].exports;function d(e){var t=d.resolve(e);return!1===t?{}:f(t)}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=s,f.parent=a,f.register=function(t,r){e[t]=[function(e,t){t.exports=r},{}]},Object.defineProperty(f,"root",{get:function(){return i[n]}}),i[n]=f;for(var u=0;u<t.length;u++)f(t[u]);if(r){var p=f(r);"object"==typeof exports&&"undefined"!=typeof module?module.exports=p:"function"==typeof define&&define.amd&&define(function(){return p})}}({"8RSWf":[function(e,t,r,n){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"_ExpressWorkerRequest",()=>a),o.export(r,"ExpressWorker",()=>f);var i=e("path-to-regexp");class a{_self;params={};constructor(e){this._self=e}}class s{ended=!1;_body="";_blob=null;_redirect="";_headers=new Headers;_status=200;html(e){return this._body=e,this._headers.set("Content-Type","text/html"),this}text(e){return this._body=e,this._headers.set("Content-Type","text/plain"),this}json(e){return this._body=JSON.stringify(e),this._headers.set("Content-Type","application/json"),this}blob(e){return this._blob=e,this._headers.set("Content-Type",e.type),this}send(e){return"string"==typeof e?this._headers.has("Content-Type")?this._body=e:this.html(e):this.json(e),this.end(),this}status(e){return this._status=e,this}set(e,t){return this._headers.set(e,t),this}end(){return this.ended=!0,this}redirect(e){return this._redirect=e,this}_toResponse(){return this._redirect?Response.redirect(this._redirect,303):new Response(this._blob??this._body,{status:this._status,headers:this._headers})}}let c={get:(e,t)=>{if("params"===t)return e.params;let r=e._self[t];return"function"==typeof r?r.bind(e._self):r||e[t]}};class f{_debug=!1;paths={GET:[],POST:[],PATCH:[],PUT:[],DELETE:[],USE:[]};boundFetchHandler=this.handleFetch.bind(this);constructor(e){self.addEventListener("fetch",this.boundFetchHandler),e?.debug&&(this._debug=!0,console.log("ExpressWorker initialized"))}get(e,t){this.paths.GET.push([e,t])}post(e,t){this.paths.POST.push([e,t])}put(e,t){this.paths.PUT.push([e,t])}patch(e,t){this.paths.PATCH.push([e,t])}delete(e,t){this.paths.DELETE.push([e,t])}use(e){this.paths.USE.push(e.bind(this))}async handleRequest(e){if(!(e instanceof FetchEvent))throw Error("Event must be a FetchEvent");let t=e.request,r=new Proxy(new a(t),c),n=new s;if(!(r instanceof a))throw Error("Request must be a proxied ExpressWorkerRequest.");for(let e of this.paths.USE)if(await e(r,n),n.ended)break;let o=!1;if(!this.isMethodEnum(t.method))throw Error("Must be a valid method.");for(let[e,a]of this.paths[t.method]){if(n.ended)break;if("*"===e)continue;let s=[],c=(0,i.pathToRegexp)(e,s).exec(new URL(t.url).pathname);if(!c)continue;let f=Object.fromEntries(s.map((e,t)=>[e.name,c?.[t+1]]).filter(Boolean));r.params=f,await a(r,n),o=!0}if(!o)for(let[e,i]of this.paths[t.method]){if(n.ended)break;"*"===e&&(await i(r,n),o=!0)}return o?n._toResponse():fetch(t)}handleFetch(e){if(!(e instanceof FetchEvent))throw Error("ExpressWorkerApp must be initialized with a FetchEvent");if(this.isMethodEnum(e.request.method))return e.respondWith(this.handleRequest(e))}isMethodEnum(e){return"GET"===e||"POST"===e||"PATCH"===e||"PUT"===e||"DELETE"===e}__reset(){this.paths={GET:[],POST:[],PATCH:[],PUT:[],DELETE:[],USE:[]}}static applyAdditionalRequestProperties(e){return async(t,r)=>await e(t,r)}}},{"path-to-regexp":"bN5Da","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bN5Da:[function(e,t,r,n){var o=e("@parcel/transformer-js/src/esmodule-helpers.js");function i(e,t){void 0===t&&(t={});for(var r=function(e){for(var t=[],r=0;r<e.length;){var n=e[r];if("*"===n||"+"===n||"?"===n){t.push({type:"MODIFIER",index:r,value:e[r++]});continue}if("\\"===n){t.push({type:"ESCAPED_CHAR",index:r++,value:e[r++]});continue}if("{"===n){t.push({type:"OPEN",index:r,value:e[r++]});continue}if("}"===n){t.push({type:"CLOSE",index:r,value:e[r++]});continue}if(":"===n){for(var o="",i=r+1;i<e.length;){var a=e.charCodeAt(i);if(a>=48&&a<=57||a>=65&&a<=90||a>=97&&a<=122||95===a){o+=e[i++];continue}break}if(!o)throw TypeError("Missing parameter name at ".concat(r));t.push({type:"NAME",index:r,value:o}),r=i;continue}if("("===n){var s=1,c="",i=r+1;if("?"===e[i])throw TypeError('Pattern cannot start with "?" at '.concat(i));for(;i<e.length;){if("\\"===e[i]){c+=e[i++]+e[i++];continue}if(")"===e[i]){if(0==--s){i++;break}}else if("("===e[i]&&(s++,"?"!==e[i+1]))throw TypeError("Capturing groups are not allowed at ".concat(i));c+=e[i++]}if(s)throw TypeError("Unbalanced pattern at ".concat(r));if(!c)throw TypeError("Missing pattern at ".concat(r));t.push({type:"PATTERN",index:r,value:c}),r=i;continue}t.push({type:"CHAR",index:r,value:e[r++]})}return t.push({type:"END",index:r,value:""}),t}(e),n=t.prefixes,o=void 0===n?"./":n,i=t.delimiter,a=void 0===i?"/#?":i,s=[],c=0,f=0,p="",d=function(e){if(f<r.length&&r[f].type===e)return r[f++].value},h=function(e){var t=d(e);if(void 0!==t)return t;var n=r[f],o=n.type,i=n.index;throw TypeError("Unexpected ".concat(o," at ").concat(i,", expected ").concat(e))},l=function(){for(var e,t="";e=d("CHAR")||d("ESCAPED_CHAR");)t+=e;return t},v=function(e){for(var t=0;t<a.length;t++){var r=a[t];if(e.indexOf(r)>-1)return!0}return!1},m=function(e){var t=s[s.length-1],r=e||(t&&"string"==typeof t?t:"");if(t&&!r)throw TypeError('Must have text between two parameters, missing text after "'.concat(t.name,'"'));return!r||v(r)?"[^".concat(u(a),"]+?"):"(?:(?!".concat(u(r),")[^").concat(u(a),"])+?")};f<r.length;){var E=d("CHAR"),x=d("NAME"),y=d("PATTERN");if(x||y){var g=E||"";-1===o.indexOf(g)&&(p+=g,g=""),p&&(s.push(p),p=""),s.push({name:x||c++,prefix:g,suffix:"",pattern:y||m(g),modifier:d("MODIFIER")||""});continue}var b=E||d("ESCAPED_CHAR");if(b){p+=b;continue}if(p&&(s.push(p),p=""),d("OPEN")){var g=l(),T=d("NAME")||"",_=d("PATTERN")||"",w=l();h("CLOSE"),s.push({name:T||(_?c++:""),pattern:T&&!_?m(g):_,prefix:g,suffix:w,modifier:d("MODIFIER")||""});continue}h("END")}return s}function a(e,t){return s(i(e,t),t)}function s(e,t){void 0===t&&(t={});var r=p(t),n=t.encode,o=void 0===n?function(e){return e}:n,i=t.validate,a=void 0===i||i,s=e.map(function(e){if("object"==typeof e)return new RegExp("^(?:".concat(e.pattern,")$"),r)});return function(t){for(var r="",n=0;n<e.length;n++){var i=e[n];if("string"==typeof i){r+=i;continue}var c=t?t[i.name]:void 0,f="?"===i.modifier||"*"===i.modifier,u="*"===i.modifier||"+"===i.modifier;if(Array.isArray(c)){if(!u)throw TypeError('Expected "'.concat(i.name,'" to not repeat, but got an array'));if(0===c.length){if(f)continue;throw TypeError('Expected "'.concat(i.name,'" to not be empty'))}for(var p=0;p<c.length;p++){var d=o(c[p],i);if(a&&!s[n].test(d))throw TypeError('Expected all "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(d,'"'));r+=i.prefix+d+i.suffix}continue}if("string"==typeof c||"number"==typeof c){var d=o(String(c),i);if(a&&!s[n].test(d))throw TypeError('Expected "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(d,'"'));r+=i.prefix+d+i.suffix;continue}if(!f){var h=u?"an array":"a string";throw TypeError('Expected "'.concat(i.name,'" to be ').concat(h))}}return r}}function c(e,t){var r=[];return f(h(e,r,t),r,t)}function f(e,t,r){void 0===r&&(r={});var n=r.decode,o=void 0===n?function(e){return e}:n;return function(r){var n=e.exec(r);if(!n)return!1;for(var i=n[0],a=n.index,s=Object.create(null),c=1;c<n.length;c++)!function(e){if(void 0!==n[e]){var r=t[e-1];"*"===r.modifier||"+"===r.modifier?s[r.name]=n[e].split(r.prefix+r.suffix).map(function(e){return o(e,r)}):s[r.name]=o(n[e],r)}}(c);return{path:i,index:a,params:s}}}function u(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function p(e){return e&&e.sensitive?"":"i"}function d(e,t,r){void 0===r&&(r={});for(var n=r.strict,o=void 0!==n&&n,i=r.start,a=r.end,s=r.encode,c=void 0===s?function(e){return e}:s,f=r.delimiter,d=r.endsWith,h="[".concat(u(void 0===d?"":d),"]|$"),l="[".concat(u(void 0===f?"/#?":f),"]"),v=void 0===i||i?"^":"",m=0;m<e.length;m++){var E=e[m];if("string"==typeof E)v+=u(c(E));else{var x=u(c(E.prefix)),y=u(c(E.suffix));if(E.pattern){if(t&&t.push(E),x||y){if("+"===E.modifier||"*"===E.modifier){var g="*"===E.modifier?"?":"";v+="(?:".concat(x,"((?:").concat(E.pattern,")(?:").concat(y).concat(x,"(?:").concat(E.pattern,"))*)").concat(y,")").concat(g)}else v+="(?:".concat(x,"(").concat(E.pattern,")").concat(y,")").concat(E.modifier)}else{if("+"===E.modifier||"*"===E.modifier)throw TypeError('Can not repeat "'.concat(E.name,'" without a prefix and suffix'));v+="(".concat(E.pattern,")").concat(E.modifier)}}else v+="(?:".concat(x).concat(y,")").concat(E.modifier)}}if(void 0===a||a)o||(v+="".concat(l,"?")),v+=r.endsWith?"(?=".concat(h,")"):"$";else{var b=e[e.length-1],T="string"==typeof b?l.indexOf(b[b.length-1])>-1:void 0===b;o||(v+="(?:".concat(l,"(?=").concat(h,"))?")),T||(v+="(?=".concat(l,"|").concat(h,")"))}return new RegExp(v,p(r))}function h(e,t,r){var n;return e instanceof RegExp?function(e,t){if(!t)return e;for(var r=/\((?:\?<(.*?)>)?(?!\?)/g,n=0,o=r.exec(e.source);o;)t.push({name:o[1]||n++,prefix:"",suffix:"",modifier:"",pattern:""}),o=r.exec(e.source);return e}(e,t):Array.isArray(e)?(n=e.map(function(e){return h(e,t,r).source}),new RegExp("(?:".concat(n.join("|"),")"),p(r))):d(i(e,r),t,r)}o.defineInteropFlag(r),o.export(r,"parse",()=>i),o.export(r,"compile",()=>a),o.export(r,"tokensToFunction",()=>s),o.export(r,"match",()=>c),o.export(r,"regexpToFunction",()=>f),o.export(r,"tokensToRegexp",()=>d),o.export(r,"pathToRegexp",()=>h)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,r,n){r.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},r.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.exportAll=function(e,t){return Object.keys(e).forEach(function(r){"default"===r||"__esModule"===r||Object.prototype.hasOwnProperty.call(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[r]}})}),t},r.export=function(e,t,r){Object.defineProperty(e,t,{enumerable:!0,get:r})}},{}]},["8RSWf"],"8RSWf","parcelRequire94c2");
//# sourceMappingURL=express-worker.js.map
