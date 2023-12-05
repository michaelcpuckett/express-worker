!function(e,t,r,n,o){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof i[n]&&i[n],c=a.cache||{},f="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,r){if(!c[t]){if(!e[t]){var o="function"==typeof i[n]&&i[n];if(!r&&o)return o(t,!0);if(a)return a(t,!0);if(f&&"string"==typeof t)return f(t);var s=Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}d.resolve=function(r){var n=e[t][1][r];return null!=n?n:r},d.cache={};var p=c[t]=new u.Module(t);e[t][0].call(p.exports,d,p,p.exports,this)}return c[t].exports;function d(e){var t=d.resolve(e);return!1===t?{}:u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=c,u.parent=a,u.register=function(t,r){e[t]=[function(e,t){t.exports=r},{}]},Object.defineProperty(u,"root",{get:function(){return i[n]}}),i[n]=u;for(var s=0;s<t.length;s++)u(t[s]);if(r){var p=u(r);"object"==typeof exports&&"undefined"!=typeof module?module.exports=p:"function"==typeof define&&define.amd?define(function(){return p}):o&&(this[o]=p)}}({"8RSWf":[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"ExpressWorkerRequest",()=>i),n.export(r,"ExpressWorker",()=>f),n.export(r,"applyAdditionalRequestProperties",()=>u);var o=e("path-to-regexp");class i extends Request{params={}}class a extends Response{_body="";_redirect="";_headers=new Headers;_ended=!1;status=200;end(){this._ended=!0}redirect(e){this._redirect=e}}let c={get:(e,t)=>"body"===t?e._body:"headers"===t?e._headers:e[t],set:(e,t,r)=>("body"===t?e._body=r:e[t]=r,!0)};class f{paths={GET:[],POST:[],USE:[]};boundFetchHandler=this.handleFetch.bind(this);constructor(){self.addEventListener("fetch",this.boundFetchHandler)}get(e,t){this.paths.GET.push([e,t])}post(e,t){this.paths.POST.push([e,t])}use(e){this.paths.USE.push(e)}async handleRequest(e){for(let[t,r]of this.paths[e.method]){let n=(0,o.pathToRegexp)(t).exec(new URL(e.url).pathname);if(n){let t=new i(e.url,{method:e.method,headers:e.headers});n.groups&&(t.params=n.groups);let o=new Proxy(new a,c);if(!(o instanceof a&&"_body"in o&&"_headers"in o))throw Error("Response must be a modified response");for(let e of this.paths.USE)if(await e(t,o),o._ended)continue;o._ended||await r(t,o);let{body:f,status:u,headers:s,_redirect:p}=o;if(p)return Response.redirect(p,303);return new Response(f,{status:u,headers:s})}}return new Response("Not found",{status:404})}handleFetch(e){if(!(e instanceof FetchEvent))throw Error("ExpressWorkerApp must be initialized with a FetchEvent");return e.respondWith((async()=>{if(!this.isMethodEnum(e.request.method))throw Error(`Unsupported method: ${e.request.method}`);return await this.handleRequest(e.request)})())}isMethodEnum(e){return"GET"===e||"POST"===e}}function u(e){return async(t,r)=>await e(t,r)}},{"path-to-regexp":"bN5Da","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bN5Da:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function o(e,t){void 0===t&&(t={});for(var r=function(e){for(var t=[],r=0;r<e.length;){var n=e[r];if("*"===n||"+"===n||"?"===n){t.push({type:"MODIFIER",index:r,value:e[r++]});continue}if("\\"===n){t.push({type:"ESCAPED_CHAR",index:r++,value:e[r++]});continue}if("{"===n){t.push({type:"OPEN",index:r,value:e[r++]});continue}if("}"===n){t.push({type:"CLOSE",index:r,value:e[r++]});continue}if(":"===n){for(var o="",i=r+1;i<e.length;){var a=e.charCodeAt(i);if(a>=48&&a<=57||a>=65&&a<=90||a>=97&&a<=122||95===a){o+=e[i++];continue}break}if(!o)throw TypeError("Missing parameter name at ".concat(r));t.push({type:"NAME",index:r,value:o}),r=i;continue}if("("===n){var c=1,f="",i=r+1;if("?"===e[i])throw TypeError('Pattern cannot start with "?" at '.concat(i));for(;i<e.length;){if("\\"===e[i]){f+=e[i++]+e[i++];continue}if(")"===e[i]){if(0==--c){i++;break}}else if("("===e[i]&&(c++,"?"!==e[i+1]))throw TypeError("Capturing groups are not allowed at ".concat(i));f+=e[i++]}if(c)throw TypeError("Unbalanced pattern at ".concat(r));if(!f)throw TypeError("Missing pattern at ".concat(r));t.push({type:"PATTERN",index:r,value:f}),r=i;continue}t.push({type:"CHAR",index:r,value:e[r++]})}return t.push({type:"END",index:r,value:""}),t}(e),n=t.prefixes,o=void 0===n?"./":n,i="[^".concat(u(t.delimiter||"/#?"),"]+?"),a=[],c=0,f=0,s="",p=function(e){if(f<r.length&&r[f].type===e)return r[f++].value},d=function(e){var t=p(e);if(void 0!==t)return t;var n=r[f],o=n.type,i=n.index;throw TypeError("Unexpected ".concat(o," at ").concat(i,", expected ").concat(e))},l=function(){for(var e,t="";e=p("CHAR")||p("ESCAPED_CHAR");)t+=e;return t};f<r.length;){var h=p("CHAR"),v=p("NAME"),m=p("PATTERN");if(v||m){var x=h||"";-1===o.indexOf(x)&&(s+=x,x=""),s&&(a.push(s),s=""),a.push({name:v||c++,prefix:x,suffix:"",pattern:m||i,modifier:p("MODIFIER")||""});continue}var y=h||p("ESCAPED_CHAR");if(y){s+=y;continue}if(s&&(a.push(s),s=""),p("OPEN")){var x=l(),E=p("NAME")||"",g=p("PATTERN")||"",b=l();d("CLOSE"),a.push({name:E||(g?c++:""),pattern:E&&!g?i:g,prefix:x,suffix:b,modifier:p("MODIFIER")||""});continue}d("END")}return a}function i(e,t){return a(o(e,t),t)}function a(e,t){void 0===t&&(t={});var r=s(t),n=t.encode,o=void 0===n?function(e){return e}:n,i=t.validate,a=void 0===i||i,c=e.map(function(e){if("object"==typeof e)return new RegExp("^(?:".concat(e.pattern,")$"),r)});return function(t){for(var r="",n=0;n<e.length;n++){var i=e[n];if("string"==typeof i){r+=i;continue}var f=t?t[i.name]:void 0,u="?"===i.modifier||"*"===i.modifier,s="*"===i.modifier||"+"===i.modifier;if(Array.isArray(f)){if(!s)throw TypeError('Expected "'.concat(i.name,'" to not repeat, but got an array'));if(0===f.length){if(u)continue;throw TypeError('Expected "'.concat(i.name,'" to not be empty'))}for(var p=0;p<f.length;p++){var d=o(f[p],i);if(a&&!c[n].test(d))throw TypeError('Expected all "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(d,'"'));r+=i.prefix+d+i.suffix}continue}if("string"==typeof f||"number"==typeof f){var d=o(String(f),i);if(a&&!c[n].test(d))throw TypeError('Expected "'.concat(i.name,'" to match "').concat(i.pattern,'", but got "').concat(d,'"'));r+=i.prefix+d+i.suffix;continue}if(!u){var l=s?"an array":"a string";throw TypeError('Expected "'.concat(i.name,'" to be ').concat(l))}}return r}}function c(e,t){var r=[];return f(d(e,r,t),r,t)}function f(e,t,r){void 0===r&&(r={});var n=r.decode,o=void 0===n?function(e){return e}:n;return function(r){var n=e.exec(r);if(!n)return!1;for(var i=n[0],a=n.index,c=Object.create(null),f=1;f<n.length;f++)!function(e){if(void 0!==n[e]){var r=t[e-1];"*"===r.modifier||"+"===r.modifier?c[r.name]=n[e].split(r.prefix+r.suffix).map(function(e){return o(e,r)}):c[r.name]=o(n[e],r)}}(f);return{path:i,index:a,params:c}}}function u(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function s(e){return e&&e.sensitive?"":"i"}function p(e,t,r){void 0===r&&(r={});for(var n=r.strict,o=void 0!==n&&n,i=r.start,a=r.end,c=r.encode,f=void 0===c?function(e){return e}:c,p=r.delimiter,d=r.endsWith,l="[".concat(u(void 0===d?"":d),"]|$"),h="[".concat(u(void 0===p?"/#?":p),"]"),v=void 0===i||i?"^":"",m=0;m<e.length;m++){var x=e[m];if("string"==typeof x)v+=u(f(x));else{var y=u(f(x.prefix)),E=u(f(x.suffix));if(x.pattern){if(t&&t.push(x),y||E){if("+"===x.modifier||"*"===x.modifier){var g="*"===x.modifier?"?":"";v+="(?:".concat(y,"((?:").concat(x.pattern,")(?:").concat(E).concat(y,"(?:").concat(x.pattern,"))*)").concat(E,")").concat(g)}else v+="(?:".concat(y,"(").concat(x.pattern,")").concat(E,")").concat(x.modifier)}else"+"===x.modifier||"*"===x.modifier?v+="((?:".concat(x.pattern,")").concat(x.modifier,")"):v+="(".concat(x.pattern,")").concat(x.modifier)}else v+="(?:".concat(y).concat(E,")").concat(x.modifier)}}if(void 0===a||a)o||(v+="".concat(h,"?")),v+=r.endsWith?"(?=".concat(l,")"):"$";else{var b=e[e.length-1],w="string"==typeof b?h.indexOf(b[b.length-1])>-1:void 0===b;o||(v+="(?:".concat(h,"(?=").concat(l,"))?")),w||(v+="(?=".concat(h,"|").concat(l,")"))}return new RegExp(v,s(r))}function d(e,t,r){var n;return e instanceof RegExp?function(e,t){if(!t)return e;for(var r=/\((?:\?<(.*?)>)?(?!\?)/g,n=0,o=r.exec(e.source);o;)t.push({name:o[1]||n++,prefix:"",suffix:"",modifier:"",pattern:""}),o=r.exec(e.source);return e}(e,t):Array.isArray(e)?(n=e.map(function(e){return d(e,t,r).source}),new RegExp("(?:".concat(n.join("|"),")"),s(r))):p(o(e,r),t,r)}n.defineInteropFlag(r),n.export(r,"parse",()=>o),n.export(r,"compile",()=>i),n.export(r,"tokensToFunction",()=>a),n.export(r,"match",()=>c),n.export(r,"regexpToFunction",()=>f),n.export(r,"tokensToRegexp",()=>p),n.export(r,"pathToRegexp",()=>d)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,r){r.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},r.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.exportAll=function(e,t){return Object.keys(e).forEach(function(r){"default"===r||"__esModule"===r||Object.prototype.hasOwnProperty.call(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[r]}})}),t},r.export=function(e,t,r){Object.defineProperty(e,t,{enumerable:!0,get:r})}},{}]},["8RSWf"],"8RSWf","parcelRequire24ce");
//# sourceMappingURL=express-worker.js.map
