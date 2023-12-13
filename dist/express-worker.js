!function(e,t,n,r,o){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof i[r]&&i[r],s=a.cache||{},c="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function f(t,n){if(!s[t]){if(!e[t]){var o="function"==typeof i[r]&&i[r];if(!n&&o)return o(t,!0);if(a)return a(t,!0);if(c&&"string"==typeof t)return c(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}d.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},d.cache={};var p=s[t]=new f.Module(t);e[t][0].call(p.exports,d,p,p.exports,this)}return s[t].exports;function d(e){var t=d.resolve(e);return!1===t?{}:f(t)}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=s,f.parent=a,f.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(f,"root",{get:function(){return i[r]}}),i[r]=f;for(var u=0;u<t.length;u++)f(t[u]);if(n){var p=f(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=p:"function"==typeof define&&define.amd?define(function(){return p}):o&&(this[o]=p)}}({"8RSWf":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"_ExpressWorkerRequest",()=>i),r.export(n,"ExpressWorker",()=>f),r.export(n,"applyAdditionalRequestProperties",()=>u);var o=e("path-to-regexp");class i{_self;params={};constructor(e){this._self=e}}class a extends Response{_body="";_blob=null;_redirect="";_ended=!1;_headers=new Headers;status=200;__html(e){this._body=e,this._headers.set("Content-Type","text/html")}__text(e){this._body=e,this._headers.set("Content-Type","text/plain")}__json(e){this._body=JSON.stringify(e),this._headers.set("Content-Type","application/json")}__blob(e){this._blob=e,this._headers.set("Content-Type",e.type)}__send(e){"string"==typeof e?this._headers.has("Content-Type")?this._body=e:this.__html(e):this.__json(e),this.end()}end(){this._ended=!0}redirect(e){this._redirect=e}}let s={get:(e,t)=>"formData"===t?e._self.formData.bind(e._self):"blob"===t?e._self.blob.bind(e._self):"json"===t?e._self.json.bind(e._self):"text"===t?e._self.text.bind(e._self):"arrayBuffer"===t?e._self.arrayBuffer.bind(e._self):"body"===t?e._self.body:e[t]},c={get:(e,t)=>"body"===t?e._body:"headers"===t?e._headers:"blob"===t?e.__blob:"html"===t?e.__html:"text"===t?e.__text:"json"===t?e.__json:"send"===t?e.__send:"_self"===t?e:e[t],set:(e,t,n)=>("body"===t?e._body=n:e[t]=n,!0)};class f{debug=!1;paths={GET:[],POST:[],PATCH:[],PUT:[],DELETE:[],USE:[]};boundFetchHandler=this.handleFetch.bind(this);constructor(e){self.addEventListener("fetch",this.boundFetchHandler),e?.debug&&(this.debug=!0,console.log("ExpressWorker initialized"))}get(e,t){this.paths.GET.push([e,t])}post(e,t){this.paths.POST.push([e,t])}put(e,t){this.paths.PUT.push([e,t])}patch(e,t){this.paths.PATCH.push([e,t])}delete(e,t){this.paths.DELETE.push([e,t])}use(e){this.paths.USE.push(e.bind(this))}async handleRequest(e){if(!(e instanceof FetchEvent))throw Error("Event must be a FetchEvent");let t=e.request,n=new Proxy(new i(t),s),r=new Proxy(new a,c);if(!(n instanceof i&&"params"in n))throw Error("Request must be a modified request");if(!(r instanceof a&&"_body"in r&&"_headers"in r))throw Error("Response must be a modified response");for(let e of this.paths.USE)if(await e(n,r),r._ended)continue;for(let[e,i]of this.paths[t.method]){if(r._ended)continue;let a=[],s=(0,o.pathToRegexp)(e,a).exec(new URL(t.url).pathname);if(!s)continue;let c=Object.fromEntries(a.map((e,t)=>[e.name,s?.[t+1]]).filter(Boolean));n.params=c,await i(n,r)}let{_body:f,status:u,_headers:p,_blob:d,_redirect:l}=r;if(this.debug&&console.log(this,n._self,r._self),l)return Response.redirect(l,303);let h=f||d;return h?new Response(h,{status:u,headers:p}):new Response("Not found",{status:404})}handleFetch(e){if(!(e instanceof FetchEvent))throw Error("ExpressWorkerApp must be initialized with a FetchEvent");if(this.isMethodEnum(e.request.method))return e.respondWith(this.handleRequest(e))}isMethodEnum(e){return"GET"===e||"POST"===e||"PATCH"===e||"PUT"===e||"DELETE"===e}__reset(){this.paths={GET:[],POST:[],PATCH:[],PUT:[],DELETE:[],USE:[]}}}function u(e){return async(t,n)=>await e(t,n)}},{"path-to-regexp":"bN5Da","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bN5Da:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function o(e,t){void 0===t&&(t={});for(var n=function(e){for(var t=[],n=0;n<e.length;){var r=e[n];if("*"===r||"+"===r||"?"===r){t.push({type:"MODIFIER",index:n,value:e[n++]});continue}if("\\"===r){t.push({type:"ESCAPED_CHAR",index:n++,value:e[n++]});continue}if("{"===r){t.push({type:"OPEN",index:n,value:e[n++]});continue}if("}"===r){t.push({type:"CLOSE",index:n,value:e[n++]});continue}if(":"===r){for(var o="",i=n+1;i<e.length;){var a=e.charCodeAt(i);if(a>=48&&a<=57||a>=65&&a<=90||a>=97&&a<=122||95===a){o+=e[i++];continue}break}if(!o)throw TypeError("Missing parameter name at ".concat(n));t.push({type:"NAME",index:n,value:o}),n=i;continue}if("("===r){var s=1,c="",i=n+1;if("?"===e[i])throw TypeError('Pattern cannot start with "?" at '.concat(i));for(;i<e.length;){if("\\"===e[i]){c+=e[i++]+e[i++];continue}if(")"===e[i]){if(0==--s){i++;break}}else if("("===e[i]&&(s++,"?"!==e[i+1]))throw TypeError("Capturing groups are not allowed at ".concat(i));c+=e[i++]}if(s)throw TypeError("Unbalanced pattern at ".concat(n));if(!c)throw TypeError("Missing pattern at ".concat(n));t.push({type:"PATTERN",index:n,value:c}),n=i;continue}t.push({type:"CHAR",index:n,value:e[n++]})}return t.push({type:"END",index:n,value:""}),t}(e),r=t.prefixes,o=void 0===r?"./":r,i="[^".concat(f(t.delimiter||"/#?"),"]+?"),a=[],s=0,c=0,u="",p=function(e){if(c<n.length&&n[c].type===e)return n[c++].value},d=function(e){var t=p(e);if(void 0!==t)return t;var r=n[c],o=r.type,i=r.index;throw TypeError("Unexpected ".concat(o," at ").concat(i,", expected ").concat(e))},l=function(){for(var e,t="";e=p("CHAR")||p("ESCAPED_CHAR");)t+=e;return t};c<n.length;){var h=p("CHAR"),m=p("NAME"),v=p("PATTERN");if(m||v){var x=h||"";-1===o.indexOf(x)&&(u+=x,x=""),u&&(a.push(u),u=""),a.push({name:m||s++,prefix:x,suffix:"",pattern:v||i,modifier:p("MODIFIER")||""});continue}var E=h||p("ESCAPED_CHAR");if(E){u+=E;continue}if(u&&(a.push(u),u=""),p("OPEN")){var x=l(),y=p("NAME")||"",_=p("PATTERN")||"",b=l();d("CLOSE"),a.push({name:y||(_?s++:""),pattern:y&&!_?i:_,prefix:x,suffix:b,modifier:p("MODIFIER")||""});continue}d("END")}return a}function i(e,t){return a(o(e,t),t)}function a(e,t){void 0===t&&(t={});var n=u(t),r=t.encode,o=void 0===r?function(e){return e}:r,i=t.validate,a=void 0===i||i,s=e.map(function(e){if("object"==typeof e)return new RegExp("^(?:".concat(e.pattern,")$"),n)});return function(t){for(var n="",r=0;r<e.length;r++){var i=e[r];if("string"==typeof i){n+=i;continue}var c=t?t[i.name]:void 0,f="?"===i.modifier||"*"===i.modifier,u="*"===i.modifier||"+"===i.modifier;if(Array.isArray(c)){if(!u)throw TypeError('Expected "'.concat(i.name,'" to not repeat, but got an array'));if(0===c.length){if(f)continue;throw TypeError('Expected "'.concat(i.name,'" to not be empty'))}for(var p=0;p<c.length;p++){var d=o(c[p],i);if(a&&!s[r].test(d))throw TypeError('Expected all "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(d,'"'));n+=i.prefix+d+i.suffix}continue}if("string"==typeof c||"number"==typeof c){var d=o(String(c),i);if(a&&!s[r].test(d))throw TypeError('Expected "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(d,'"'));n+=i.prefix+d+i.suffix;continue}if(!f){var l=u?"an array":"a string";throw TypeError('Expected "'.concat(i.name,'" to be ').concat(l))}}return n}}function s(e,t){var n=[];return c(d(e,n,t),n,t)}function c(e,t,n){void 0===n&&(n={});var r=n.decode,o=void 0===r?function(e){return e}:r;return function(n){var r=e.exec(n);if(!r)return!1;for(var i=r[0],a=r.index,s=Object.create(null),c=1;c<r.length;c++)!function(e){if(void 0!==r[e]){var n=t[e-1];"*"===n.modifier||"+"===n.modifier?s[n.name]=r[e].split(n.prefix+n.suffix).map(function(e){return o(e,n)}):s[n.name]=o(r[e],n)}}(c);return{path:i,index:a,params:s}}}function f(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function u(e){return e&&e.sensitive?"":"i"}function p(e,t,n){void 0===n&&(n={});for(var r=n.strict,o=void 0!==r&&r,i=n.start,a=n.end,s=n.encode,c=void 0===s?function(e){return e}:s,p=n.delimiter,d=n.endsWith,l="[".concat(f(void 0===d?"":d),"]|$"),h="[".concat(f(void 0===p?"/#?":p),"]"),m=void 0===i||i?"^":"",v=0;v<e.length;v++){var x=e[v];if("string"==typeof x)m+=f(c(x));else{var E=f(c(x.prefix)),y=f(c(x.suffix));if(x.pattern){if(t&&t.push(x),E||y){if("+"===x.modifier||"*"===x.modifier){var _="*"===x.modifier?"?":"";m+="(?:".concat(E,"((?:").concat(x.pattern,")(?:").concat(y).concat(E,"(?:").concat(x.pattern,"))*)").concat(y,")").concat(_)}else m+="(?:".concat(E,"(").concat(x.pattern,")").concat(y,")").concat(x.modifier)}else"+"===x.modifier||"*"===x.modifier?m+="((?:".concat(x.pattern,")").concat(x.modifier,")"):m+="(".concat(x.pattern,")").concat(x.modifier)}else m+="(?:".concat(E).concat(y,")").concat(x.modifier)}}if(void 0===a||a)o||(m+="".concat(h,"?")),m+=n.endsWith?"(?=".concat(l,")"):"$";else{var b=e[e.length-1],g="string"==typeof b?h.indexOf(b[b.length-1])>-1:void 0===b;o||(m+="(?:".concat(h,"(?=").concat(l,"))?")),g||(m+="(?=".concat(h,"|").concat(l,")"))}return new RegExp(m,u(n))}function d(e,t,n){var r;return e instanceof RegExp?function(e,t){if(!t)return e;for(var n=/\((?:\?<(.*?)>)?(?!\?)/g,r=0,o=n.exec(e.source);o;)t.push({name:o[1]||r++,prefix:"",suffix:"",modifier:"",pattern:""}),o=n.exec(e.source);return e}(e,t):Array.isArray(e)?(r=e.map(function(e){return d(e,t,n).source}),new RegExp("(?:".concat(r.join("|"),")"),u(n))):p(o(e,n),t,n)}r.defineInteropFlag(n),r.export(n,"parse",()=>o),r.export(n,"compile",()=>i),r.export(n,"tokensToFunction",()=>a),r.export(n,"match",()=>s),r.export(n,"regexpToFunction",()=>c),r.export(n,"tokensToRegexp",()=>p),r.export(n,"pathToRegexp",()=>d)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||Object.prototype.hasOwnProperty.call(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}]},["8RSWf"],"8RSWf","parcelRequire24ce");
//# sourceMappingURL=express-worker.js.map
