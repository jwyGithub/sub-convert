var e=(e,t,n)=>(r,i)=>{let a=-1;return o(0);async function o(s){if(s<=a)throw Error(`next() called multiple times`);a=s;let c,l=!1,u;if(e[s]?(u=e[s][0][0],r.req.routeIndex=s):u=s===e.length&&i||void 0,u)try{c=await u(r,()=>o(s+1))}catch(e){if(e instanceof Error&&t)r.error=e,c=await t(e,r),l=!0;else throw e}else r.finalized===!1&&n&&(c=await n(r));return c&&(r.finalized===!1||l)&&(r.res=c),r}},t=class extends Error{res;status;constructor(e=500,t){super(t?.message,{cause:t?.cause}),this.res=t?.res,this.status=e}getResponse(){return this.res?new Response(this.res.body,{status:this.status,headers:this.res.headers}):new Response(this.message,{status:this.status})}},n=Symbol(),r=async(e,t=Object.create(null))=>{let{all:n=!1,dot:r=!1}=t,a=(e instanceof se?e.raw.headers:e.headers).get(`Content-Type`);return a?.startsWith(`multipart/form-data`)||a?.startsWith(`application/x-www-form-urlencoded`)?i(e,{all:n,dot:r}):{}};async function i(e,t){let n=await e.formData();return n?a(n,t):{}}function a(e,t){let n=Object.create(null);return e.forEach((e,r)=>{t.all||r.endsWith(`[]`)?o(n,r,e):n[r]=e}),t.dot&&Object.entries(n).forEach(([e,t])=>{e.includes(`.`)&&(s(n,e,t),delete n[e])}),n}var o=(e,t,n)=>{e[t]===void 0?t.endsWith(`[]`)?e[t]=[n]:e[t]=n:Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]},s=(e,t,n)=>{if(/(?:^|\.)__proto__\./.test(t))return;let r=e,i=t.split(`.`);i.forEach((e,t)=>{t===i.length-1?r[e]=n:((!r[e]||typeof r[e]!=`object`||Array.isArray(r[e])||r[e]instanceof File)&&(r[e]=Object.create(null)),r=r[e])})},c=e=>{let t=e.split(`/`);return t[0]===``&&t.shift(),t},l=e=>{let{groups:t,path:n}=u(e);return d(c(n),t)},u=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(e,n)=>{let r=`@${n}`;return t.push([r,e]),r}),{groups:t,path:e}},d=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let i=e.length-1;i>=0;i--)if(e[i].includes(r)){e[i]=e[i].replace(r,t[n][1]);break}}return e},f={},p=(e,t)=>{if(e===`*`)return`*`;let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;return f[r]||(n[2]?f[r]=t&&t[0]!==`:`&&t[0]!==`*`?[r,n[1],RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],RegExp(`^${n[2]}$`)]:f[r]=[e,n[1],!0]),f[r]}return null},m=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,e=>{try{return t(e)}catch{return e}})}},h=e=>m(e,decodeURI),g=e=>{let t=e.url,n=t.indexOf(`/`,t.indexOf(`:`)+4),r=n;for(;r<t.length;r++){let e=t.charCodeAt(r);if(e===37){let e=t.indexOf(`?`,r),i=t.indexOf(`#`,r),a=e===-1?i===-1?void 0:i:i===-1?e:Math.min(e,i),o=t.slice(n,a);return h(o.includes(`%25`)?o.replace(/%25/g,`%2525`):o)}else if(e===63||e===35)break}return t.slice(n,r)},_=e=>{let t=g(e);return t.length>1&&t.at(-1)===`/`?t.slice(0,-1):t},v=(e,t,...n)=>(n.length&&(t=v(t,...n)),`${e?.[0]===`/`?``:`/`}${e}${t===`/`?``:`${e?.at(-1)===`/`?``:`/`}${t?.[0]===`/`?t.slice(1):t}`}`),ee=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(`:`))return null;let t=e.split(`/`),n=[],r=``;return t.forEach(e=>{if(e!==``&&!/\:/.test(e))r+=`/`+e;else if(/\:/.test(e))if(/\?/.test(e)){n.length===0&&r===``?n.push(`/`):n.push(r);let t=e.replace(`?`,``);r+=`/`+t,n.push(r)}else r+=`/`+e}),n.filter((e,t,n)=>n.indexOf(e)===t)},te=e=>/[%+]/.test(e)?(e.indexOf(`+`)!==-1&&(e=e.replace(/\+/g,` `)),e.indexOf(`%`)===-1?e:m(e,ae)):e,ne=(e,t,n)=>{let r;if(!n&&t&&!/[%+]/.test(t)){let n=e.indexOf(`?`,8);if(n===-1)return;for(e.startsWith(t,n+1)||(n=e.indexOf(`&${t}`,n+1));n!==-1;){let r=e.charCodeAt(n+t.length+1);if(r===61){let r=n+t.length+2,i=e.indexOf(`&`,r);return te(e.slice(r,i===-1?void 0:i))}else if(r==38||isNaN(r))return``;n=e.indexOf(`&${t}`,n+1)}if(r=/[%+]/.test(e),!r)return}let i={};r??=/[%+]/.test(e);let a=e.indexOf(`?`,8);for(;a!==-1;){let t=e.indexOf(`&`,a+1),o=e.indexOf(`=`,a);o>t&&t!==-1&&(o=-1);let s=e.slice(a+1,o===-1?t===-1?void 0:t:o);if(r&&(s=te(s)),a=t,s===``)continue;let c;o===-1?c=``:(c=e.slice(o+1,t===-1?void 0:t),r&&(c=te(c))),n?(i[s]&&Array.isArray(i[s])||(i[s]=[]),i[s].push(c)):i[s]??=c}return t?i[t]:i},re=ne,ie=(e,t)=>ne(e,t,!0),ae=decodeURIComponent,oe=e=>m(e,ae),se=class{raw;#e;#t;routeIndex=0;path;bodyCache={};constructor(e,t=`/`,n=[[]]){this.raw=e,this.path=t,this.#t=n,this.#e={}}param(e){return e?this.#n(e):this.#r()}#n(e){let t=this.#t[0][this.routeIndex][1][e],n=this.#i(t);return n&&/\%/.test(n)?oe(n):n}#r(){let e={},t=Object.keys(this.#t[0][this.routeIndex][1]);for(let n of t){let t=this.#i(this.#t[0][this.routeIndex][1][n]);t!==void 0&&(e[n]=/\%/.test(t)?oe(t):t)}return e}#i(e){return this.#t[1]?this.#t[1][e]:e}query(e){return re(this.url,e)}queries(e){return ie(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t={};return this.raw.headers.forEach((e,n)=>{t[n]=e}),t}async parseBody(e){return r(this,e)}#a=e=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;let i=Object.keys(t)[0];return i?t[i].then(t=>(i===`json`&&(t=JSON.stringify(t)),new Response(t)[e]())):t[e]=n[e]()};json(){return this.#a(`text`).then(e=>JSON.parse(e))}text(){return this.#a(`text`)}arrayBuffer(){return this.#a(`arrayBuffer`)}blob(){return this.#a(`blob`)}formData(){return this.#a(`formData`)}addValidatedData(e,t){this.#e[e]=t}valid(e){return this.#e[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[n](){return this.#t}get matchedRoutes(){return this.#t[0].map(([[,e]])=>e)}get routePath(){return this.#t[0].map(([[,e]])=>e)[this.routeIndex].path}},ce={Stringify:1,BeforeStream:2,Stream:3},le=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n},ue=async(e,t,n,r,i)=>{typeof e==`object`&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let a=e.callbacks;if(!a?.length)return Promise.resolve(e);i?i[0]+=e:i=[e];let o=Promise.all(a.map(e=>e({phase:t,buffer:i,context:r}))).then(e=>Promise.all(e.filter(Boolean).map(e=>ue(e,t,!1,r,i))).then(()=>i[0]));return n?le(await o,a):o},de=`text/plain; charset=UTF-8`,fe=(e,t)=>({"Content-Type":e,...t}),y=(e,t)=>new Response(e,t),pe=class{#e;#t;env={};#n;finalized=!1;error;#r;#i;#a;#o;#s;#c;#l;#u;#d;constructor(e,t){this.#e=e,t&&(this.#i=t.executionCtx,this.env=t.env,this.#c=t.notFoundHandler,this.#d=t.path,this.#u=t.matchResult)}get req(){return this.#t??=new se(this.#e,this.#d,this.#u),this.#t}get event(){if(this.#i&&`respondWith`in this.#i)return this.#i;throw Error(`This context has no FetchEvent`)}get executionCtx(){if(this.#i)return this.#i;throw Error(`This context has no ExecutionContext`)}get res(){return this.#a||=y(null,{headers:this.#l??=new Headers})}set res(e){if(this.#a&&e){e=y(e.body,e);for(let[t,n]of this.#a.headers.entries())if(t!==`content-type`)if(t===`set-cookie`){let t=this.#a.headers.getSetCookie();e.headers.delete(`set-cookie`);for(let n of t)e.headers.append(`set-cookie`,n)}else e.headers.set(t,n)}this.#a=e,this.finalized=!0}render=(...e)=>(this.#s??=e=>this.html(e),this.#s(...e));setLayout=e=>this.#o=e;getLayout=()=>this.#o;setRenderer=e=>{this.#s=e};header=(e,t,n)=>{this.finalized&&(this.#a=y(this.#a.body,this.#a));let r=this.#a?this.#a.headers:this.#l??=new Headers;t===void 0?r.delete(e):n?.append?r.append(e,t):r.set(e,t)};status=e=>{this.#r=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=e=>this.#n?this.#n.get(e):void 0;get var(){return this.#n?Object.fromEntries(this.#n):{}}#f(e,t,n){let r=this.#a?new Headers(this.#a.headers):this.#l??new Headers;if(typeof t==`object`&&`headers`in t){let e=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(let[t,n]of e)t.toLowerCase()===`set-cookie`?r.append(t,n):r.set(t,n)}if(n)for(let[e,t]of Object.entries(n))if(typeof t==`string`)r.set(e,t);else{r.delete(e);for(let n of t)r.append(e,n)}return y(e,{status:typeof t==`number`?t:t?.status??this.#r,headers:r})}newResponse=(...e)=>this.#f(...e);body=(e,t,n)=>this.#f(e,t,n);text=(e,t,n)=>!this.#l&&!this.#r&&!t&&!n&&!this.finalized?new Response(e):this.#f(e,t,fe(de,n));json=(e,t,n)=>this.#f(JSON.stringify(e),t,fe(`application/json`,n));html=(e,t,n)=>{let r=e=>this.#f(e,t,fe(`text/html; charset=UTF-8`,n));return typeof e==`object`?ue(e,ce.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header(`Location`,/[^\x00-\xFF]/.test(n)?encodeURI(n):n),this.newResponse(null,t??302)};notFound=()=>(this.#c??=()=>y(),this.#c(this))},me=[`get`,`post`,`put`,`delete`,`options`,`patch`],he=`Can not add a route since the matcher is already built.`,ge=class extends Error{},_e=`__COMPOSED_HANDLER`,ve=e=>e.text(`404 Not Found`,404),ye=(e,t)=>{if(`getResponse`in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text(`Internal Server Error`,500)},be=class t{get;post;put;delete;options;patch;all;on;use;router;getPath;_basePath=`/`;#e=`/`;routes=[];constructor(e={}){[...me,`all`].forEach(e=>{this[e]=(t,...n)=>(typeof t==`string`?this.#e=t:this.#r(e,this.#e,t),n.forEach(t=>{this.#r(e,this.#e,t)}),this)}),this.on=(e,t,...n)=>{for(let r of[t].flat()){this.#e=r;for(let t of[e].flat())n.map(e=>{this.#r(t.toUpperCase(),this.#e,e)})}return this},this.use=(e,...t)=>(typeof e==`string`?this.#e=e:(this.#e=`*`,t.unshift(e)),t.forEach(e=>{this.#r(`ALL`,this.#e,e)}),this);let{strict:t,...n}=e;Object.assign(this,n),this.getPath=t??!0?e.getPath??g:_}#t(){let e=new t({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,e.#n=this.#n,e.routes=this.routes,e}#n=ve;errorHandler=ye;route(t,n){let r=this.basePath(t);return n.routes.map(t=>{let i;n.errorHandler===ye?i=t.handler:(i=async(r,i)=>(await e([],n.errorHandler)(r,()=>t.handler(r,i))).res,i[_e]=t.handler),r.#r(t.method,t.path,i)}),this}basePath(e){let t=this.#t();return t._basePath=v(this._basePath,e),t}onError=e=>(this.errorHandler=e,this);notFound=e=>(this.#n=e,this);mount(e,t,n){let r,i;n&&(typeof n==`function`?i=n:(i=n.optionHandler,r=n.replaceRequest===!1?e=>e:n.replaceRequest));let a=i?e=>{let t=i(e);return Array.isArray(t)?t:[t]}:e=>{let t;try{t=e.executionCtx}catch{}return[e.env,t]};return r||=(()=>{let t=v(this._basePath,e),n=t===`/`?0:t.length;return e=>{let t=new URL(e.url);return t.pathname=t.pathname.slice(n)||`/`,new Request(t,e)}})(),this.#r(`ALL`,v(e,`*`),async(e,n)=>{let i=await t(r(e.req.raw),...a(e));if(i)return i;await n()}),this}#r(e,t,n){e=e.toUpperCase(),t=v(this._basePath,t);let r={basePath:this._basePath,path:t,method:e,handler:n};this.router.add(e,t,[n,r]),this.routes.push(r)}#i(e,t){if(e instanceof Error)return this.errorHandler(e,t);throw e}#a(t,n,r,i){if(i===`HEAD`)return(async()=>new Response(null,await this.#a(t,n,r,`GET`)))();let a=this.getPath(t,{env:r}),o=this.router.match(i,a),s=new pe(t,{path:a,matchResult:o,env:r,executionCtx:n,notFoundHandler:this.#n});if(o[0].length===1){let e;try{e=o[0][0][0][0](s,async()=>{s.res=await this.#n(s)})}catch(e){return this.#i(e,s)}return e instanceof Promise?e.then(e=>e||(s.finalized?s.res:this.#n(s))).catch(e=>this.#i(e,s)):e??this.#n(s)}let c=e(o[0],this.errorHandler,this.#n);return(async()=>{try{let e=await c(s);if(!e.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return e.res}catch(e){return this.#i(e,s)}})()}fetch=(e,...t)=>this.#a(e,t[1],t[0],e.method);request=(e,t,n,r)=>e instanceof Request?this.fetch(t?new Request(e,t):e,n,r):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${v(`/`,e)}`,t),n,r));fire=()=>{addEventListener(`fetch`,e=>{e.respondWith(this.#a(e.request,e,void 0,e.request.method))})}},xe=[];function Se(e,t){let n=this.buildAllMatchers(),r=((e,t)=>{let r=n[e]||n.ALL,i=r[2][t];if(i)return i;let a=t.match(r[0]);if(!a)return[[],xe];let o=a.indexOf(``,1);return[r[1][o],a]});return this.match=r,r(e,t)}var Ce=`[^/]+`,b=`.*`,x=`(?:|/.*)`,we=Symbol(),Te=new Set(`.\\+*[^]$()`);function Ee(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===b||e===x?1:t===b||t===x?-1:e===Ce?1:t===Ce?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var De=class e{#e;#t;#n=Object.create(null);insert(t,n,r,i,a){if(t.length===0){if(this.#e!==void 0)throw we;if(a)return;this.#e=n;return}let[o,...s]=t,c=o===`*`?s.length===0?[``,``,b]:[``,``,Ce]:o===`/*`?[``,``,x]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),l;if(c){let t=c[1],n=c[2]||Ce;if(t&&c[2]&&(n===`.*`||(n=n.replace(/^\((?!\?:)(?=[^)]+\)$)/,`(?:`),/\((?!\?:)/.test(n))))throw we;if(l=this.#n[n],!l){if(Object.keys(this.#n).some(e=>e!==b&&e!==x))throw we;if(a)return;l=this.#n[n]=new e,t!==``&&(l.#t=i.varIndex++)}!a&&t!==``&&r.push([t,l.#t])}else if(l=this.#n[o],!l){if(Object.keys(this.#n).some(e=>e.length>1&&e!==b&&e!==x))throw we;if(a)return;l=this.#n[o]=new e}l.insert(s,n,r,i,a)}buildRegExpStr(){let e=Object.keys(this.#n).sort(Ee).map(e=>{let t=this.#n[e];return(typeof t.#t==`number`?`(${e})@${t.#t}`:Te.has(e)?`\\${e}`:e)+t.buildRegExpStr()});return typeof this.#e==`number`&&e.unshift(`#${this.#e}`),e.length===0?``:e.length===1?e[0]:`(?:`+e.join(`|`)+`)`}},Oe=class{#e={varIndex:0};#t=new De;insert(e,t,n){let r=[],i=[];for(let t=0;;){let n=!1;if(e=e.replace(/\{[^}]+\}/g,e=>{let r=`@\\${t}`;return i[t]=[r,e],t++,n=!0,r}),!n)break}let a=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let e=i.length-1;e>=0;e--){let[t]=i[e];for(let n=a.length-1;n>=0;n--)if(a[n].indexOf(t)!==-1){a[n]=a[n].replace(t,i[e][1]);break}}return this.#t.insert(a,t,r,this.#e,n),r}buildRegExp(){let e=this.#t.buildRegExpStr();if(e===``)return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(e,i,a)=>i===void 0?(a===void 0||(r[Number(a)]=++t),``):(n[++t]=Number(i),`$()`)),[RegExp(`^${e}`),n,r]}},ke=[/^$/,[],Object.create(null)],Ae=Object.create(null);function je(e){return Ae[e]??=RegExp(e===`*`?``:`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,t)=>t?`\\${t}`:`(?:|/.*)`)}$`)}function Me(){Ae=Object.create(null)}function Ne(e){let t=new Oe,n=[];if(e.length===0)return ke;let r=e.map(e=>[!/\*|\/:/.test(e[0]),...e]).sort(([e,t],[n,r])=>e?1:n?-1:t.length-r.length),i=Object.create(null);for(let e=0,a=-1,o=r.length;e<o;e++){let[o,s,c]=r[e];o?i[s]=[c.map(([e])=>[e,Object.create(null)]),xe]:a++;let l;try{l=t.insert(s,a,o)}catch(e){throw e===we?new ge(s):e}o||(n[a]=c.map(([e,t])=>{let n=Object.create(null);for(--t;t>=0;t--){let[e,r]=l[t];n[e]=r}return[e,n]}))}let[a,o,s]=t.buildRegExp();for(let e=0,t=n.length;e<t;e++)for(let t=0,r=n[e].length;t<r;t++){let r=n[e][t]?.[1];if(!r)continue;let i=Object.keys(r);for(let e=0,t=i.length;e<t;e++)r[i[e]]=s[r[i[e]]]}let c=[];for(let e in o)c[e]=n[o[e]];return[a,c,i]}function S(e,t){if(e){for(let n of Object.keys(e).sort((e,t)=>t.length-e.length))if(je(n).test(t))return[...e[n]]}}var Pe=class{name=`RegExpRouter`;#e;#t;constructor(){this.#e={ALL:Object.create(null)},this.#t={ALL:Object.create(null)}}add(e,t,n){let r=this.#e,i=this.#t;if(!r||!i)throw Error(he);r[e]||[r,i].forEach(t=>{t[e]=Object.create(null),Object.keys(t.ALL).forEach(n=>{t[e][n]=[...t.ALL[n]]})}),t===`/*`&&(t=`*`);let a=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let o=je(t);e===`ALL`?Object.keys(r).forEach(e=>{r[e][t]||=S(r[e],t)||S(r.ALL,t)||[]}):r[e][t]||=S(r[e],t)||S(r.ALL,t)||[],Object.keys(r).forEach(t=>{(e===`ALL`||e===t)&&Object.keys(r[t]).forEach(e=>{o.test(e)&&r[t][e].push([n,a])})}),Object.keys(i).forEach(t=>{(e===`ALL`||e===t)&&Object.keys(i[t]).forEach(e=>o.test(e)&&i[t][e].push([n,a]))});return}let o=ee(t)||[t];for(let t=0,s=o.length;t<s;t++){let c=o[t];Object.keys(i).forEach(o=>{(e===`ALL`||e===o)&&(i[o][c]||=[...S(r[o],c)||S(r.ALL,c)||[]],i[o][c].push([n,a-s+t+1]))})}}match=Se;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#t).concat(Object.keys(this.#e)).forEach(t=>{e[t]||=this.#n(t)}),this.#e=this.#t=void 0,Me(),e}#n(e){let t=[],n=e===`ALL`;return[this.#e,this.#t].forEach(r=>{let i=r[e]?Object.keys(r[e]).map(t=>[t,r[e][t]]):[];i.length===0?e!==`ALL`&&t.push(...Object.keys(r.ALL).map(e=>[e,r.ALL[e]])):(n||=!0,t.push(...i))}),n?Ne(t):null}},Fe=class{name=`SmartRouter`;#e=[];#t=[];constructor(e){this.#e=e.routers}add(e,t,n){if(!this.#t)throw Error(he);this.#t.push([e,t,n])}match(e,t){if(!this.#t)throw Error(`Fatal error`);let n=this.#e,r=this.#t,i=n.length,a=0,o;for(;a<i;a++){let i=n[a];try{for(let e=0,t=r.length;e<t;e++)i.add(...r[e]);o=i.match(e,t)}catch(e){if(e instanceof ge)continue;throw e}this.match=i.match.bind(i),this.#e=[i],this.#t=void 0;break}if(a===i)throw Error(`Fatal error`);return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(this.#t||this.#e.length!==1)throw Error(`No active router has been determined yet.`);return this.#e[0]}},C=Object.create(null),Ie=e=>{for(let t in e)return!0;return!1},Le=class e{#e;#t;#n;#r=0;#i=C;constructor(e,t,n){if(this.#t=n||Object.create(null),this.#e=[],e&&t){let n=Object.create(null);n[e]={handler:t,possibleKeys:[],score:0},this.#e=[n]}this.#n=[]}insert(t,n,r){this.#r=++this.#r;let i=this,a=l(n),o=[];for(let t=0,n=a.length;t<n;t++){let n=a[t],r=a[t+1],s=p(n,r),c=Array.isArray(s)?s[0]:n;if(c in i.#t){i=i.#t[c],s&&o.push(s[1]);continue}i.#t[c]=new e,s&&(i.#n.push(s),o.push(s[1])),i=i.#t[c]}return i.#e.push({[t]:{handler:r,possibleKeys:o.filter((e,t,n)=>n.indexOf(e)===t),score:this.#r}}),i}#a(e,t,n,r,i){for(let a=0,o=t.#e.length;a<o;a++){let o=t.#e[a],s=o[n]||o.ALL,c={};if(s!==void 0&&(s.params=Object.create(null),e.push(s),r!==C||i&&i!==C))for(let e=0,t=s.possibleKeys.length;e<t;e++){let t=s.possibleKeys[e],n=c[s.score];s.params[t]=i?.[t]&&!n?i[t]:r[t]??i?.[t],c[s.score]=!0}}}search(e,t){let n=[];this.#i=C;let r=[this],i=c(t),a=[],o=i.length,s=null;for(let c=0;c<o;c++){let l=i[c],u=c===o-1,d=[];for(let f=0,p=r.length;f<p;f++){let p=r[f],m=p.#t[l];m&&(m.#i=p.#i,u?(m.#t[`*`]&&this.#a(n,m.#t[`*`],e,p.#i),this.#a(n,m,e,p.#i)):d.push(m));for(let r=0,f=p.#n.length;r<f;r++){let f=p.#n[r],m=p.#i===C?{}:{...p.#i};if(f===`*`){let t=p.#t[`*`];t&&(this.#a(n,t,e,p.#i),t.#i=m,d.push(t));continue}let[h,g,_]=f;if(!l&&!(_ instanceof RegExp))continue;let v=p.#t[h];if(_ instanceof RegExp){if(s===null){s=Array(o);let e=+(t[0]===`/`);for(let t=0;t<o;t++)s[t]=e,e+=i[t].length+1}let r=t.substring(s[c]),l=_.exec(r);if(l){if(m[g]=l[0],this.#a(n,v,e,p.#i,m),Ie(v.#t)){v.#i=m;let e=l[0].match(/\//)?.length??0;(a[e]||=[]).push(v)}continue}}(_===!0||_.test(l))&&(m[g]=l,u?(this.#a(n,v,e,m,p.#i),v.#t[`*`]&&this.#a(n,v.#t[`*`],e,m,p.#i)):(v.#i=m,d.push(v)))}}let f=a.shift();r=f?d.concat(f):d}return n.length>1&&n.sort((e,t)=>e.score-t.score),[n.map(({handler:e,params:t})=>[e,t])]}},Re=class{name=`TrieRouter`;#e;constructor(){this.#e=new Le}add(e,t,n){let r=ee(t);if(r){for(let t=0,i=r.length;t<i;t++)this.#e.insert(e,r[t],n);return}this.#e.insert(e,t,n)}match(e,t){return this.#e.search(e,t)}},ze=class extends be{constructor(e={}){super(e),this.router=e.router??new Fe({routers:[new Pe,new Re]})}},Be=e=>{let t={origin:`*`,allowMethods:[`GET`,`HEAD`,`PUT`,`POST`,`DELETE`,`PATCH`],allowHeaders:[],exposeHeaders:[],...e},n=(e=>typeof e==`string`?e===`*`?t.credentials?e=>e||null:()=>e:t=>e===t?t:null:typeof e==`function`?e:t=>e.includes(t)?t:null)(t.origin),r=(e=>typeof e==`function`?e:Array.isArray(e)?()=>e:()=>[])(t.allowMethods);return async function(e,i){function a(t,n){e.res.headers.set(t,n)}let o=await n(e.req.header(`origin`)||``,e);if(o&&a(`Access-Control-Allow-Origin`,o),t.credentials&&a(`Access-Control-Allow-Credentials`,`true`),t.exposeHeaders?.length&&a(`Access-Control-Expose-Headers`,t.exposeHeaders.join(`,`)),e.req.method===`OPTIONS`){(t.origin!==`*`||t.credentials)&&a(`Vary`,`Origin`),t.maxAge!=null&&a(`Access-Control-Max-Age`,t.maxAge.toString());let n=await r(e.req.header(`origin`)||``,e);n.length&&a(`Access-Control-Allow-Methods`,n.join(`,`));let i=t.allowHeaders;if(!i?.length){let t=e.req.header(`Access-Control-Request-Headers`);t&&(i=t.split(/\s*,\s*/))}return i?.length&&(a(`Access-Control-Allow-Headers`,i.join(`,`)),e.res.headers.append(`Vary`,`Access-Control-Request-Headers`)),e.res.headers.delete(`Content-Length`),e.res.headers.delete(`Content-Type`),new Response(null,{headers:e.res.headers,status:204,statusText:`No Content`})}await i(),(t.origin!==`*`||t.credentials)&&e.header(`Vary`,`Origin`,{append:!0})}};function Ve(){return Be({origin:`*`,allowMethods:[`GET`,`POST`,`PUT`,`DELETE`,`OPTIONS`],allowHeaders:[`Content-Type`,`Authorization`],maxAge:86400})}async function He(e,n){if(e instanceof t)return e.getResponse();let r=e?.message||`Internal Server Error`;return console.error(`[error]`,e),n.json({error:r},500)}function Ue(){let{process:e,Deno:t}=globalThis;return!(typeof t?.noColor==`boolean`?t.noColor:e!==void 0&&`NO_COLOR`in e?.env)}async function We(){let{navigator:e}=globalThis;return!(e!==void 0&&e.userAgent===`Cloudflare-Workers`?await(async()=>{try{return`NO_COLOR`in((await import(`cloudflare:workers`)).env??{})}catch{return!1}})():!Ue())}var Ge=e=>{let[t,n]=[`,`,`.`];return e.map(e=>e.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,`$1`+t)).join(n)},Ke=e=>{let t=Date.now()-e;return Ge([t<1e3?t+`ms`:Math.round(t/1e3)+`s`])},qe=async e=>{if(await We())switch(e/100|0){case 5:return`\x1B[31m${e}\x1B[0m`;case 4:return`\x1B[33m${e}\x1B[0m`;case 3:return`\x1B[36m${e}\x1B[0m`;case 2:return`\x1B[32m${e}\x1B[0m`}return`${e}`};async function Je(e,t,n,r,i=0,a){e(t===`<--`?`${t} ${n} ${r}`:`${t} ${n} ${r} ${await qe(i)} ${a}`)}var Ye=(e=console.log)=>async function(t,n){let{method:r,url:i}=t.req,a=i.slice(i.indexOf(`/`,8));await Je(e,`<--`,r,a);let o=Date.now();await n(),await Je(e,`-->`,r,a,t.res.status,Ke(o))};function Xe(){return Ye()}function Ze(e){return async(t,n)=>{t.set(`repo`,e),await n()}}function Qe(){return`
        <script>
            class SubButton extends HTMLElement {
                static get observedAttributes() {
                    return ['disabled', 'readonly', 'type'];
                }

                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.#render();
                }

                #injectStyle() {
                    const style = document.createElement('style');
                    style.textContent = \`
                        :host {
                            display: inline-block;
                        }

                        .sub-button {
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 4px 15px;
                            font-size: 14px;
                            border-radius: var(--radius);
                            border: 1px solid var(--border-color);
                            background: var(--background);
                            color: var(--text-primary);
                            cursor: pointer;
                            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                            user-select: none;
                            height: 32px;
                            min-width: 88px;
                            white-space: nowrap;
                            gap: 6px;
                        }

                        .sub-button:not(:disabled):not([readonly]):hover {
                            color: var(--primary-color);
                            border-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active {
                            opacity: 0.8;
                        }

                        .sub-button[type="primary"] {
                            background: var(--primary-color);
                            border-color: var(--primary-color);
                            color: #fff;
                        }

                        .sub-button[type="primary"]:not(:disabled):not([readonly]):hover {
                            background: var(--primary-hover);
                            border-color: var(--primary-hover);
                            color: #fff;
                        }

                        .sub-button:disabled,
                        .sub-button[readonly] {
                            cursor: not-allowed;
                            background-color: var(--background-disabled);
                            border-color: var(--border-color);
                            color: var(--text-disabled);
                        }

                        /* 波纹效果 */
                        .sub-button::after {
                            content: '';
                            position: absolute;
                            inset: -1px;
                            border-radius: inherit;
                            opacity: 0;
                            transition: all 0.2s;
                            background-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active::after {
                            opacity: 0.1;
                            transition: 0s;
                        }

                        /* 图标样式 */
                        ::slotted(svg) {
                            width: 16px;
                            height: 16px;
                            fill: currentColor;
                        }
                    \`;
                    this.shadowRoot.appendChild(style);
                }

                #injectElement() {
                    const button = document.createElement('button');
                    button.className = 'sub-button';

                    // 添加插槽
                    const slot = document.createElement('slot');
                    button.appendChild(slot);

                    this.shadowRoot.appendChild(button);
                }

                #render() {
                    this.#injectStyle();
                    this.#injectElement();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue === newValue) return;

                    const button = this.shadowRoot.querySelector('.sub-button');
                    if (!button) return;

                    switch (name) {
                        case 'disabled':
                            button.disabled = this.hasAttribute('disabled');
                            break;
                        case 'readonly':
                            button.setAttribute('readonly', '');
                            break;
                        case 'type':
                            button.setAttribute('type', newValue);
                            break;
                    }
                }
            }

            customElements.define('sub-button', SubButton);
        <\/script>
    `}function $e(){return`
    <script>
        class SubCheckbox extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled', 'key', 'span'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: []
                };
                this.#render();
            }

            #initValue() {
                const selectedValues = this.getAttribute('value') || [];

                if (selectedValues.length > 0) {
                    this.state.value = selectedValues;
                    this.#renderOptions();
                }
            }

            #injectStyle() {
                const style = document.createElement('style');
                const span = this.getAttribute('span') || 4;
                style.textContent = \`
                    :host {
                        display: block;
                        width: 100%;
                    }
                    .sub-checkbox-container {
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                    }
                    .sub-checkbox-container:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-checkbox-group {
                        display: grid;
                        grid-template-columns: repeat(\${span}, 1fr);
                        gap: 16px;
                        width: 100%;
                        height: 32px;
                    }
                    .sub-checkbox {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        user-select: none;
                        color: var(--text-primary);
                    }
                    .sub-checkbox__input {
                        position: relative;
                        width: 10px;
                        height: 10px;
                        border: 2px solid var(--border-color);
                        border-radius: 4px;
                        background-color: var(--background);
                        margin-right: 8px;
                        transition: all .3s;
                    }
                    .sub-checkbox__input::after {
                        content: '';
                        position: absolute;
                        top: 0px;
                        left: 3px;
                        width: 3px;
                        height: 6px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scaleY(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }
                    .sub-checkbox__input_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_checked::after {
                        transform: rotate(45deg) scaleY(1);
                    }

                    .sub-checkbox__label {
                        font-size: 14px;
                        line-height: 14px;
                        white-space: nowrap
                    }

                    .sub-checkbox:hover .sub-checkbox__input:not(.sub-checkbox__input_disabled) {
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                    }
                    .sub-checkbox__label_disabled {
                        color: var(--text-disabled);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const container = document.createElement('div');
                container.className = 'sub-checkbox-container';

                const wrapper = document.createElement('div');
                wrapper.className = 'sub-checkbox-group';

                container.appendChild(wrapper);
                this.shadowRoot.appendChild(container);

                this.#renderOptions();
            }

            #renderOptions() {
                const wrapper = this.shadowRoot.querySelector('.sub-checkbox-group');
                wrapper.innerHTML = '';

                this.state.options.forEach(option => {
                    const checkbox = document.createElement('label');
                    checkbox.className = 'sub-checkbox';

                    const input = document.createElement('span');
                    input.className = 'sub-checkbox__input';
                    if (this.state.value.includes(option.value)) {
                        input.classList.add('sub-checkbox__input_checked');
                    }
                    if (this.hasAttribute('disabled')) {
                        input.classList.add('sub-checkbox__input_disabled');
                    }

                    const label = document.createElement('span');
                    label.className = 'sub-checkbox__label';
                    if (this.hasAttribute('disabled')) {
                        label.classList.add('sub-checkbox__label_disabled');
                    }
                    label.textContent = option.label;

                    checkbox.appendChild(input);
                    checkbox.appendChild(label);

                    if (!this.hasAttribute('disabled')) {
                        checkbox.addEventListener('click', () => this.#handleClick(option.value));
                    }

                    wrapper.appendChild(checkbox);
                });
            }

            #handleClick(value) {
                const index = this.state.value.indexOf(value);
                if (index === -1) {
                    this.state.value.push(value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderOptions();

                // 触发事件
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderOptions();
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#initValue(); // 设置选项后初始化选中状态
                            this.#renderOptions();
                        } catch (e) {
                            console.error('Invalid options format:', e);
                        }
                        break;
                    case 'disabled':
                        this.#renderOptions();
                        break;
                }
            }
        }
        customElements.define('sub-checkbox', SubCheckbox);
    <\/script>
    `}function et(){return`
    <script>
        class SubForm extends HTMLElement {
            static get observedAttributes() {
                return ['model', 'label-width'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.model = {};
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'model' && oldValue !== newValue) {
                    try {
                        this.model = JSON.parse(newValue);
                        // 更新所有子组件的值
                        this.#updateChildrenValues();
                    } catch (e) {
                        console.error('Invalid model:', e);
                    }
                }
            }

            #updateChildrenValues() {
                // 找到所有带有 key 属性的子组件
                this.querySelectorAll('[key]').forEach(child => {
                    const key = child.getAttribute('key');
                    if (key && this.model[key] !== undefined) {
                        // 根据值的类型设置不同的格式
                        if (Array.isArray(this.model[key])) {
                            child.setAttribute('value', JSON.stringify(this.model[key]));
                        } else {
                            child.setAttribute('value', this.model[key]);
                        }
                    }
                });
            }

            connectedCallback() {
                const modelStr = this.getAttribute('model');
                if (modelStr) {
                    this.model = JSON.parse(modelStr);
                }

                this.addEventListener('update:value', e => {
                    const key = e.target.getAttribute('key');
                    if (key && this.model) {
                        this.model[key] = e.detail.value;
                        this.dispatchEvent(
                            new CustomEvent('form:change', {
                                detail: {
                                    key,
                                    value: e.detail.value,
                                    formData: this.model
                                },
                                bubbles: true
                            })
                        );
                    }
                });

                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                const labelWidth = this.getAttribute('label-width') || '80px';
                style.textContent = \`
                    :host {
                        display: block;
                    }
                    form {
                        margin: 0;
                        padding: 0;
                    }
                    ::slotted(sub-form-item) {
                        --label-width: \${labelWidth};
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const form = document.createElement('form');
                const slot = document.createElement('slot');
                form.appendChild(slot);
                this.shadowRoot.appendChild(form);

                this.#bindEvents(form);
            }

            #bindEvents(form) {
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    if (this.validate()) {
                        this.dispatchEvent(
                            new CustomEvent('submit', {
                                detail: this.getFormData(),
                                bubbles: true
                            })
                        );
                    }
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
                this.#bindEvents(this.shadowRoot.querySelector('form'));
            }
        }
        customElements.define('sub-form', SubForm);
    <\/script>
    `}function tt(){return`
    <script>
        class SubFormItem extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.#render();
            }

            #render() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: block;
                        margin-bottom: 24px;
                    }
                    .sub-form-item {
                        display: flex;
                        align-items: flex-start;
                        position: relative;
                    }
                    .sub-form-item__label {
                        flex: 0 0 auto;
                        width: var(--label-width, 80px);
                        text-align: right;
                        padding: 6px 12px 0 0;
                        color: var(--text-secondary);
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 500;
                        transition: var(--transition);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .sub-form-item__content {
                        flex: 1;
                        min-width: 0;
                        position: relative;
                        transition: var(--transition);
                    }
                    .sub-form-item__label.required::before {
                        content: '*';
                        color: #ff4d4f;
                        margin-right: 4px;
                    }
                    :host([disabled]) .sub-form-item__label {
                        color: var(--text-disabled);
                    }
                    :host([error]) .sub-form-item__label {
                        color: #ff4d4f;
                    }
                \`;

                const template = document.createElement('div');
                template.className = 'sub-form-item';

                const label = document.createElement('label');
                label.className = 'sub-form-item__label';
                label.textContent = this.getAttribute('label') || '';

                const content = document.createElement('div');
                content.className = 'sub-form-item__content';
                content.appendChild(document.createElement('slot'));

                template.appendChild(label);
                template.appendChild(content);

                this.shadowRoot.appendChild(style);
                this.shadowRoot.appendChild(template);
            }
        }
        customElements.define('sub-form-item', SubFormItem);
    <\/script>
    `}function nt(){return`
    <script>
        class SubInput extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-input {
                        position: relative;
                        font-size: 14px;
                        display: inline-flex;
                        width: 100%;
                        line-height: 32px;
                    }
                    .sub-input__wrapper {
                        display: flex;
                        flex: 1;
                        align-items: center;
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        overflow: hidden;
                    }
                    .sub-input__wrapper:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-input__wrapper:focus-within {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-input__inner {
                        flex: 1;
                        padding: 0 15px;
                        background: none;
                        border: none;
                        outline: none;
                        color: var(--text-primary);
                        font-size: inherit;
                        height: 100%;
                    }
                    .sub-input__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-input__inner:disabled {
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                    }
                    .sub-input__append {
                        background-color: var(--background-secondary);
                        border-color: var(--border-color);
                    }
                    ::slotted(button) {
                        margin: 0;
                        height: 100%;
                        width: 100%;
                        background-color: var(--primary-color);
                        color: var(--background);
                        border: 1px solid var(--primary-color);
                        padding: 0 20px;
                        border-radius: 0 var(--radius) var(--radius) 0;
                        cursor: pointer;
                        font-size: 14px;
                        line-height: 32px;
                        white-space: nowrap;
                        transition: var(--transition);
                        position: relative;
                        outline: none;
                    }
                    ::slotted(button:hover) {
                        background-color: var(--primary-hover);
                        border-color: var(--primary-hover);
                    }
                    ::slotted(button:active) {
                        background-color: var(--primary-active);
                        border-color: var(--primary-active);
                    }
                    .sub-input__prepend,
                    .sub-input__append {
                        display: flex;
                        align-items: center;
                        background-color: var(--background-secondary);
                        color: var(--text-secondary);
                        white-space: nowrap;
                        padding: 0 15px;
                        border: 1px solid var(--border-color);
                        transition: var(--transition);
                    }
                    .sub-input__prepend {
                        border-right: 0;
                        border-radius: var(--radius) 0 0 var(--radius);
                    }
                    .sub-input__append {
                        padding: 0;
                        border-left: 0;
                        border-radius: 0 var(--radius) var(--radius) 0;
                    }
                    .sub-input__prepend ::slotted(*) {
                        color: var(--text-secondary);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-input';

                // prepend slot
                const prepend = document.createElement('div');
                prepend.className = 'sub-input__prepend';
                prepend.style.display = 'none'; // 默认隐藏
                const prependSlot = document.createElement('slot');
                prependSlot.name = 'prepend';
                prepend.appendChild(prependSlot);

                // input wrapper
                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'sub-input__wrapper';

                // input
                const input = document.createElement('input');
                input.className = 'sub-input__inner';
                input.value = this.state.value;
                input.placeholder = this.getAttribute('placeholder') || '';
                input.disabled = this.hasAttribute('disabled');
                inputWrapper.appendChild(input);

                // append slot
                const append = document.createElement('div');
                append.className = 'sub-input__append';
                append.style.display = 'none'; // 默认隐藏
                const appendSlot = document.createElement('slot');
                appendSlot.name = 'append';
                append.appendChild(appendSlot);

                wrapper.appendChild(prepend);
                wrapper.appendChild(inputWrapper);
                wrapper.appendChild(append);
                this.shadowRoot.appendChild(wrapper);

                // 监听插槽内容变化
                prependSlot.addEventListener('slotchange', e => {
                    const nodes = prependSlot.assignedNodes();
                    prepend.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopLeftRadius = '0';
                        inputWrapper.style.borderBottomLeftRadius = '0';
                    } else {
                        inputWrapper.style.borderTopLeftRadius = '4px';
                        inputWrapper.style.borderBottomLeftRadius = '4px';
                    }
                });

                appendSlot.addEventListener('slotchange', e => {
                    const nodes = appendSlot.assignedNodes();
                    append.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopRightRadius = '0';
                        inputWrapper.style.borderBottomRightRadius = '0';
                    } else {
                        inputWrapper.style.borderTopRightRadius = '4px';
                        inputWrapper.style.borderBottomRightRadius = '4px';
                    }
                });

                this.#bindEvents(input);
            }

            #bindEvents(input) {
                input.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const input = this.shadowRoot.querySelector('input');
                    if (input) {
                        input.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const input = this.shadowRoot.querySelector('input');
                if (!input) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        input.placeholder = newValue;
                        break;
                    case 'disabled':
                        input.disabled = this.hasAttribute('disabled');
                        break;
                }
            }
        }
        customElements.define('sub-input', SubInput);
    <\/script>
    `}function rt(){return`
        <style>
            /* 添加通知组件样式 */
            .notification-container {
                position: fixed;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: none;
            }

            .notification {
                padding: 9px 12px;
                margin-bottom: 8px;
                border-radius: 4px;
                background: var(--background);
                box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                display: inline-flex;
                align-items: center;
                gap: 8px;
                pointer-events: auto;
                animation: messageMove 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }

            .notification-icon {
                font-size: 16px;
                line-height: 1;
            }

            .notification.success .notification-icon {
                color: #52c41a;
            }

            .notification.error .notification-icon {
                color: #ff4d4f;
            }

            .notification.info .notification-icon {
                color: var(--primary-color);
            }

            .notification-content {
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
            }

            @keyframes messageMove {
                0% {
                    padding: 6px 12px;
                    opacity: 0;
                    transform: translateY(-100%);
                }
                100% {
                    padding: 9px 12px;
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>


        <script>
            class SubNotification {
                static instance = null;

                constructor() {
                    if (SubNotification.instance) {
                        return SubNotification.instance;
                    }
                    this.init();
                    SubNotification.instance = this;
                }

                init() {
                    const container = document.createElement('div');
                    container.className = 'notification-container';
                    document.body.appendChild(container);
                    this.container = container;
                }

                show(message, type = 'info', duration = 3000) {
                    const notification = document.createElement('div');
                    notification.className = \`notification \${type}\`;

                    // 添加图标
                    const icon = document.createElement('span');
                    icon.className = 'notification-icon';
                    icon.innerHTML = this.#getIconByType(type);

                    const content = document.createElement('span');
                    content.className = 'notification-content';
                    content.textContent = message;

                    notification.appendChild(icon);
                    notification.appendChild(content);
                    this.container.appendChild(notification);

                    const close = () => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateY(-100%)';
                        notification.style.transition = 'all .3s cubic-bezier(.645,.045,.355,1)';
                        setTimeout(() => {
                            this.container.removeChild(notification);
                        }, 300);
                    };

                    if (duration > 0) {
                        setTimeout(close, duration);
                    }
                }

                static success(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'success', duration);
                }

                static error(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'error', duration);
                }

                static info(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'info', duration);
                }

                #getIconByType(type) {
                    const icons = {
                        success: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="currentColor"/>
                        </svg>\`,
                        error: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                        </svg>\`,
                        info: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" fill="currentColor"/>
                        </svg>\`
                    };
                    return icons[type] || icons.info;
                }
            }

            // 添加到全局
            window.notification = SubNotification;
        <\/script>
    
    
    `}function it(){return{arrow:`<svg viewBox="0 0 1024 1024" width="12" height="12">
                    <path d="M831.872 340.864L512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752-.064z" fill="currentColor"></path>
                </svg>`,empty:`<svg viewBox="0 0 1024 1024" width="64" height="64">
                    <path d="M855.6 427.2H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V450.4c0-12.8-11.2-23.2-24-23.2z" fill="#e6f0fc"></path>
                    <path d="M296 428.8h-128v372.8h128V428.8z m32 0v372.8h496V428.8H328z" fill="#ffffff"></path>
                    <path d="M440 176h144v76.8H440z" fill="#e6f0fc"></path>
                    <path d="M855.6 400H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V423.2c0-12.8-11.2-23.2-24-23.2z m-687.2 27.2h687.2v374.4H168.4V427.2z" fill="#4c98f7"></path>
                </svg>`}}const at=it();function ot(){return`
    <script>
        class SubMultiSelect extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: [],
                    isOpen: false
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-multi-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }

                    .sub-multi-select__wrapper {
                        position: relative;
                        min-height: 32px;
                        padding: 0px 30px 0px 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                        align-items: center;
                    }

                    .sub-multi-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-multi-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-multi-select__wrapper_disabled {
                        cursor: not-allowed;
                        background-color: var(--background-disabled);
                    }

                    .sub-multi-select__placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-multi-select__tag {
                        display: inline-flex;
                        align-items: center;
                        padding: 0 8px;
                        height: 22px;
                        line-height: 22px;
                        background-color: var(--background-secondary);
                        border-radius: var(--radius);
                        color: var(--text-primary);
                        gap: 2px;
                    }

                    .sub-multi-select__tag-close {
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        transition: var(--transition);
                    }

                    .sub-multi-select__tag-close:hover {
                        background-color: rgba(0, 0, 0, 0.1);
                    }

                    .sub-multi-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-multi-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-multi-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-multi-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-multi-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 28px;
                        line-height: 28px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .sub-multi-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-multi-select__option_selected {
                        color: var(--primary-color);
                    }

                    .sub-multi-select__checkbox {
                        width: 12px;
                        height: 12px;
                        border: 1px solid var(--border-color);
                        border-radius: 4px;
                        position: relative;
                        transition: var(--transition);
                    }

                    .sub-multi-select__checkbox::after {
                        content: '';
                        position: absolute;
                        top: 1px;
                        left: 4px;
                        width: 3px;
                        height: 7px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scale(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }

                    .sub-multi-select__checkbox_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }

                    .sub-multi-select__checkbox_checked::after {
                        transform: rotate(45deg) scale(1);
                    }

                    .sub-multi-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-multi-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-multi-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-multi-select__wrapper_disabled');
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-multi-select__arrow';
                arrow.innerHTML = \`${at.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-multi-select__dropdown';

                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                this.#bindEvents(wrapper, arrow, dropdown);
                this.#renderTags(wrapper);
            }

            #renderTags(wrapper) {
                // 清空现有内容，保留箭头
                const arrow = wrapper.querySelector('.sub-multi-select__arrow');
                wrapper.innerHTML = '';

                if (this.state.value.length === 0) {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'sub-multi-select__placeholder';
                    placeholder.textContent = this.getAttribute('placeholder') || '请选择';
                    wrapper.appendChild(placeholder);
                } else {
                    this.state.value.forEach(value => {
                        const option = this.state.options.find(opt => opt.value === value);
                        if (option) {
                            const tag = document.createElement('span');
                            tag.className = 'sub-multi-select__tag';
                            tag.innerHTML = \`
                                \${option.label}
                                <span class="sub-multi-select__tag-close">
                                    <svg viewBox="0 0 1024 1024" width="12" height="12">
                                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                                    </svg>
                                </span>
                            \`;

                            // 添加删除标签的事件
                            const closeBtn = tag.querySelector('.sub-multi-select__tag-close');
                            closeBtn.addEventListener('click', e => {
                                e.stopPropagation();
                                this.#removeValue(value);
                            });

                            wrapper.appendChild(tag);
                        }
                    });
                }

                wrapper.appendChild(arrow);
            }

            #removeValue(value) {
                this.state.value = this.state.value.filter(v => v !== value);
                this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                this.#dispatchChangeEvent();
            }

            #bindEvents(wrapper, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-multi-select__dropdown_visible');
                    wrapper.classList.remove('sub-multi-select__wrapper_active');
                    arrow.classList.remove('sub-multi-select__arrow_active');
                };

                const handleClickOutside = event => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                    }
                };

                document.addEventListener('click', handleClickOutside);

                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    if (this.state.isOpen) {
                        closeDropdown();
                    } else {
                        document.dispatchEvent(
                            new CustomEvent('sub-multi-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-multi-select__dropdown_visible');
                        wrapper.classList.add('sub-multi-select__wrapper_active');
                        arrow.classList.add('sub-multi-select__arrow_active');

                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                document.addEventListener('sub-multi-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                    }
                });
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';

                if (this.state.options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-multi-select__empty';
                    empty.textContent = '暂无数据';
                    dropdown.appendChild(empty);
                    return;
                }

                this.state.options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-multi-select__option';

                    const checkbox = document.createElement('span');
                    checkbox.className = 'sub-multi-select__checkbox';
                    if (this.state.value.includes(option.value)) {
                        checkbox.classList.add('sub-multi-select__checkbox_checked');
                        optionEl.classList.add('sub-multi-select__option_selected');
                    }

                    const label = document.createElement('span');
                    label.textContent = option.label;

                    optionEl.appendChild(checkbox);
                    optionEl.appendChild(label);

                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#toggleOption(option);
                    });

                    dropdown.appendChild(optionEl);
                });
            }

            #toggleOption(option) {
                const index = this.state.value.indexOf(option.value);
                if (index === -1) {
                    this.state.value.push(option.value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                this.#dispatchChangeEvent();
            }

            #dispatchChangeEvent() {
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                    if (this.shadowRoot.querySelector('.sub-multi-select__dropdown')) {
                        this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                            this.value = [];
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                            if (this.shadowRoot.querySelector('.sub-multi-select__dropdown')) {
                                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                            }
                        } catch (e) {
                            console.error('Invalid options format:', e);
                            this.state.options = [];
                        }
                        break;
                    case 'disabled':
                        const wrapper = this.shadowRoot.querySelector('.sub-multi-select__wrapper');
                        if (wrapper) {
                            if (this.hasAttribute('disabled')) {
                                wrapper.classList.add('sub-multi-select__wrapper_disabled');
                            } else {
                                wrapper.classList.remove('sub-multi-select__wrapper_disabled');
                            }
                        }
                        break;
                }
            }
        }

        customElements.define('sub-multi-select', SubMultiSelect);
    <\/script>`}const st=it();function ct(){return`
    <script>
        class SubSelect extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'placeholder', 'disabled', 'filterable'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.#init();
            }

            #render() {
                // 清空 shadowRoot
                this.shadowRoot.innerHTML = '';

                // 注入样式和元素
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state?.value || '';
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    // 更新输入框显示
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === val);
                    if (input && option) {
                        input.value = option.label;
                    }
                }
            }

            #init() {
                this.state = {
                    isOpen: false,
                    options: [],
                    value: this.getAttribute('value') || '',
                    filterValue: ''
                };
                this.#render();
            }

            #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-select__wrapper_disabled');
                }

                // 创建输入框
                const input = document.createElement('input');
                input.className = 'sub-select__input';
                input.placeholder = this.getAttribute('placeholder') || '请选择';
                input.readOnly = !this.hasAttribute('filterable');

                // 如果有初始值，设置输入框的值
                if (this.state.value) {
                    const option = this.state.options.find(opt => opt.value === this.state.value);
                    if (option) {
                        input.value = option.label;
                    }
                }

                if (this.hasAttribute('disabled')) {
                    input.classList.add('sub-select__input_disabled');
                    input.disabled = true;
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-select__arrow';
                arrow.innerHTML = \`${st.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-select__dropdown';

                // 组装组件
                wrapper.appendChild(input);
                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                // 绑定事件
                this.#bindEvents(wrapper, input, arrow, dropdown);
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    .sub-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-select__wrapper {
                        position: relative;
                        height: 32px;
                        padding: 0 30px 0 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                    }

                    .sub-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-select__wrapper_disabled {
                        cursor: not-allowed;
                    }

                    .sub-select__input {
                        width: 100%;
                        height: 100%;
                        border: none;
                        outline: none;
                        background: none;
                        padding: 0;
                        margin: 0;
                        color: var(--text-primary);
                        cursor: inherit;
                    }

                    .sub-select__input::placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__input_disabled {
                        cursor: not-allowed;
                        color: #c0c4cc;
                    }

                    .sub-select__input_placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 34px;
                        line-height: 34px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                    }

                    .sub-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_selected {
                        color: var(--primary-color);
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_custom {
                        color: #409eff;
                    }

                    .sub-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }

                    .sub-select__empty-icon {
                        margin-bottom: 8px;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #bindEvents(wrapper, input, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-select__dropdown_visible');
                    wrapper.classList.remove('sub-select__wrapper_active');
                    arrow.classList.remove('sub-select__arrow_active');
                };

                // 添加全局点击事件监听
                const handleClickOutside = event => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    }
                };

                // 在组件连接到 DOM 时添加事件监听
                document.addEventListener('click', handleClickOutside);

                // 在组件断开连接时移除事件监听，防止内存泄漏
                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    const isDisabled = this.getAttribute('disabled');
                    if(isDisabled === 'true') return;

                    if (this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    } else {
                        // 触发全局事件，通知其他 select 关闭
                        document.dispatchEvent(
                            new CustomEvent('sub-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-select__dropdown_visible');
                        wrapper.classList.add('sub-select__wrapper_active');
                        arrow.classList.add('sub-select__arrow_active');

                        // 如果是可过滤的，保存当前值为 placeholder 并清空输入框
                        if (this.hasAttribute('filterable')) {
                            const currentValue = input.value;
                            input.placeholder = currentValue;
                            input.value = '';
                            input.focus();
                        }

                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                // 监听全局事件，当其他 select 打开时关闭当前 select
                document.addEventListener('sub-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    }
                });

                if (this.hasAttribute('filterable')) {
                    input.addEventListener('input', e => {
                        e.stopPropagation();
                        this.state.filterValue = e.target.value;
                        if (!this.state.isOpen) {
                            toggleDropdown();
                        } else {
                            this.#renderOptions(dropdown);
                        }
                    });
                }
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';
                let options = [...this.state.options];  // 创建一个副本，避免直接修改原数组

                // 如果是过滤模式且有输入值
                if (this.hasAttribute('filterable') && this.state.filterValue) {
                    // 过滤匹配的选项
                    const filteredOptions = options.filter(option => 
                        option.label.toLowerCase().includes(this.state.filterValue.toLowerCase())
                    );

                    // 如果没有匹配的选项，添加自定义选项
                    if (filteredOptions.length === 0) {
                        const customOption = document.createElement('div');
                        customOption.className = 'sub-select__option sub-select__option_custom';
                        customOption.textContent = this.state.filterValue;
                        customOption.addEventListener('click', e => {
                            e.stopPropagation();
                            this.#selectOption({
                                value: this.state.filterValue,
                                label: this.state.filterValue
                            });
                        });
                        dropdown.appendChild(customOption);
                        return;
                    }

                    // 显示过滤后的选项
                    options = filteredOptions;
                }

                // 如果没有选项，显示空状态
                if (options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-select__empty';
                    empty.innerHTML = \`
                        <div class="sub-select__empty-icon">${st.empty}</div>
                        <div>暂无数据</div>
                    \`;
                    dropdown.appendChild(empty);
                    return;
                }

                // 渲染选项列表
                options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-select__option';
                    if (option.value === this.state.value) {
                        optionEl.classList.add('sub-select__option_selected');
                    }
                    optionEl.textContent = option.label;
                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#selectOption(option);
                    });
                    dropdown.appendChild(optionEl);
                });
            }

            #selectOption(option) {
                this.state.value = option.value;
                const input = this.shadowRoot.querySelector('.sub-select__input');
                input.value = option.label;

                // 如果是自定义选项，添加到选项列表中
                if (!this.state.options.some(opt => opt.value === option.value)) {
                    this.state.options = [...this.state.options, option];
                }

                // 清空过滤值
                this.state.filterValue = '';

                // 关闭下拉框
                const wrapper = this.shadowRoot.querySelector('.sub-select__wrapper');
                const arrow = this.shadowRoot.querySelector('.sub-select__arrow');
                const dropdown = this.shadowRoot.querySelector('.sub-select__dropdown');
                dropdown.classList.remove('sub-select__dropdown_visible');
                wrapper.classList.remove('sub-select__wrapper_active');
                arrow.classList.remove('sub-select__arrow_active');
                this.state.isOpen = false;

                // 触发事件通知外部值变化
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 update:value 事件，用于表单数据同步
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: option.value,
                            option
                        },
                        bubbles: true
                    })
                );
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'options' && newValue !== oldValue) {
                    try {
                        this.state.options = JSON.parse(newValue);
                        // 设置初始值
                        if (this.state.value) {
                            const input = this.shadowRoot.querySelector('.sub-select__input');
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option && input) {
                                input.value = option.label;
                            }
                        }
                        if (this.shadowRoot.querySelector('.sub-select__dropdown')) {
                            this.#renderOptions(this.shadowRoot.querySelector('.sub-select__dropdown'));
                        }
                    } catch (e) {
                        console.error('Invalid options format:', e);
                        this.state.options = [];
                    }
                } else if (name === 'value' && newValue !== oldValue) {
                    this.state.value = newValue;
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === newValue);
                    if (option && input) {
                        input.value = option.label;
                    }
                } else if (name === 'disabled' && newValue !== oldValue) {
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    if (newValue) {
                        input.disabled = true;
                    } else {
                        input.disabled = false;
                    }
                }
            }
        }

        customElements.define('sub-select', SubSelect);
    <\/script>`}function lt(){return`
    <script>
        class SubTextarea extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'rows', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-textarea {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }
                    .sub-textarea__inner {
                        display: block;
                        resize: vertical;
                        padding: 5px 15px;
                        line-height: 1.5;
                        box-sizing: border-box;
                        width: 100%;
                        font-size: inherit;
                        color: var(--text-primary);
                        background-color: var(--background);
                        background-image: none;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                        font-family: inherit;
                    }
                    .sub-textarea__inner:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-textarea__inner:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-textarea__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-textarea__inner:disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-textarea';

                const textarea = document.createElement('textarea');
                textarea.className = 'sub-textarea__inner';
                textarea.value = this.state.value;
                textarea.placeholder = this.getAttribute('placeholder') || '';
                textarea.rows = this.getAttribute('rows') || 2;
                textarea.disabled = this.hasAttribute('disabled');

                wrapper.appendChild(textarea);
                this.shadowRoot.appendChild(wrapper);

                this.#bindEvents(textarea);
            }

            #bindEvents(textarea) {
                textarea.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    // 触发原生事件
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    // 触发自定义事件
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            // 提供 value 的 getter/setter
            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const textarea = this.shadowRoot.querySelector('textarea');
                    if (textarea) {
                        textarea.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const textarea = this.shadowRoot.querySelector('textarea');
                if (!textarea) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        textarea.placeholder = newValue;
                        break;
                    case 'disabled':
                        textarea.disabled = this.hasAttribute('disabled');
                        break;
                    case 'rows':
                        textarea.rows = newValue;
                        break;
                }
            }
        }
        customElements.define('sub-textarea', SubTextarea);
    <\/script>
    `}function ut(){return[{label:`Emoji`,value:`emoji`},{label:`Clash新字段`,value:`new_name`},{label:`UDP`,value:`udp`},{label:`排序节点`,value:`sort`},{label:`TFO`,value:`tfo`},{label:`关闭证书检查`,value:`scv`},{label:`节点类型`,value:`append_type`},{label:`仅输出节点信息`,value:`list`}]}function dt(e,t){let{origin:n}=new URL(e.url);return t.DEFAULT_BACKEND??n}function ft(e,t){let{origin:n}=new URL(e.url);return(t.CUSTOM_BACKEND?.split(`
`).filter(Boolean)??[]).reduce((e,t)=>(e.push({label:t,value:t}),e),[{label:n,value:n}]).concat({label:`肥羊增强型后端【vless+hysteria】`,value:`https://url.v1.mk`},{label:`肥羊备用后端【vless+hysteria】`,value:`https://sub.d1.mk`},{label:`品云提供后端【实验性】`,value:`https://v.id9.cc`},{label:`つつ-多地防失联【负载均衡+国内优化】`,value:`https://api.tsutsu.one`},{label:`nameless13提供`,value:`https://www.nameless13.com`},{label:`subconverter作者提供`,value:`https://sub.xeton.dev`},{label:`sub-web作者提供`,value:`https://api.wcc.best`},{label:`sub作者&lhie1提供`,value:`https://api.dler.io`})}function pt(){return[{label:`Vless`,value:`vless`},{label:`Vmess`,value:`vmess`},{label:`Trojan`,value:`trojan`},{label:`Shadowsocks`,value:`shadowsocks`},{label:`ShadowsocksR`,value:`shadowsocksr`},{label:`Hysteria`,value:`hysteria`},{label:`Hysteria2`,value:`hysteria2`},{label:`HY2`,value:`hy2`}]}function mt(e){return(e.REMOTE_CONFIG?.split(`
`).filter(Boolean)??[]).reduce((e,t)=>(e.unshift({label:t,value:t}),e),[{label:`ACL4SSR_Online 默认版 分组比较全 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini`},{label:`ACL4SSR_Online_AdblockPlus 更多去广告 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini`},{label:`ACL4SSR_Online_NoAuto 无自动测速 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini`},{label:`ACL4SSR_Online_NoReject 无广告拦截规则 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini`},{label:`ACL4SSR_Online_Mini 精简版 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini`},{label:`ACL4SSR_Online_Mini_AdblockPlus.ini 精简版 更多去广告 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini`},{label:`ACL4SSR_Online_Mini_NoAuto.ini 精简版 不带自动测速 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini`},{label:`ACL4SSR_Online_Mini_Fallback.ini 精简版 带故障转移 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini`},{label:`ACL4SSR_Online_Mini_MultiMode.ini 精简版 自动测速、故障转移、负载均衡 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini`},{label:`ACL4SSR_Online_Full 全分组 重度用户使用 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini`},{label:`ACL4SSR_Online_Full_NoAuto.ini 全分组 无自动测速 重度用户使用 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini`},{label:`ACL4SSR_Online_Full_AdblockPlus 全分组 重度用户使用 更多去广告 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini`},{label:`ACL4SSR_Online_Full_Netflix 全分组 重度用户使用 奈飞全量 (与Github同步)`,value:`https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini`}])}function ht(e,t){if(!t.SHORT_URL_ENABLED)return[];let{origin:n}=new URL(e.url);return[{label:n,value:n}]}function gt(){return[{label:`Clash`,value:`clash`},{label:`Sing-box`,value:`singbox`},{label:`v2ray`,value:`v2ray`}]}function _t(){return`
        <script>
            // 检测系统主题
            function detectSystemTheme() {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                }
                return 'light';
            }

            // 设置主题
            function setTheme(theme) {
                if (theme === 'dark') {
                    document.documentElement.setAttribute('theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('theme');
                }
                localStorage.setItem('theme', theme);
            }

            // 初始化主题
            function initTheme() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    setTheme(detectSystemTheme());
                }
            }

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });

            // 页面加载时初始化主题
            document.addEventListener('DOMContentLoaded', () => {
                initTheme();

                // 添加主题切换按钮
                const toggleBtn = document.querySelector('.header__theme');
                toggleBtn.onclick = () => {
                    const isDark = document.documentElement.hasAttribute('theme');
                    setTheme(isDark ? 'light' : 'dark');
                };
            });
        <\/script>
    `}function vt(){return`
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Arial, sans-serif;
                background-color: var(--background);
                color: var(--text-primary);
                transition: var(--transition);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            /* 调整主体内容的布局 */
            main {
                width: 70%;
                max-width: 1200px;
                margin: 0 auto;
                margin-top: 20px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
            }

            main > header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid var(--border-color);
                padding: 10px 15px;
            }

            main > header > .header__icon {
                width: 25px;
                height: 25px;
                cursor: pointer;
                transition: var(--transition);
            }

            main > header > .header__icon svg {
                width: 100%;
                height: 100%;
            }

            main > header > .header__iconsvg path {
                fill: var(--text-primary); /* 使用主题文字颜色 */
                transition: var(--transition);
            }

            main > header > .header__icon:hover svg path {
                fill: var(--primary-color); /* 悬浮时使用主题主色 */
            }

            /* 暗色主题下的样式 */
            :root[theme='dark'] main > header > .header__icon svg path {
                fill: var(--text-primary);
            }

            :root[theme='dark'] main > header > .header__icon:hover svg path {
                fill: var(--primary-color);
            }

            main > header > .header__title {
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
                text-align: center;
            }

            /* 主题切换按钮样式优化 */
            main > header > .header__theme {
                padding: 5px 10px;
                border-radius: var(--radius);
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--text-primary);
                cursor: pointer;
                font-size: 14px;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            main > header > .header__theme:hover {
                border-color: var(--primary-color);
                color: var(--primary-color);
            }

            /* 添加主题图标 */
            main > header > .header__theme::before {
                content: '';
                width: 16px;
                height: 16px;
                background-image: var(--theme-icon);
                background-size: contain;
                background-repeat: no-repeat;
                transition: var(--transition);
            }

            /* 暗色主题图标 */
            :root[theme='dark'] main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/%3E%3C/svg%3E");
            }

            /* 亮色主题图标 */
            :root:not([theme='dark']) main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z'/%3E%3C/svg%3E");
            }

            main > section {
                margin-top: 20px;
                padding: 0 20px;
            }
        
        </style>`}function yt(){return`
    <style>
        /* 全局主题变量 */
        :root {
            /* Light Theme */
            --primary-color: #007aff;
            --primary-hover: #3395ff;
            --primary-active: #0056b3;
            --text-primary: #000000;
            --text-secondary: #666666;
            --text-disabled: #999999;
            --border-color: #9f9fa7;
            --border-hover: #b8b8bd;
            --background: #ffffff;
            --background-secondary: #f5f5f5;
            --background-disabled: #f2f2f7;
            --shadow: rgba(0, 0, 0, 0.1);
            --radius: 8px;
            --transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* Dark Theme */
        :root[theme='dark'] {
            --primary-color: #0a84ff;
            --primary-hover: #409cff;
            --primary-active: #0066cc;
            --text-primary: #ffffff;
            --text-secondary: #98989d;
            --text-disabled: #666666;
            --border-color: #9494a6;
            --border-hover: #48484c;
            --background: #1c1c1e;
            --background-secondary: #2c2c2e;
            --background-disabled: #38383c;
            --shadow: rgba(0, 0, 0, 0.3);
        }
    </style>
    `}function bt(e,t){let n=mt(t),r=ft(e,t),i=ht(e,t),a=gt(),o=ut(),s=pt(),c=dt(e,t),l=t.SHORT_URL_ENABLED===!0,u=`  
    <!DOCTYPE html>
        <html lang="en" theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sub Converter</title>

                ${yt()}
                ${vt()}

                <style>
                    .input-group {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .input-group input {
                        width: 100%;
                        padding: 4px 11px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        min-height: 32px;
                        box-sizing: border-box;
                        flex: 1;
                        background-color: var(--background);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }

                    .input-group input:disabled {
                        border-color: var(--border-color);
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                        opacity: 1;
                    }

                    .sub-form-item__actions {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 20px;
                        margin-top: 24px;
                        padding-right: 100px;
                    }
                </style>
            </head>
            <body>
                ${_t()}

                <main>
                    <header>
                        <span class="header__icon">
                            <svg
                                t="1735896323200"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1626"
                            >
                                <path
                                    d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                                    fill="#231F20"
                                    p-id="1627"
                                ></path>
                            </svg>
                        </span>

                        <span class="header__title">订阅转换</span>

                        <button class="header__theme"></button>
                    </header>

                    <section>
                        <sub-form id="sub-convert-form" label-width="100px">
                            <sub-form-item label="订阅链接">
                                <sub-textarea
                                    key="url"
                                    placeholder="支持yml/yaml订阅格式，base64订阅格式链接或单节点链接，多个链接每行一个或用 | 分隔"
                                    rows="4"
                                ></sub-textarea>
                            </sub-form-item>

                            <sub-form-item label="生成类型">
                                <sub-select key="target"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="远程配置">
                                <sub-select key="config" filterable></sub-select>
                            </sub-form-item>

                            <sub-form-item label="后端地址">
                                <sub-select key="backend" filterable></sub-select>
                            </sub-form-item>

                            <sub-form-item label="包含节点">
                                <sub-multi-select key="protocol"></sub-multi-select>
                            </sub-form-item>

                            <sub-form-item label="高级选项">
                                <sub-checkbox key="advanced" span="${o.length}"></sub-checkbox>
                            </sub-form-item>

                            <sub-form-item label="短链地址">
                                <sub-select key="shortServe" filterable placeholder="${l?``:`未配置数据库`}"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="定制订阅">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-subscribe" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-subscribe')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item label="订阅短链">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-short-url" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-short-url')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item>
                                <div class="sub-form-item__actions">
                                    <sub-button disabled id="generate-sub-btn" type="default">生成订阅链接</sub-button>
                                    <sub-button disabled id="generate-short-url-btn" type="default">生成短链</sub-button>
                                </div>
                            </sub-form-item>
                        </sub-form>
                    </section>
                </main>

                ${nt()}
                ${lt()}
                ${ct()}
                ${ot()}
                ${$e()}
                ${tt()}
                ${et()}
                ${Qe()}
                ${rt()}

                <script>
                    const formConfig = {
                        target: {
                            type: 'sub-select',
                            options: ${JSON.stringify(a)}
                        },
                        config: {
                            type: 'sub-select',
                            options: ${JSON.stringify(n)}
                        },
                        backend: {
                            type: 'sub-select',
                            options: ${JSON.stringify(r)}
                        },
                        protocol: {
                            type: 'sub-multi-select',
                            options: ${JSON.stringify(s)}
                        },
                        advanced: {
                            type: 'sub-checkbox',
                            options: ${JSON.stringify(o)}
                        },
                        shortServe: {
                            type: 'sub-select',
                            options: ${JSON.stringify(i)}
                        }
                    };

                    class Sub {
                        #model = {
                            target: '${a[0].value}',
                            config: '${n[0].value}',
                            backend: '${c}',
                            protocol: '${JSON.stringify(s.map(e=>e.value))}',
                            advanced: ['emoji', 'new_name', 'udp'],
                            shortServe: '${i[0]?.value??``}',

                            subUrl: '',
                            shortUrl: ''
                        };

                        #formSubscribe = this.#$('#form-subscribe');
                        #formShortUrl = this.#$('#form-short-url');

                        #generateSubBtn = this.#$('#generate-sub-btn');
                        #generateShortUrlBtn = this.#$('#generate-short-url-btn');

                        #form = this.#$('#sub-convert-form');
                        #formItems = this.#form.querySelectorAll('sub-form-item');

                        #headerIcon = this.#$('.header__icon');

                        constructor() {
                            this.#init();
                            this.#bindEvents();
                        }

                        #init() {
                            this.#formItems.forEach(item => {
                                const formItem = item.querySelector('[key]');
                                if (formItem) {
                                    const formItemKey = formItem.getAttribute('key');
                                    const type = formConfig[formItemKey]?.type;
                                    if (type && ['sub-select', 'sub-checkbox', 'sub-multi-select'].includes(type)) {
                                        formItem.setAttribute('options', JSON.stringify(formConfig[formItemKey].options));
                                    }

                                    if(formItemKey === 'shortServe' && ${!l}) {
                                        formItem.setAttribute('disabled', 'true');
                                    }

                                    if (formConfig[formItemKey]?.disabled) {
                                        formItem.setAttribute('disabled', '');
                                    }
                                }
                            });

                            this.#form.setAttribute('model', JSON.stringify(this.#model));
                        }

                        #bindEvents() {

                            this.#headerIcon.addEventListener('click', () => {
                                window.open('https://github.com/jwyGithub/sub-convert');
                            });


                            this.#form.addEventListener('form:change', e => {
                                this.#model[e.detail.key] = e.detail.value;
                                this.#form.setAttribute('model', JSON.stringify(this.#model));

                                if (this.#model.url) {
                                    this.#generateSubBtn.removeAttribute('disabled');
                                } else {
                                    this.#generateSubBtn.setAttribute('disabled', '');
                                }
                            });

                            this.#generateSubBtn.addEventListener('click', () => {
                                const url = new URL(this.#model.backend + '/sub');
                                url.searchParams.set('target', this.#model.target);
                                url.searchParams.set('url', this.#model.url);
                                url.searchParams.set('insert', 'true');
                                url.searchParams.set('config', this.#model.config);
                                url.searchParams.set('protocol', Array.isArray(this.#model.protocol) ? JSON.stringify(this.#model.protocol) : this.#model.protocol);
                                
                                const advancedOptions = this.#getAdvancedOptions(this.#model);

                                advancedOptions.forEach(option => {
                                    url.searchParams.set(option.label, option.value);
                                });

                                const subUrl = url.toString();
                                this.#formSubscribe.value = subUrl;
                                this.#model.subUrl = subUrl;

                                this.#generateShortUrlBtn.removeAttribute('disabled');
                            });



                            this.#generateShortUrlBtn.addEventListener('click', async () => {
                                if (!this.#model.shortServe) {
                                    notification.error('短链服务不存在');
                                    return;
                                }

                                // 构建请求数据
                                const requestData = {
                                    serve: this.#model.shortServe,
                                    long_url: this.#model.subUrl
                                };

                                // 发送请求
                                const response = await fetch(\`\${this.#model.shortServe}/api/add\`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestData)
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    this.#formShortUrl.value = data.data.short_url;
                                    this.#model.shortUrl = data.data.short_url;
                                    notification.success('生成短链接成功');
                                } else {
                                    notification.error('生成短链接失败');
                                }
                            });
                        }

                        #getAdvancedOptions(model) {
                            return formConfig.advanced.options.map(option => {
                                return {
                                    label: option.value,
                                    value: model.advanced.includes(option.value)
                                };
                            });
                        }

                        /**
                         * 获取元素
                         * @param {string} selector
                         * @returns {HTMLElement}
                         */
                        #$(selector) {
                            return document.querySelector(selector);
                        }

                        async copySubUrl(dom) {
                            const text = this.#$(\`#\${dom}\`).value;
                            if (!text) {
                                notification.error('复制内容不能为空');
                                return;
                            }

                            const success = await this.copyToClipboard(text);
                            if (success) {
                                notification.success('复制成功');
                            }
                        }

                        async copyToClipboard(text) {
                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    // 优先使用 Clipboard API
                                    await navigator.clipboard.writeText(text);
                                    return true;
                                } else {
                                    // 降级使用 document.execCommand
                                    const textArea = document.createElement('textarea');
                                    textArea.value = text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();

                                    const success = document.execCommand('copy');
                                    textArea.remove();

                                    if (!success) {
                                        throw new Error('复制失败');
                                    }
                                    return true;
                                }
                            } catch (error) {
                                notification.error('复制失败: ' + (error.message || '未知错误'));
                                return false;
                            }
                        }
                    }

                    const sub = new Sub();

                <\/script>
            </body>
        </html>
    `;return new Response(u,{headers:new Headers({"Content-Type":`text/html; charset=UTF-8`,"Cache-Control":`no-store, no-cache, must-revalidate`})})}const xt=new ze;xt.get(`/`,e=>bt(e.req.raw,e.env)),xt.get(`/favicon.ico`,e=>e.body(null,204));var St=class{constructor(e){this.service=e}async toSub(e){let n=e.req.query(`target`);if(!n)throw new t(400,{message:`Unsupported client type`});let r=gt().map(e=>e.value);if(!r.includes(n))throw new t(400,{message:`Unsupported client type, support list: ${r.join(`, `)}`});let{body:i,contentType:a}=await this.service.toSub(e.req.raw,e.env,n);return e.body(i,200,{"Content-Type":a,"Cache-Control":`no-store`})}async getVersion(e){let t=this.service.getVersionRedirect(e.req.raw,e.env);return e.redirect(t,302)}async add(e){let n=await e.req.json();if(!n?.long_url)throw new t(400,{message:`Missing long_url`});let r=new URL(e.req.url),i=n.serve||`${r.protocol}//${r.host}`,a=await this.service.add(n.long_url,i);return e.json({data:a})}async delete(e){let n=e.req.query(`code`);if(!n)throw new t(400,{message:`Missing code`});return await this.service.deleteByCode(n),e.json({data:{deleted:!0}})}async queryByCode(e){let n=e.req.query(`code`);if(!n)throw new t(400,{message:`Missing code`});let r=await this.service.getByCode(n);if(!r)throw new t(404,{message:`Not found`});return e.json({data:r})}async queryList(e){let t=Number.parseInt(e.req.query(`page`)||`1`,10),n=Number.parseInt(e.req.query(`pageSize`)||`10`,10),r=await this.service.getList(t,n);return e.json({data:r})}async redirect(e){let n=e.req.param(`code`);if(!n)throw new t(400,{message:`Invalid short URL`});let r=await this.service.getByCode(n);if(!r)throw new t(404,{message:`Not found`});return e.redirect(r.long_url,302)}};
/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */
function Ct(e){return e==null}function wt(e){return typeof e==`object`&&!!e}function Tt(e){return Array.isArray(e)?e:Ct(e)?[]:[e]}function Et(e,t){var n,r,i,a;if(t)for(a=Object.keys(t),n=0,r=a.length;n<r;n+=1)i=a[n],e[i]=t[i];return e}function Dt(e,t){var n=``,r;for(r=0;r<t;r+=1)n+=e;return n}function Ot(e){return e===0&&1/e==-1/0}var w={isNothing:Ct,isObject:wt,toArray:Tt,repeat:Dt,isNegativeZero:Ot,extend:Et};function kt(e,t){var n=``,r=e.reason||`(unknown reason)`;return e.mark?(e.mark.name&&(n+=`in "`+e.mark.name+`" `),n+=`(`+(e.mark.line+1)+`:`+(e.mark.column+1)+`)`,!t&&e.mark.snippet&&(n+=`

`+e.mark.snippet),r+` `+n):r}function T(e,t){Error.call(this),this.name=`YAMLException`,this.reason=e,this.mark=t,this.message=kt(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=Error().stack||``}T.prototype=Object.create(Error.prototype),T.prototype.constructor=T,T.prototype.toString=function(e){return this.name+`: `+kt(this,e)};var E=T;function At(e,t,n,r,i){var a=``,o=``,s=Math.floor(i/2)-1;return r-t>s&&(a=` ... `,t=r-s+a.length),n-r>s&&(o=` ...`,n=r+s-o.length),{str:a+e.slice(t,n).replace(/\t/g,`→`)+o,pos:r-t+a.length}}function jt(e,t){return w.repeat(` `,t-e.length)+e}function Mt(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||=79,typeof t.indent!=`number`&&(t.indent=1),typeof t.linesBefore!=`number`&&(t.linesBefore=3),typeof t.linesAfter!=`number`&&(t.linesAfter=2);for(var n=/\r?\n|\r|\0/g,r=[0],i=[],a,o=-1;a=n.exec(e.buffer);)i.push(a.index),r.push(a.index+a[0].length),e.position<=a.index&&o<0&&(o=r.length-2);o<0&&(o=r.length-1);var s=``,c,l,u=Math.min(e.line+t.linesAfter,i.length).toString().length,d=t.maxLength-(t.indent+u+3);for(c=1;c<=t.linesBefore&&!(o-c<0);c++)l=At(e.buffer,r[o-c],i[o-c],e.position-(r[o]-r[o-c]),d),s=w.repeat(` `,t.indent)+jt((e.line-c+1).toString(),u)+` | `+l.str+`
`+s;for(l=At(e.buffer,r[o],i[o],e.position,d),s+=w.repeat(` `,t.indent)+jt((e.line+1).toString(),u)+` | `+l.str+`
`,s+=w.repeat(`-`,t.indent+u+3+l.pos)+`^
`,c=1;c<=t.linesAfter&&!(o+c>=i.length);c++)l=At(e.buffer,r[o+c],i[o+c],e.position-(r[o]-r[o+c]),d),s+=w.repeat(` `,t.indent)+jt((e.line+c+1).toString(),u)+` | `+l.str+`
`;return s.replace(/\n$/,``)}var Nt=Mt,Pt=[`kind`,`multi`,`resolve`,`construct`,`instanceOf`,`predicate`,`represent`,`representName`,`defaultStyle`,`styleAliases`],Ft=[`scalar`,`sequence`,`mapping`];function It(e){var t={};return e!==null&&Object.keys(e).forEach(function(n){e[n].forEach(function(e){t[String(e)]=n})}),t}function Lt(e,t){if(t||={},Object.keys(t).forEach(function(t){if(Pt.indexOf(t)===-1)throw new E(`Unknown option "`+t+`" is met in definition of "`+e+`" YAML type.`)}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=It(t.styleAliases||null),Ft.indexOf(this.kind)===-1)throw new E(`Unknown kind "`+this.kind+`" is specified for "`+e+`" YAML type.`)}var D=Lt;function Rt(e,t){var n=[];return e[t].forEach(function(e){var t=n.length;n.forEach(function(n,r){n.tag===e.tag&&n.kind===e.kind&&n.multi===e.multi&&(t=r)}),n[t]=e}),n}function zt(){var e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},t,n;function r(t){t.multi?(e.multi[t.kind].push(t),e.multi.fallback.push(t)):e[t.kind][t.tag]=e.fallback[t.tag]=t}for(t=0,n=arguments.length;t<n;t+=1)arguments[t].forEach(r);return e}function Bt(e){return this.extend(e)}Bt.prototype.extend=function(e){var t=[],n=[];if(e instanceof D)n.push(e);else if(Array.isArray(e))n=n.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(n=n.concat(e.explicit));else throw new E(`Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })`);t.forEach(function(e){if(!(e instanceof D))throw new E(`Specified list of YAML types (or a single Type object) contains a non-Type object.`);if(e.loadKind&&e.loadKind!==`scalar`)throw new E(`There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.`);if(e.multi)throw new E(`There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.`)}),n.forEach(function(e){if(!(e instanceof D))throw new E(`Specified list of YAML types (or a single Type object) contains a non-Type object.`)});var r=Object.create(Bt.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(n),r.compiledImplicit=Rt(r,`implicit`),r.compiledExplicit=Rt(r,`explicit`),r.compiledTypeMap=zt(r.compiledImplicit,r.compiledExplicit),r};var Vt=new Bt({explicit:[new D(`tag:yaml.org,2002:str`,{kind:`scalar`,construct:function(e){return e===null?``:e}}),new D(`tag:yaml.org,2002:seq`,{kind:`sequence`,construct:function(e){return e===null?[]:e}}),new D(`tag:yaml.org,2002:map`,{kind:`mapping`,construct:function(e){return e===null?{}:e}})]});function Ht(e){if(e===null)return!0;var t=e.length;return t===1&&e===`~`||t===4&&(e===`null`||e===`Null`||e===`NULL`)}function Ut(){return null}function Wt(e){return e===null}var Gt=new D(`tag:yaml.org,2002:null`,{kind:`scalar`,resolve:Ht,construct:Ut,predicate:Wt,represent:{canonical:function(){return`~`},lowercase:function(){return`null`},uppercase:function(){return`NULL`},camelcase:function(){return`Null`},empty:function(){return``}},defaultStyle:`lowercase`});function Kt(e){if(e===null)return!1;var t=e.length;return t===4&&(e===`true`||e===`True`||e===`TRUE`)||t===5&&(e===`false`||e===`False`||e===`FALSE`)}function qt(e){return e===`true`||e===`True`||e===`TRUE`}function Jt(e){return Object.prototype.toString.call(e)===`[object Boolean]`}var Yt=new D(`tag:yaml.org,2002:bool`,{kind:`scalar`,resolve:Kt,construct:qt,predicate:Jt,represent:{lowercase:function(e){return e?`true`:`false`},uppercase:function(e){return e?`TRUE`:`FALSE`},camelcase:function(e){return e?`True`:`False`}},defaultStyle:`lowercase`});function Xt(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Zt(e){return 48<=e&&e<=55}function Qt(e){return 48<=e&&e<=57}function $t(e){if(e===null)return!1;var t=e.length,n=0,r=!1,i;if(!t)return!1;if(i=e[n],(i===`-`||i===`+`)&&(i=e[++n]),i===`0`){if(n+1===t)return!0;if(i=e[++n],i===`b`){for(n++;n<t;n++)if(i=e[n],i!==`_`){if(i!==`0`&&i!==`1`)return!1;r=!0}return r&&i!==`_`}if(i===`x`){for(n++;n<t;n++)if(i=e[n],i!==`_`){if(!Xt(e.charCodeAt(n)))return!1;r=!0}return r&&i!==`_`}if(i===`o`){for(n++;n<t;n++)if(i=e[n],i!==`_`){if(!Zt(e.charCodeAt(n)))return!1;r=!0}return r&&i!==`_`}}if(i===`_`)return!1;for(;n<t;n++)if(i=e[n],i!==`_`){if(!Qt(e.charCodeAt(n)))return!1;r=!0}return!(!r||i===`_`)}function en(e){var t=e,n=1,r;if(t.indexOf(`_`)!==-1&&(t=t.replace(/_/g,``)),r=t[0],(r===`-`||r===`+`)&&(r===`-`&&(n=-1),t=t.slice(1),r=t[0]),t===`0`)return 0;if(r===`0`){if(t[1]===`b`)return n*parseInt(t.slice(2),2);if(t[1]===`x`)return n*parseInt(t.slice(2),16);if(t[1]===`o`)return n*parseInt(t.slice(2),8)}return n*parseInt(t,10)}function tn(e){return Object.prototype.toString.call(e)===`[object Number]`&&e%1==0&&!w.isNegativeZero(e)}var nn=new D(`tag:yaml.org,2002:int`,{kind:`scalar`,resolve:$t,construct:en,predicate:tn,represent:{binary:function(e){return e>=0?`0b`+e.toString(2):`-0b`+e.toString(2).slice(1)},octal:function(e){return e>=0?`0o`+e.toString(8):`-0o`+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?`0x`+e.toString(16).toUpperCase():`-0x`+e.toString(16).toUpperCase().slice(1)}},defaultStyle:`decimal`,styleAliases:{binary:[2,`bin`],octal:[8,`oct`],decimal:[10,`dec`],hexadecimal:[16,`hex`]}}),rn=RegExp(`^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);function an(e){return!(e===null||!rn.test(e)||e[e.length-1]===`_`)}function on(e){var t=e.replace(/_/g,``).toLowerCase(),n=t[0]===`-`?-1:1;return`+-`.indexOf(t[0])>=0&&(t=t.slice(1)),t===`.inf`?n===1?1/0:-1/0:t===`.nan`?NaN:n*parseFloat(t,10)}var sn=/^[-+]?[0-9]+e/;function cn(e,t){var n;if(isNaN(e))switch(t){case`lowercase`:return`.nan`;case`uppercase`:return`.NAN`;case`camelcase`:return`.NaN`}else if(e===1/0)switch(t){case`lowercase`:return`.inf`;case`uppercase`:return`.INF`;case`camelcase`:return`.Inf`}else if(e===-1/0)switch(t){case`lowercase`:return`-.inf`;case`uppercase`:return`-.INF`;case`camelcase`:return`-.Inf`}else if(w.isNegativeZero(e))return`-0.0`;return n=e.toString(10),sn.test(n)?n.replace(`e`,`.e`):n}function ln(e){return Object.prototype.toString.call(e)===`[object Number]`&&(e%1!=0||w.isNegativeZero(e))}var un=new D(`tag:yaml.org,2002:float`,{kind:`scalar`,resolve:an,construct:on,predicate:ln,represent:cn,defaultStyle:`lowercase`}),dn=Vt.extend({implicit:[Gt,Yt,nn,un]}),fn=RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$`),pn=RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$`);function mn(e){return e===null?!1:fn.exec(e)!==null||pn.exec(e)!==null}function hn(e){var t,n,r,i,a,o,s,c=0,l=null,u,d,f;if(t=fn.exec(e),t===null&&(t=pn.exec(e)),t===null)throw Error(`Date resolve error`);if(n=+t[1],r=t[2]-1,i=+t[3],!t[4])return new Date(Date.UTC(n,r,i));if(a=+t[4],o=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+=`0`;c=+c}return t[9]&&(u=+t[10],d=+(t[11]||0),l=(u*60+d)*6e4,t[9]===`-`&&(l=-l)),f=new Date(Date.UTC(n,r,i,a,o,s,c)),l&&f.setTime(f.getTime()-l),f}function gn(e){return e.toISOString()}var _n=new D(`tag:yaml.org,2002:timestamp`,{kind:`scalar`,resolve:mn,construct:hn,instanceOf:Date,represent:gn});function vn(e){return e===`<<`||e===null}var yn=new D(`tag:yaml.org,2002:merge`,{kind:`scalar`,resolve:vn}),bn=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function xn(e){if(e===null)return!1;var t,n,r=0,i=e.length,a=bn;for(n=0;n<i;n++)if(t=a.indexOf(e.charAt(n)),!(t>64)){if(t<0)return!1;r+=6}return r%8==0}function Sn(e){var t,n,r=e.replace(/[\r\n=]/g,``),i=r.length,a=bn,o=0,s=[];for(t=0;t<i;t++)t%4==0&&t&&(s.push(o>>16&255),s.push(o>>8&255),s.push(o&255)),o=o<<6|a.indexOf(r.charAt(t));return n=i%4*6,n===0?(s.push(o>>16&255),s.push(o>>8&255),s.push(o&255)):n===18?(s.push(o>>10&255),s.push(o>>2&255)):n===12&&s.push(o>>4&255),new Uint8Array(s)}function Cn(e){var t=``,n=0,r,i,a=e.length,o=bn;for(r=0;r<a;r++)r%3==0&&r&&(t+=o[n>>18&63],t+=o[n>>12&63],t+=o[n>>6&63],t+=o[n&63]),n=(n<<8)+e[r];return i=a%3,i===0?(t+=o[n>>18&63],t+=o[n>>12&63],t+=o[n>>6&63],t+=o[n&63]):i===2?(t+=o[n>>10&63],t+=o[n>>4&63],t+=o[n<<2&63],t+=o[64]):i===1&&(t+=o[n>>2&63],t+=o[n<<4&63],t+=o[64],t+=o[64]),t}function wn(e){return Object.prototype.toString.call(e)===`[object Uint8Array]`}var Tn=new D(`tag:yaml.org,2002:binary`,{kind:`scalar`,resolve:xn,construct:Sn,predicate:wn,represent:Cn}),En=Object.prototype.hasOwnProperty,Dn=Object.prototype.toString;function On(e){if(e===null)return!0;var t=[],n,r,i,a,o,s=e;for(n=0,r=s.length;n<r;n+=1){if(i=s[n],o=!1,Dn.call(i)!==`[object Object]`)return!1;for(a in i)if(En.call(i,a))if(!o)o=!0;else return!1;if(!o)return!1;if(t.indexOf(a)===-1)t.push(a);else return!1}return!0}function kn(e){return e===null?[]:e}var An=new D(`tag:yaml.org,2002:omap`,{kind:`sequence`,resolve:On,construct:kn}),jn=Object.prototype.toString;function Mn(e){if(e===null)return!0;var t,n,r,i,a,o=e;for(a=Array(o.length),t=0,n=o.length;t<n;t+=1){if(r=o[t],jn.call(r)!==`[object Object]`||(i=Object.keys(r),i.length!==1))return!1;a[t]=[i[0],r[i[0]]]}return!0}function Nn(e){if(e===null)return[];var t,n,r,i,a,o=e;for(a=Array(o.length),t=0,n=o.length;t<n;t+=1)r=o[t],i=Object.keys(r),a[t]=[i[0],r[i[0]]];return a}var Pn=new D(`tag:yaml.org,2002:pairs`,{kind:`sequence`,resolve:Mn,construct:Nn}),Fn=Object.prototype.hasOwnProperty;function In(e){if(e===null)return!0;var t,n=e;for(t in n)if(Fn.call(n,t)&&n[t]!==null)return!1;return!0}function Ln(e){return e===null?{}:e}var Rn=new D(`tag:yaml.org,2002:set`,{kind:`mapping`,resolve:In,construct:Ln}),zn=dn.extend({implicit:[_n,yn],explicit:[Tn,An,Pn,Rn]}),O=Object.prototype.hasOwnProperty,Bn=1,Vn=2,Hn=3,Un=4,Wn=1,Gn=2,Kn=3,qn=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Jn=/[\x85\u2028\u2029]/,Yn=/[,\[\]\{\}]/,Xn=/^(?:!|!!|![a-z\-]+!)$/i,Zn=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Qn(e){return Object.prototype.toString.call(e)}function k(e){return e===10||e===13}function A(e){return e===9||e===32}function j(e){return e===9||e===32||e===10||e===13}function M(e){return e===44||e===91||e===93||e===123||e===125}function $n(e){var t;return 48<=e&&e<=57?e-48:(t=e|32,97<=t&&t<=102?t-97+10:-1)}function er(e){return e===120?2:e===117?4:e===85?8:0}function tr(e){return 48<=e&&e<=57?e-48:-1}function nr(e){return e===48?`\0`:e===97?`\x07`:e===98?`\b`:e===116||e===9?`	`:e===110?`
`:e===118?`\v`:e===102?`\f`:e===114?`\r`:e===101?`\x1B`:e===32?` `:e===34?`"`:e===47?`/`:e===92?`\\`:e===78?``:e===95?`\xA0`:e===76?`\u2028`:e===80?`\u2029`:``}function rr(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function ir(e,t,n){t===`__proto__`?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:n}):e[t]=n}for(var ar=Array(256),or=Array(256),N=0;N<256;N++)ar[N]=+!!nr(N),or[N]=nr(N);function sr(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||zn,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function cr(e,t){var n={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return n.snippet=Nt(n),new E(t,n)}function P(e,t){throw cr(e,t)}function lr(e,t){e.onWarning&&e.onWarning.call(null,cr(e,t))}var ur={YAML:function(e,t,n){var r,i,a;e.version!==null&&P(e,`duplication of %YAML directive`),n.length!==1&&P(e,`YAML directive accepts exactly one argument`),r=/^([0-9]+)\.([0-9]+)$/.exec(n[0]),r===null&&P(e,`ill-formed argument of the YAML directive`),i=parseInt(r[1],10),a=parseInt(r[2],10),i!==1&&P(e,`unacceptable YAML version of the document`),e.version=n[0],e.checkLineBreaks=a<2,a!==1&&a!==2&&lr(e,`unsupported YAML version of the document`)},TAG:function(e,t,n){var r,i;n.length!==2&&P(e,`TAG directive accepts exactly two arguments`),r=n[0],i=n[1],Xn.test(r)||P(e,`ill-formed tag handle (first argument) of the TAG directive`),O.call(e.tagMap,r)&&P(e,`there is a previously declared suffix for "`+r+`" tag handle`),Zn.test(i)||P(e,`ill-formed tag prefix (second argument) of the TAG directive`);try{i=decodeURIComponent(i)}catch{P(e,`tag prefix is malformed: `+i)}e.tagMap[r]=i}};function F(e,t,n,r){var i,a,o,s;if(t<n){if(s=e.input.slice(t,n),r)for(i=0,a=s.length;i<a;i+=1)o=s.charCodeAt(i),o===9||32<=o&&o<=1114111||P(e,`expected valid JSON character`);else qn.test(s)&&P(e,`the stream contains non-printable characters`);e.result+=s}}function dr(e,t,n,r){var i,a,o,s;for(w.isObject(n)||P(e,`cannot merge mappings; the provided source object is unacceptable`),i=Object.keys(n),o=0,s=i.length;o<s;o+=1)a=i[o],O.call(t,a)||(ir(t,a,n[a]),r[a]=!0)}function I(e,t,n,r,i,a,o,s,c){var l,u;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),l=0,u=i.length;l<u;l+=1)Array.isArray(i[l])&&P(e,`nested arrays are not supported inside keys`),typeof i==`object`&&Qn(i[l])===`[object Object]`&&(i[l]=`[object Object]`);if(typeof i==`object`&&Qn(i)===`[object Object]`&&(i=`[object Object]`),i=String(i),t===null&&(t={}),r===`tag:yaml.org,2002:merge`)if(Array.isArray(a))for(l=0,u=a.length;l<u;l+=1)dr(e,t,a[l],n);else dr(e,t,a,n);else !e.json&&!O.call(n,i)&&O.call(t,i)&&(e.line=o||e.line,e.lineStart=s||e.lineStart,e.position=c||e.position,P(e,`duplicated mapping key`)),ir(t,i,a),delete n[i];return t}function fr(e){var t=e.input.charCodeAt(e.position);t===10?e.position++:t===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):P(e,`a line break is expected`),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function L(e,t,n){for(var r=0,i=e.input.charCodeAt(e.position);i!==0;){for(;A(i);)i===9&&e.firstTabInLine===-1&&(e.firstTabInLine=e.position),i=e.input.charCodeAt(++e.position);if(t&&i===35)do i=e.input.charCodeAt(++e.position);while(i!==10&&i!==13&&i!==0);if(k(i))for(fr(e),i=e.input.charCodeAt(e.position),r++,e.lineIndent=0;i===32;)e.lineIndent++,i=e.input.charCodeAt(++e.position);else break}return n!==-1&&r!==0&&e.lineIndent<n&&lr(e,`deficient indentation`),r}function pr(e){var t=e.position,n=e.input.charCodeAt(t);return!!((n===45||n===46)&&n===e.input.charCodeAt(t+1)&&n===e.input.charCodeAt(t+2)&&(t+=3,n=e.input.charCodeAt(t),n===0||j(n)))}function mr(e,t){t===1?e.result+=` `:t>1&&(e.result+=w.repeat(`
`,t-1))}function hr(e,t,n){var r,i,a,o,s,c,l,u,d=e.kind,f=e.result,p=e.input.charCodeAt(e.position);if(j(p)||M(p)||p===35||p===38||p===42||p===33||p===124||p===62||p===39||p===34||p===37||p===64||p===96||(p===63||p===45)&&(i=e.input.charCodeAt(e.position+1),j(i)||n&&M(i)))return!1;for(e.kind=`scalar`,e.result=``,a=o=e.position,s=!1;p!==0;){if(p===58){if(i=e.input.charCodeAt(e.position+1),j(i)||n&&M(i))break}else if(p===35){if(r=e.input.charCodeAt(e.position-1),j(r))break}else if(e.position===e.lineStart&&pr(e)||n&&M(p))break;else if(k(p))if(c=e.line,l=e.lineStart,u=e.lineIndent,L(e,!1,-1),e.lineIndent>=t){s=!0,p=e.input.charCodeAt(e.position);continue}else{e.position=o,e.line=c,e.lineStart=l,e.lineIndent=u;break}s&&=(F(e,a,o,!1),mr(e,e.line-c),a=o=e.position,!1),A(p)||(o=e.position+1),p=e.input.charCodeAt(++e.position)}return F(e,a,o,!1),e.result?!0:(e.kind=d,e.result=f,!1)}function gr(e,t){var n=e.input.charCodeAt(e.position),r,i;if(n!==39)return!1;for(e.kind=`scalar`,e.result=``,e.position++,r=i=e.position;(n=e.input.charCodeAt(e.position))!==0;)if(n===39)if(F(e,r,e.position,!0),n=e.input.charCodeAt(++e.position),n===39)r=e.position,e.position++,i=e.position;else return!0;else k(n)?(F(e,r,i,!0),mr(e,L(e,!1,t)),r=i=e.position):e.position===e.lineStart&&pr(e)?P(e,`unexpected end of the document within a single quoted scalar`):(e.position++,i=e.position);P(e,`unexpected end of the stream within a single quoted scalar`)}function _r(e,t){var n,r,i,a,o,s=e.input.charCodeAt(e.position);if(s!==34)return!1;for(e.kind=`scalar`,e.result=``,e.position++,n=r=e.position;(s=e.input.charCodeAt(e.position))!==0;)if(s===34)return F(e,n,e.position,!0),e.position++,!0;else if(s===92){if(F(e,n,e.position,!0),s=e.input.charCodeAt(++e.position),k(s))L(e,!1,t);else if(s<256&&ar[s])e.result+=or[s],e.position++;else if((o=er(s))>0){for(i=o,a=0;i>0;i--)s=e.input.charCodeAt(++e.position),(o=$n(s))>=0?a=(a<<4)+o:P(e,`expected hexadecimal character`);e.result+=rr(a),e.position++}else P(e,`unknown escape sequence`);n=r=e.position}else k(s)?(F(e,n,r,!0),mr(e,L(e,!1,t)),n=r=e.position):e.position===e.lineStart&&pr(e)?P(e,`unexpected end of the document within a double quoted scalar`):(e.position++,r=e.position);P(e,`unexpected end of the stream within a double quoted scalar`)}function vr(e,t){var n=!0,r,i,a,o=e.tag,s,c=e.anchor,l,u,d,f,p,m=Object.create(null),h,g,_,v=e.input.charCodeAt(e.position);if(v===91)u=93,p=!1,s=[];else if(v===123)u=125,p=!0,s={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),v=e.input.charCodeAt(++e.position);v!==0;){if(L(e,!0,t),v=e.input.charCodeAt(e.position),v===u)return e.position++,e.tag=o,e.anchor=c,e.kind=p?`mapping`:`sequence`,e.result=s,!0;n?v===44&&P(e,`expected the node content, but found ','`):P(e,`missed comma between flow collection entries`),g=h=_=null,d=f=!1,v===63&&(l=e.input.charCodeAt(e.position+1),j(l)&&(d=f=!0,e.position++,L(e,!0,t))),r=e.line,i=e.lineStart,a=e.position,R(e,t,Bn,!1,!0),g=e.tag,h=e.result,L(e,!0,t),v=e.input.charCodeAt(e.position),(f||e.line===r)&&v===58&&(d=!0,v=e.input.charCodeAt(++e.position),L(e,!0,t),R(e,t,Bn,!1,!0),_=e.result),p?I(e,s,m,g,h,_,r,i,a):d?s.push(I(e,null,m,g,h,_,r,i,a)):s.push(h),L(e,!0,t),v=e.input.charCodeAt(e.position),v===44?(n=!0,v=e.input.charCodeAt(++e.position)):n=!1}P(e,`unexpected end of the stream within a flow collection`)}function yr(e,t){var n,r,i=Wn,a=!1,o=!1,s=t,c=0,l=!1,u,d=e.input.charCodeAt(e.position);if(d===124)r=!1;else if(d===62)r=!0;else return!1;for(e.kind=`scalar`,e.result=``;d!==0;)if(d=e.input.charCodeAt(++e.position),d===43||d===45)Wn===i?i=d===43?Kn:Gn:P(e,`repeat of a chomping mode identifier`);else if((u=tr(d))>=0)u===0?P(e,`bad explicit indentation width of a block scalar; it cannot be less than one`):o?P(e,`repeat of an indentation width identifier`):(s=t+u-1,o=!0);else break;if(A(d)){do d=e.input.charCodeAt(++e.position);while(A(d));if(d===35)do d=e.input.charCodeAt(++e.position);while(!k(d)&&d!==0)}for(;d!==0;){for(fr(e),e.lineIndent=0,d=e.input.charCodeAt(e.position);(!o||e.lineIndent<s)&&d===32;)e.lineIndent++,d=e.input.charCodeAt(++e.position);if(!o&&e.lineIndent>s&&(s=e.lineIndent),k(d)){c++;continue}if(e.lineIndent<s){i===Kn?e.result+=w.repeat(`
`,a?1+c:c):i===Wn&&a&&(e.result+=`
`);break}for(r?A(d)?(l=!0,e.result+=w.repeat(`
`,a?1+c:c)):l?(l=!1,e.result+=w.repeat(`
`,c+1)):c===0?a&&(e.result+=` `):e.result+=w.repeat(`
`,c):e.result+=w.repeat(`
`,a?1+c:c),a=!0,o=!0,c=0,n=e.position;!k(d)&&d!==0;)d=e.input.charCodeAt(++e.position);F(e,n,e.position,!1)}return!0}function br(e,t){var n,r=e.tag,i=e.anchor,a=[],o,s=!1,c;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=a),c=e.input.charCodeAt(e.position);c!==0&&(e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,P(e,`tab characters must not be used in indentation`)),!(c!==45||(o=e.input.charCodeAt(e.position+1),!j(o))));){if(s=!0,e.position++,L(e,!0,-1)&&e.lineIndent<=t){a.push(null),c=e.input.charCodeAt(e.position);continue}if(n=e.line,R(e,t,Hn,!1,!0),a.push(e.result),L(e,!0,-1),c=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&c!==0)P(e,`bad indentation of a sequence entry`);else if(e.lineIndent<t)break}return s?(e.tag=r,e.anchor=i,e.kind=`sequence`,e.result=a,!0):!1}function xr(e,t,n){var r,i,a,o,s,c,l=e.tag,u=e.anchor,d={},f=Object.create(null),p=null,m=null,h=null,g=!1,_=!1,v;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=d),v=e.input.charCodeAt(e.position);v!==0;){if(!g&&e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,P(e,`tab characters must not be used in indentation`)),r=e.input.charCodeAt(e.position+1),a=e.line,(v===63||v===58)&&j(r))v===63?(g&&(I(e,d,f,p,m,null,o,s,c),p=m=h=null),_=!0,g=!0,i=!0):g?(g=!1,i=!0):P(e,`incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line`),e.position+=1,v=r;else{if(o=e.line,s=e.lineStart,c=e.position,!R(e,n,Vn,!1,!0))break;if(e.line===a){for(v=e.input.charCodeAt(e.position);A(v);)v=e.input.charCodeAt(++e.position);if(v===58)v=e.input.charCodeAt(++e.position),j(v)||P(e,`a whitespace character is expected after the key-value separator within a block mapping`),g&&(I(e,d,f,p,m,null,o,s,c),p=m=h=null),_=!0,g=!1,i=!1,p=e.tag,m=e.result;else if(_)P(e,`can not read an implicit mapping pair; a colon is missed`);else return e.tag=l,e.anchor=u,!0}else if(_)P(e,`can not read a block mapping entry; a multiline key may not be an implicit key`);else return e.tag=l,e.anchor=u,!0}if((e.line===a||e.lineIndent>t)&&(g&&(o=e.line,s=e.lineStart,c=e.position),R(e,t,Un,!0,i)&&(g?m=e.result:h=e.result),g||(I(e,d,f,p,m,h,o,s,c),p=m=h=null),L(e,!0,-1),v=e.input.charCodeAt(e.position)),(e.line===a||e.lineIndent>t)&&v!==0)P(e,`bad indentation of a mapping entry`);else if(e.lineIndent<t)break}return g&&I(e,d,f,p,m,null,o,s,c),_&&(e.tag=l,e.anchor=u,e.kind=`mapping`,e.result=d),_}function Sr(e){var t,n=!1,r=!1,i,a,o=e.input.charCodeAt(e.position);if(o!==33)return!1;if(e.tag!==null&&P(e,`duplication of a tag property`),o=e.input.charCodeAt(++e.position),o===60?(n=!0,o=e.input.charCodeAt(++e.position)):o===33?(r=!0,i=`!!`,o=e.input.charCodeAt(++e.position)):i=`!`,t=e.position,n){do o=e.input.charCodeAt(++e.position);while(o!==0&&o!==62);e.position<e.length?(a=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):P(e,`unexpected end of the stream within a verbatim tag`)}else{for(;o!==0&&!j(o);)o===33&&(r?P(e,`tag suffix cannot contain exclamation marks`):(i=e.input.slice(t-1,e.position+1),Xn.test(i)||P(e,`named tag handle cannot contain such characters`),r=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);a=e.input.slice(t,e.position),Yn.test(a)&&P(e,`tag suffix cannot contain flow indicator characters`)}a&&!Zn.test(a)&&P(e,`tag name cannot contain such characters: `+a);try{a=decodeURIComponent(a)}catch{P(e,`tag name is malformed: `+a)}return n?e.tag=a:O.call(e.tagMap,i)?e.tag=e.tagMap[i]+a:i===`!`?e.tag=`!`+a:i===`!!`?e.tag=`tag:yaml.org,2002:`+a:P(e,`undeclared tag handle "`+i+`"`),!0}function Cr(e){var t,n=e.input.charCodeAt(e.position);if(n!==38)return!1;for(e.anchor!==null&&P(e,`duplication of an anchor property`),n=e.input.charCodeAt(++e.position),t=e.position;n!==0&&!j(n)&&!M(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&P(e,`name of an anchor node must contain at least one character`),e.anchor=e.input.slice(t,e.position),!0}function wr(e){var t,n,r=e.input.charCodeAt(e.position);if(r!==42)return!1;for(r=e.input.charCodeAt(++e.position),t=e.position;r!==0&&!j(r)&&!M(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&P(e,`name of an alias node must contain at least one character`),n=e.input.slice(t,e.position),O.call(e.anchorMap,n)||P(e,`unidentified alias "`+n+`"`),e.result=e.anchorMap[n],L(e,!0,-1),!0}function R(e,t,n,r,i){var a,o,s,c=1,l=!1,u=!1,d,f,p,m,h,g;if(e.listener!==null&&e.listener(`open`,e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=o=s=Un===n||Hn===n,r&&L(e,!0,-1)&&(l=!0,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)),c===1)for(;Sr(e)||Cr(e);)L(e,!0,-1)?(l=!0,s=a,e.lineIndent>t?c=1:e.lineIndent===t?c=0:e.lineIndent<t&&(c=-1)):s=!1;if(s&&=l||i,(c===1||Un===n)&&(h=Bn===n||Vn===n?t:t+1,g=e.position-e.lineStart,c===1?s&&(br(e,g)||xr(e,g,h))||vr(e,h)?u=!0:(o&&yr(e,h)||gr(e,h)||_r(e,h)?u=!0:wr(e)?(u=!0,(e.tag!==null||e.anchor!==null)&&P(e,`alias node should not have any properties`)):hr(e,h,Bn===n)&&(u=!0,e.tag===null&&(e.tag=`?`)),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):c===0&&(u=s&&br(e,g))),e.tag===null)e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);else if(e.tag===`?`){for(e.result!==null&&e.kind!==`scalar`&&P(e,`unacceptable node kind for !<?> tag; it should be "scalar", not "`+e.kind+`"`),d=0,f=e.implicitTypes.length;d<f;d+=1)if(m=e.implicitTypes[d],m.resolve(e.result)){e.result=m.construct(e.result),e.tag=m.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else if(e.tag!==`!`){if(O.call(e.typeMap[e.kind||`fallback`],e.tag))m=e.typeMap[e.kind||`fallback`][e.tag];else for(m=null,p=e.typeMap.multi[e.kind||`fallback`],d=0,f=p.length;d<f;d+=1)if(e.tag.slice(0,p[d].tag.length)===p[d].tag){m=p[d];break}m||P(e,`unknown tag !<`+e.tag+`>`),e.result!==null&&m.kind!==e.kind&&P(e,`unacceptable node kind for !<`+e.tag+`> tag; it should be "`+m.kind+`", not "`+e.kind+`"`),m.resolve(e.result,e.tag)?(e.result=m.construct(e.result,e.tag),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):P(e,`cannot resolve a node with !<`+e.tag+`> explicit tag`)}return e.listener!==null&&e.listener(`close`,e),e.tag!==null||e.anchor!==null||u}function Tr(e){var t=e.position,n,r,i,a=!1,o;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);(o=e.input.charCodeAt(e.position))!==0&&(L(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||o!==37));){for(a=!0,o=e.input.charCodeAt(++e.position),n=e.position;o!==0&&!j(o);)o=e.input.charCodeAt(++e.position);for(r=e.input.slice(n,e.position),i=[],r.length<1&&P(e,`directive name must not be less than one character in length`);o!==0;){for(;A(o);)o=e.input.charCodeAt(++e.position);if(o===35){do o=e.input.charCodeAt(++e.position);while(o!==0&&!k(o));break}if(k(o))break;for(n=e.position;o!==0&&!j(o);)o=e.input.charCodeAt(++e.position);i.push(e.input.slice(n,e.position))}o!==0&&fr(e),O.call(ur,r)?ur[r](e,r,i):lr(e,`unknown document directive "`+r+`"`)}if(L(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,L(e,!0,-1)):a&&P(e,`directives end mark is expected`),R(e,e.lineIndent-1,Un,!1,!0),L(e,!0,-1),e.checkLineBreaks&&Jn.test(e.input.slice(t,e.position))&&lr(e,`non-ASCII line breaks are interpreted as content`),e.documents.push(e.result),e.position===e.lineStart&&pr(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,L(e,!0,-1));return}if(e.position<e.length-1)P(e,`end of the stream or a document separator is expected`);else return}function Er(e,t){e=String(e),t||={},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var n=new sr(e,t),r=e.indexOf(`\0`);for(r!==-1&&(n.position=r,P(n,`null byte is not allowed in input`)),n.input+=`\0`;n.input.charCodeAt(n.position)===32;)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)Tr(n);return n.documents}function Dr(e,t,n){typeof t==`object`&&t&&n===void 0&&(n=t,t=null);var r=Er(e,n);if(typeof t!=`function`)return r;for(var i=0,a=r.length;i<a;i+=1)t(r[i])}function Or(e,t){var n=Er(e,t);if(n.length!==0){if(n.length===1)return n[0];throw new E(`expected a single document in the stream, but found more`)}}var kr={loadAll:Dr,load:Or},Ar=Object.prototype.toString,jr=Object.prototype.hasOwnProperty,Mr=65279,Nr=9,z=10,Pr=13,Fr=32,Ir=33,Lr=34,Rr=35,zr=37,Br=38,Vr=39,Hr=42,Ur=44,Wr=45,Gr=58,Kr=61,qr=62,Jr=63,Yr=64,Xr=91,Zr=93,Qr=96,$r=123,ei=124,ti=125,B={};B[0]=`\\0`,B[7]=`\\a`,B[8]=`\\b`,B[9]=`\\t`,B[10]=`\\n`,B[11]=`\\v`,B[12]=`\\f`,B[13]=`\\r`,B[27]=`\\e`,B[34]=`\\"`,B[92]=`\\\\`,B[133]=`\\N`,B[160]=`\\_`,B[8232]=`\\L`,B[8233]=`\\P`;var ni=[`y`,`Y`,`yes`,`Yes`,`YES`,`on`,`On`,`ON`,`n`,`N`,`no`,`No`,`NO`,`off`,`Off`,`OFF`],ri=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function ii(e,t){var n,r,i,a,o,s,c;if(t===null)return{};for(n={},r=Object.keys(t),i=0,a=r.length;i<a;i+=1)o=r[i],s=String(t[o]),o.slice(0,2)===`!!`&&(o=`tag:yaml.org,2002:`+o.slice(2)),c=e.compiledTypeMap.fallback[o],c&&jr.call(c.styleAliases,s)&&(s=c.styleAliases[s]),n[o]=s;return n}function ai(e){var t=e.toString(16).toUpperCase(),n,r;if(e<=255)n=`x`,r=2;else if(e<=65535)n=`u`,r=4;else if(e<=4294967295)n=`U`,r=8;else throw new E(`code point within a string may not be greater than 0xFFFFFFFF`);return`\\`+n+w.repeat(`0`,r-t.length)+t}var oi=1,V=2;function si(e){this.schema=e.schema||zn,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=w.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=ii(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType=e.quotingType===`"`?V:oi,this.forceQuotes=e.forceQuotes||!1,this.replacer=typeof e.replacer==`function`?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result=``,this.duplicates=[],this.usedDuplicates=null}function ci(e,t){for(var n=w.repeat(` `,t),r=0,i=-1,a=``,o,s=e.length;r<s;)i=e.indexOf(`
`,r),i===-1?(o=e.slice(r),r=s):(o=e.slice(r,i+1),r=i+1),o.length&&o!==`
`&&(a+=n),a+=o;return a}function li(e,t){return`
`+w.repeat(` `,e.indent*t)}function ui(e,t){var n,r,i;for(n=0,r=e.implicitTypes.length;n<r;n+=1)if(i=e.implicitTypes[n],i.resolve(t))return!0;return!1}function di(e){return e===Fr||e===Nr}function H(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==Mr||65536<=e&&e<=1114111}function fi(e){return H(e)&&e!==Mr&&e!==Pr&&e!==z}function pi(e,t,n){var r=fi(e),i=r&&!di(e);return(n?r:r&&e!==Ur&&e!==Xr&&e!==Zr&&e!==$r&&e!==ti)&&e!==Rr&&!(t===Gr&&!i)||fi(t)&&!di(t)&&e===Rr||t===Gr&&i}function mi(e){return H(e)&&e!==Mr&&!di(e)&&e!==Wr&&e!==Jr&&e!==Gr&&e!==Ur&&e!==Xr&&e!==Zr&&e!==$r&&e!==ti&&e!==Rr&&e!==Br&&e!==Hr&&e!==Ir&&e!==ei&&e!==Kr&&e!==qr&&e!==Vr&&e!==Lr&&e!==zr&&e!==Yr&&e!==Qr}function hi(e){return!di(e)&&e!==Gr}function U(e,t){var n=e.charCodeAt(t),r;return n>=55296&&n<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1),r>=56320&&r<=57343)?(n-55296)*1024+r-56320+65536:n}function gi(e){return/^\n* /.test(e)}var _i=1,vi=2,yi=3,bi=4,W=5;function xi(e,t,n,r,i,a,o,s){var c,l=0,u=null,d=!1,f=!1,p=r!==-1,m=-1,h=mi(U(e,0))&&hi(U(e,e.length-1));if(t||o)for(c=0;c<e.length;l>=65536?c+=2:c++){if(l=U(e,c),!H(l))return W;h&&=pi(l,u,s),u=l}else{for(c=0;c<e.length;l>=65536?c+=2:c++){if(l=U(e,c),l===z)d=!0,p&&(f||=c-m-1>r&&e[m+1]!==` `,m=c);else if(!H(l))return W;h&&=pi(l,u,s),u=l}f||=p&&c-m-1>r&&e[m+1]!==` `}return!d&&!f?h&&!o&&!i(e)?_i:a===V?W:vi:n>9&&gi(e)?W:o?a===V?W:vi:f?bi:yi}function Si(e,t,n,r,i){e.dump=function(){if(t.length===0)return e.quotingType===V?`""`:`''`;if(!e.noCompatMode&&(ni.indexOf(t)!==-1||ri.test(t)))return e.quotingType===V?`"`+t+`"`:`'`+t+`'`;var a=e.indent*Math.max(1,n),o=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),s=r||e.flowLevel>-1&&n>=e.flowLevel;function c(t){return ui(e,t)}switch(xi(t,s,e.indent,o,c,e.quotingType,e.forceQuotes&&!r,i)){case _i:return t;case vi:return`'`+t.replace(/'/g,`''`)+`'`;case yi:return`|`+Ci(t,e.indent)+wi(ci(t,a));case bi:return`>`+Ci(t,e.indent)+wi(ci(Ti(t,o),a));case W:return`"`+Di(t)+`"`;default:throw new E(`impossible error: invalid scalar style`)}}()}function Ci(e,t){var n=gi(e)?String(t):``,r=e[e.length-1]===`
`;return n+(r&&(e[e.length-2]===`
`||e===`
`)?`+`:r?``:`-`)+`
`}function wi(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function Ti(e,t){for(var n=/(\n+)([^\n]*)/g,r=function(){var r=e.indexOf(`
`);return r=r===-1?e.length:r,n.lastIndex=r,Ei(e.slice(0,r),t)}(),i=e[0]===`
`||e[0]===` `,a,o;o=n.exec(e);){var s=o[1],c=o[2];a=c[0]===` `,r+=s+(!i&&!a&&c!==``?`
`:``)+Ei(c,t),i=a}return r}function Ei(e,t){if(e===``||e[0]===` `)return e;for(var n=/ [^ ]/g,r,i=0,a,o=0,s=0,c=``;r=n.exec(e);)s=r.index,s-i>t&&(a=o>i?o:s,c+=`
`+e.slice(i,a),i=a+1),o=s;return c+=`
`,e.length-i>t&&o>i?c+=e.slice(i,o)+`
`+e.slice(o+1):c+=e.slice(i),c.slice(1)}function Di(e){for(var t=``,n=0,r,i=0;i<e.length;n>=65536?i+=2:i++)n=U(e,i),r=B[n],!r&&H(n)?(t+=e[i],n>=65536&&(t+=e[i+1])):t+=r||ai(n);return t}function Oi(e,t,n){var r=``,i=e.tag,a,o,s;for(a=0,o=n.length;a<o;a+=1)s=n[a],e.replacer&&(s=e.replacer.call(n,String(a),s)),(G(e,t,s,!1,!1)||s===void 0&&G(e,t,null,!1,!1))&&(r!==``&&(r+=`,`+(e.condenseFlow?``:` `)),r+=e.dump);e.tag=i,e.dump=`[`+r+`]`}function ki(e,t,n,r){var i=``,a=e.tag,o,s,c;for(o=0,s=n.length;o<s;o+=1)c=n[o],e.replacer&&(c=e.replacer.call(n,String(o),c)),(G(e,t+1,c,!0,!0,!1,!0)||c===void 0&&G(e,t+1,null,!0,!0,!1,!0))&&((!r||i!==``)&&(i+=li(e,t)),e.dump&&z===e.dump.charCodeAt(0)?i+=`-`:i+=`- `,i+=e.dump);e.tag=a,e.dump=i||`[]`}function Ai(e,t,n){var r=``,i=e.tag,a=Object.keys(n),o,s,c,l,u;for(o=0,s=a.length;o<s;o+=1)u=``,r!==``&&(u+=`, `),e.condenseFlow&&(u+=`"`),c=a[o],l=n[c],e.replacer&&(l=e.replacer.call(n,c,l)),G(e,t,c,!1,!1)&&(e.dump.length>1024&&(u+=`? `),u+=e.dump+(e.condenseFlow?`"`:``)+`:`+(e.condenseFlow?``:` `),G(e,t,l,!1,!1)&&(u+=e.dump,r+=u));e.tag=i,e.dump=`{`+r+`}`}function ji(e,t,n,r){var i=``,a=e.tag,o=Object.keys(n),s,c,l,u,d,f;if(e.sortKeys===!0)o.sort();else if(typeof e.sortKeys==`function`)o.sort(e.sortKeys);else if(e.sortKeys)throw new E(`sortKeys must be a boolean or a function`);for(s=0,c=o.length;s<c;s+=1)f=``,(!r||i!==``)&&(f+=li(e,t)),l=o[s],u=n[l],e.replacer&&(u=e.replacer.call(n,l,u)),G(e,t+1,l,!0,!0,!0)&&(d=e.tag!==null&&e.tag!==`?`||e.dump&&e.dump.length>1024,d&&(e.dump&&z===e.dump.charCodeAt(0)?f+=`?`:f+=`? `),f+=e.dump,d&&(f+=li(e,t)),G(e,t+1,u,!0,d)&&(e.dump&&z===e.dump.charCodeAt(0)?f+=`:`:f+=`: `,f+=e.dump,i+=f));e.tag=a,e.dump=i||`{}`}function Mi(e,t,n){var r,i=n?e.explicitTypes:e.implicitTypes,a,o,s,c;for(a=0,o=i.length;a<o;a+=1)if(s=i[a],(s.instanceOf||s.predicate)&&(!s.instanceOf||typeof t==`object`&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(n?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag=`?`,s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,Ar.call(s.represent)===`[object Function]`)r=s.represent(t,c);else if(jr.call(s.represent,c))r=s.represent[c](t,c);else throw new E(`!<`+s.tag+`> tag resolver accepts not "`+c+`" style`);e.dump=r}return!0}return!1}function G(e,t,n,r,i,a,o){e.tag=null,e.dump=n,Mi(e,n,!1)||Mi(e,n,!0);var s=Ar.call(e.dump),c=r,l;r&&=e.flowLevel<0||e.flowLevel>t;var u=s===`[object Object]`||s===`[object Array]`,d,f;if(u&&(d=e.duplicates.indexOf(n),f=d!==-1),(e.tag!==null&&e.tag!==`?`||f||e.indent!==2&&t>0)&&(i=!1),f&&e.usedDuplicates[d])e.dump=`*ref_`+d;else{if(u&&f&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),s===`[object Object]`)r&&Object.keys(e.dump).length!==0?(ji(e,t,e.dump,i),f&&(e.dump=`&ref_`+d+e.dump)):(Ai(e,t,e.dump),f&&(e.dump=`&ref_`+d+` `+e.dump));else if(s===`[object Array]`)r&&e.dump.length!==0?(e.noArrayIndent&&!o&&t>0?ki(e,t-1,e.dump,i):ki(e,t,e.dump,i),f&&(e.dump=`&ref_`+d+e.dump)):(Oi(e,t,e.dump),f&&(e.dump=`&ref_`+d+` `+e.dump));else if(s===`[object String]`)e.tag!==`?`&&Si(e,e.dump,t,a,c);else if(s===`[object Undefined]`)return!1;else{if(e.skipInvalid)return!1;throw new E(`unacceptable kind of an object to dump `+s)}e.tag!==null&&e.tag!==`?`&&(l=encodeURI(e.tag[0]===`!`?e.tag.slice(1):e.tag).replace(/!/g,`%21`),l=e.tag[0]===`!`?`!`+l:l.slice(0,18)===`tag:yaml.org,2002:`?`!!`+l.slice(18):`!<`+l+`>`,e.dump=l+` `+e.dump)}return!0}function Ni(e,t){var n=[],r=[],i,a;for(Pi(e,n,r),i=0,a=r.length;i<a;i+=1)t.duplicates.push(n[r[i]]);t.usedDuplicates=Array(a)}function Pi(e,t,n){var r,i,a;if(typeof e==`object`&&e)if(i=t.indexOf(e),i!==-1)n.indexOf(i)===-1&&n.push(i);else if(t.push(e),Array.isArray(e))for(i=0,a=e.length;i<a;i+=1)Pi(e[i],t,n);else for(r=Object.keys(e),i=0,a=r.length;i<a;i+=1)Pi(e[r[i]],t,n)}function Fi(e,t){t||={};var n=new si(t);n.noRefs||Ni(e,n);var r=e;return n.replacer&&(r=n.replacer.call({"":r},``,r)),G(n,0,r,!0,!0)?n.dump+`
`:``}var Ii={dump:Fi},Li=kr.load;kr.loadAll;var Ri=Ii.dump;const K={BACKEND:`https://url.v1.mk`,LOCK_BACKEND:!1,REMOTE_CONFIG:``,CHUNK_COUNT:`20`};function zi(e,t=10){let n=[],r=[];return e.forEach((e,i)=>{r.push(e),(i+1)%t===0&&(n.push(r.join(`|`)),r=[])}),r.length>0&&n.push(r.join(`|`)),n}function Bi(e){try{return JSON.parse(e),!0}catch{return!1}}function q(e,t){return Object.hasOwn(e,t)}const J={retries:0,retryDelay:1e3,maxRetryDelay:3e4,timeout:1e4,retryOn:[408,429,500,502,503,504],exponentialBackoff:!0,jitter:.1},Vi={timeout:0};var Hi=class{requestInterceptors=[];responseInterceptors=[];useRequestInterceptor(e){this.requestInterceptors.push(e)}useResponseInterceptor(e){this.responseInterceptors.push(e)}async request(e,t={}){let n,r;e instanceof Request?(r=e.url,n={...t,retries:J.retries,url:r,method:e.method||`GET`,headers:Object.fromEntries(e.headers.entries())}):typeof e==`string`||e instanceof URL?(r=e.toString(),n={...t,retries:J.retries,url:r}):(r=e.url,n={...e,...t,retries:t.retries??J.retries}),n.retries=n.retries??J.retries,n.retryDelay=n.retryDelay??J.retryDelay,n.timeout=n.timeout??Vi.timeout,n.method=n.method||`GET`;for(let e of this.requestInterceptors)n=await e(n);if(n.params){let e=new URLSearchParams(n.params).toString();n.url+=(n.url.includes(`?`)?`&`:`?`)+e}let i=0,a=new AbortController,o=t.signal||a.signal,s=async()=>{i++;let e;n.timeout&&n.timeout>0&&(e=setTimeout(()=>{a.abort()},n.timeout));try{let t=new Request(n.url,{method:n.method,headers:n.headers,body:n.body?JSON.stringify(n.body):void 0,signal:o}),r=await fetch(t);e&&clearTimeout(e);let a;switch(n.responseType){case`text`:a=await r.text();break;case`blob`:a=await r.blob();break;case`arrayBuffer`:a=await r.arrayBuffer();break;case`formData`:a=await r.formData();break;case`stream`:if(!r.body)throw Error(`Response body is null`);a=r.body;break;default:a=await r.json();break}let c={data:a,status:r.status,statusText:r.statusText,headers:Object.fromEntries(r.headers.entries()),config:n,ok:r.ok};for(let e of this.responseInterceptors)c=await e(c);return!r.ok&&n.retries>0&&i<n.retries?(await new Promise(e=>setTimeout(e,n.retryDelay)),s()):c}catch(t){if(e&&clearTimeout(e),t.name===`AbortError`)throw Error(`请求超时`);if(n.retries>0&&i<n.retries)return await new Promise(e=>setTimeout(e,n.retryDelay)),s();throw t}};return s()}get(e,t){return this.request(e,{...t,method:`GET`})}post(e,t,n){return this.request(e,{...n,method:`POST`,body:t})}put(e,t,n){return this.request(e,{...n,method:`PUT`,body:t})}delete(e,t){return this.request(e,{...t,method:`DELETE`})}patch(e,t,n){return this.request(e,{...n,method:`PATCH`,body:t})}async fetchJson(e,t){return await this.request(e,{...t,headers:{Accept:`application/json`,...t?.headers}})}async fetchBlob(e,t){let n=await fetch(new Request(e,t));return{data:await n.blob(),status:n.status,statusText:n.statusText,headers:Object.fromEntries(n.headers.entries()),config:{url:n.url,...t},ok:n.ok}}async fetchText(e,t){let n=await fetch(new Request(e,t));return{data:await n.text(),status:n.status,statusText:n.statusText,headers:Object.fromEntries(n.headers.entries()),config:{url:n.url,...t},ok:n.ok}}async fetchArrayBuffer(e,t){let n=await fetch(new Request(e,t));return{data:await n.arrayBuffer(),status:n.status,statusText:n.statusText,headers:Object.fromEntries(n.headers.entries()),config:{url:n.url,...t},ok:n.ok}}async fetchFormData(e,t){let n=await fetch(new Request(e,t));return{data:await n.formData(),status:n.status,statusText:n.statusText,headers:Object.fromEntries(n.headers.entries()),config:{url:n.url,...t},ok:n.ok}}async fetchStream(e,t){let n=await fetch(new Request(e,t));if(!n.body)throw Error(`Response body is null`);return{data:n.body,status:n.status,statusText:n.statusText,headers:Object.fromEntries(n.headers.entries()),config:{url:n.url,...t},ok:n.ok}}},Ui=class extends Error{constructor(e,t,n,r){super(e),this.message=e,this.status=t,this.response=n,this.attempt=r,this.name=`FetchRetryError`}};function Wi(e,t){let n=t.retryDelay;if(t.exponentialBackoff&&(n*=2**(e-1)),t.jitter>0){let e=t.jitter*Math.random();n*=1+e}return Math.min(n,t.maxRetryDelay)}function Gi(e){return new Promise((t,n)=>{setTimeout(()=>{n(new Ui(`请求超时 (${e}ms)`))},e)})}async function Ki(e,t={}){let n={...J,...t,retries:t.retries===1/0?30:Math.min(t.retries||J.retries||0,30)},r=0,i=async()=>{r++;try{let a,o;if(e instanceof Request){o=e.url;let n=e.clone();a=new Request(n,{...n,...t})}else o=e.toString(),a=new Request(o,t);let s=fetch(a),c=n.timeout?Gi(n.timeout):null,l=await(c?Promise.race([s,c]):s),u={status:l.status,statusText:l.statusText,headers:Object.fromEntries(l.headers.entries()),data:l,config:{url:o,...t},ok:l.ok};if(n.retries>0&&r<=n.retries&&(typeof n.retryOn==`function`?n.retryOn(l):n.retryOn.includes(l.status))){let e=Wi(r,n);if(n.onRetry&&await n.onRetry(r,e),n.onError){let e=new Ui(`请求失败，状态码 ${u.status}`,u.status,l,r);await n.onError(e,r)}return await new Promise(t=>setTimeout(t,e)),i()}return u}catch(e){let t=e instanceof Ui?e:new Ui(e.message||`请求失败`,void 0,void 0,r);if(n.onError&&await n.onError(t,r),n.retries>0&&r<=n.retries){let e=Wi(r,n);return n.onRetry&&await n.onRetry(r,e),await new Promise(t=>setTimeout(t,e)),i()}throw t}};return i()}new Hi;function Y(e){if(!e)return e;let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return new TextDecoder().decode(n)}function qi(e,t){let n=t||(e=>e);try{return e?Y(e.toString()):n(e)}catch{return n(e)}}function X(e){if(!e)return e;let t=new TextEncoder().encode(e.trim()),n=``;for(let e=0;e<t.length;e+=1)n+=String.fromCharCode(t[e]);return btoa(n)}function Ji(e,t){let n=t||(e=>e);try{return e?X(e.toString()):n(e)}catch{return n(e)}}var Yi=class{existVps=[];existVpsMap=new Map;constructor(e=[]){this.existVps=e,this.updateExist(this.existVps)}updateExist(e=[]){for(let t of e){let e=this.getParser(t);e&&this.setExistVpsMap(e)}}updateVpsPs(e){let t=this.getParser(e);if(!t)return null;let n=t.originPs,[r,i]=n.split(`#`);if(!i)return e;let a=this.existVpsMap.get(i)||0,o=a===0?n:`${r}#${i} ${a}`;return t.updateOriginConfig(o),this.existVpsMap.set(i,a+1),t.originLink}setExistVpsMap(e){let[,t]=e.originPs.split(`#`);if(!t)return;let[n,r]=t.split(` `),i=r?Number.parseInt(r)>>>0:0,a=this.existVpsMap.get(n)||0;this.existVpsMap.set(n,Math.max(a,i+1))}getParser(e){return e.startsWith(`vless://`)?new ta(e):e.startsWith(`vmess://`)?new na(e):e.startsWith(`trojan://`)?new ea(e):e.startsWith(`ss://`)?new Qi(e):e.startsWith(`ssr://`)?new $i(e):e.startsWith(`hysteria2://`)||e.startsWith(`hysteria://`)||e.startsWith(`hy2://`)?new Zi(e):null}},Xi=class extends Yi{constructor(e=[]){super(e)}},Z=class{#e=[`localhost`,`127.0.0.1`,`abc.cba.com`];#t=[`AES_256_GCM`,`CHACHA20_POLY1305`,`AES_128_GCM`,`CHACHA20_IETF`];#n=1024;#r=65535;getUUID(){return crypto.randomUUID()}getUsername(){return this.getUUID()}getPassword(){return this.getUUID()}getHost(){return`${this.getHostName()}:${this.getPort()}`}getHostName(){return this.#e[Math.floor(Math.random()*this.#e.length)]}getPort(){return Math.floor(Math.random()*(this.#r-this.#n+1)+this.#n).toString()}getEncrtptionProtocol(){return this.#t[Math.floor(Math.random()*this.#t.length)]}},Q=class e{static#e=`^LINK_TO^`;static#t=new Map;static getPs(t){let n=t.split(e.#e);return[n[0],n[1]]}static setPs(t,n){return[this.formatPs(t),n].join(e.#e)}static formatPs(e){return e?e.replace(/\|/g,`-`):crypto.randomUUID()}static getPrefix(t){if(!t?.includes(e.#e))return null;if(e.#t.has(t))return e.#t.get(t);let[n]=e.getPs(t);if(n){let r=n.trim();return e.#t.set(t,r),r}return null}static isConfigType(e){return e.includes(this.#e)}static clearCache(){this.#t.clear()}},Zi=class extends Z{#e=``;#t=``;#n={};#r={};#i=``;#a=``;constructor(e){super(),this.#a=crypto.randomUUID(),this.setOriginConfig(e),this.setConfuseConfig(e)}setOriginConfig(e){this.#e=e,this.#n=new URL(e),this.#i=this.#n.hash??``}updateOriginConfig(e){this.#n.hash=e,this.#i=e,this.#e=this.#n.href,this.setConfuseConfig(this.#e)}setConfuseConfig(e){this.#r=new URL(e),this.#r.username=this.getUsername(),this.#r.host=this.getHost(),this.#r.hostname=this.getHostName(),this.#r.port=this.getPort(),this.#r.hash=Q.setPs(this.#i,this.#a),this.#t=this.#r.href}restoreClash(e,t){return e.name=t,e.server=this.originConfig.hostname??``,e.port=Number(this.originConfig.port??0),e.type===`hysteria2`&&q(e,`password`)&&(e.password=this.originConfig?.searchParams?.get(`password`)??``),q(e,`down`)&&(e.down=e.down===``?this.originConfig.searchParams?.get(`down`)??this.originConfig.searchParams?.get(`downmbps`)??0:e.down,e.down=decodeURIComponent(e.down)),q(e,`up`)&&(e.up=e.up===``?this.originConfig.searchParams?.get(`up`)??this.originConfig.searchParams?.get(`upmbps`)??0:e.up,e.up=decodeURIComponent(e.up)),q(e,`delay`)&&(e.delay=this.originConfig.searchParams?.get(`delay`)??0),this.originConfig.searchParams?.has(`sni`)&&(e.sni=this.originConfig.searchParams?.get(`sni`)??``),e}restoreSingbox(e,t){return e.password=this.originConfig?.searchParams?.get(`password`)??``,e.server=this.originConfig.hostname??``,e.server_port=Number(this.originConfig.port??0),e.tag=t,e.down&&=decodeURIComponent(e.down),e.up&&=decodeURIComponent(e.up),e}get originPs(){return this.#i}get originLink(){return this.#e}get originConfig(){return this.#n}get confusePs(){return encodeURIComponent(this.#a)}get confuseLink(){return this.#t}get confuseConfig(){return this.#r}},Qi=class extends Z{#e=``;#t=``;#n={};#r={};#i=``;#a=``;constructor(e){super(),this.#a=crypto.randomUUID(),this.setOriginConfig(e),this.setConfuseConfig(e)}setOriginConfig(e){let t=this.toStandard(e);this.#e=t,this.#n=new URL(t),this.#i=this.#n.hash??``}updateOriginConfig(e){this.#n.hash=e,this.#i=e,this.#e=this.#n.href,this.setConfuseConfig(this.#e)}setConfuseConfig(e){this.#r=new URL(this.toStandard(e)),this.#r.username=this.getUsername(),this.#r.host=this.getHost(),this.#r.hostname=this.getHostName(),this.#r.port=this.getPort(),this.#r.hash=Q.setPs(this.#i,this.#a),this.#t=`ss://${decodeURIComponent(this.#n.username)}@${this.#r.hostname}:${this.#r.port}${this.#r.search}#${this.#r.hash}`}restoreClash(e,t){return e.name=t,e.server=this.originConfig.hostname??``,e.port=Number(this.originConfig?.port??0),e}restoreSingbox(e,t){return e.server=this.originConfig.hostname??``,e.server_port=Number(this.originConfig.port??0),e.tag=t,e}get originPs(){return this.#i}get originLink(){return this.#e}get originConfig(){return this.#n}get confusePs(){return this.#a}get confuseLink(){return this.#t}get confuseConfig(){return this.#r}toStandard(e){let t=e.match(/#(.*)$/),n=t?`#${t[1]}`:``,r=e.replace(/#.*$/,``);if(!r.startsWith(`ss://`))return e;let i=r.substring(5);if(i.includes(`@`))return e;try{let e=Y(i),t=e.lastIndexOf(`@`);if(t===-1)throw Error(`Invalid SIP002 format: missing @ separator`);let r=e.substring(0,t),a=e.substring(t+1),o=r.indexOf(`:`);if(o===-1)throw Error(`Invalid user info: missing colon separator`);let s=r.substring(0,o),c=r.substring(o+1),l=a.lastIndexOf(`:`);if(l===-1)throw Error(`Invalid server info: missing port`);let u=a.substring(0,l),d=a.substring(l+1);if(!s||!c||!u||!d)throw Error(`Invalid format: missing required fields`);let f=`ss://${X(`${s}:${c}`)}@${u}:${d}`;return f+=`?type=tcp`,n&&(f+=n),f}catch{return e}}},$i=class extends Z{#e=``;#t=``;#n={};#r={};#i=``;#a=``;constructor(e){super(),this.#a=crypto.randomUUID(),this.setOriginConfig(e),this.setConfuseConfig()}setOriginConfig(e){let[t,n]=e.match(/ssr:\/\/(.*)/)||[];this.#e=e,this.#n=this.getOriginConfig(Y(n)),this.#i=this.#n.remarks??``}getOriginConfig(e){let[t,n,r,i,a,o]=e.split(`:`),s=new URL(e);return{server:t,port:n,protocol:r,method:i,obfs:a,password_base64:o.replace(s.search,``),remarks:qi(s.searchParams.get(`remarks`)?.replace(`-`,`+`)||``),params:s.search.replace(`?remarks=${s.searchParams.get(`remarks`)}`,``)}}updateOriginConfig(e){this.#n.remarks=e,this.#i=e,this.#e=`ssr://${X(`${this.#n.server}:${this.#n.port}:${this.#n.protocol}:${this.#n.method}:${this.#n.obfs}:${this.#n.password_base64}?remarks=${this.#n.remarks}${this.#n.params}`)}`,this.setConfuseConfig()}setConfuseConfig(){this.#r=structuredClone(this.#n),this.#r.server=this.getHostName(),this.#r.port=this.getPort(),this.#r.remarks=X(Q.setPs(this.#i,this.#a)),this.#t=`ssr://${X(`${this.#r.server}:${this.#r.port}:${this.#r.protocol}:${this.#r.method}:${this.#r.obfs}:${this.#r.password_base64}?remarks=${this.#r.remarks}${this.#r.params}`)}`}restoreClash(e,t){return e.name=t,e.server=this.originConfig.server??``,e.port=Number(this.originConfig?.port??0),e}restoreSingbox(e,t){return e.server=this.originConfig.server??``,e.server_port=Number(this.originConfig.port??0),e.tag=t,e.tls?.server_name&&(e.tls.server_name=this.originConfig.add??``),e}get originPs(){return this.#i}get originLink(){return this.#e}get originConfig(){return this.#n}get confusePs(){return this.#a}get confuseLink(){return this.#t}get confuseConfig(){return this.#r}},ea=class extends Z{#e=``;#t=``;#n={};#r={};#i=``;#a=``;constructor(e){super(),this.#a=crypto.randomUUID(),this.setOriginConfig(e),this.setConfuseConfig(e)}setOriginConfig(e){this.#e=e,this.#n=new URL(e),this.#i=Q.formatPs(this.#n.hash)??``}updateOriginConfig(e){this.#n.hash=Q.formatPs(e),this.#i=Q.formatPs(e),this.#e=this.#n.href,this.setConfuseConfig(this.#e)}setConfuseConfig(e){this.#r=new URL(e),this.#r.username=this.getUsername(),this.#r.host=this.getHost(),this.#r.hostname=this.getHostName(),this.#r.port=this.getPort(),this.#r.hash=Q.setPs(this.#i,this.#a),this.#t=this.#r.href}restoreClash(e,t){return e.name=t,e.server=this.originConfig.hostname??``,e.port=Number(this.originConfig.port??0),e.password=this.originConfig?.username??``,e.alpn=e.alpn?e.alpn.map(e=>decodeURIComponent(e)):e.alpn,e}restoreSingbox(e,t){return e.password=this.originConfig?.username??``,e.server=this.originConfig.hostname??``,e.server_port=Number(this.originConfig.port??0),e.tag=t,e.tls?.server_name&&(e.tls.server_name=this.originConfig.hostname??``),e.tls?.alpn&&(e.tls.alpn=e.tls.alpn.map(e=>decodeURIComponent(e))),e}get originPs(){return this.#i}get originLink(){return this.#e}get originConfig(){return this.#n}get confusePs(){return encodeURIComponent(this.#a)}get confuseLink(){return this.#t}get confuseConfig(){return this.#r}},ta=class extends Z{#e=``;#t=``;#n={};#r={};#i=``;#a=``;constructor(e){super(),this.#a=crypto.randomUUID(),this.setOriginConfig(e),this.setConfuseConfig(e)}setOriginConfig(e){this.#e=e,this.#n=new URL(e),this.#i=Q.formatPs(this.#n.hash)??``}updateOriginConfig(e){this.#n.hash=Q.formatPs(e),this.#i=Q.formatPs(e),this.#e=this.#n.href,this.setConfuseConfig(this.#e)}setConfuseConfig(e){this.#r=new URL(e),this.#r.username=this.getUsername(),this.#r.host=this.getHost(),this.#r.hostname=this.getHostName(),this.#r.port=this.getPort(),this.#r.hash=Q.setPs(this.#i,this.#a),this.#t=this.#r.href}#o(e){return q(e,`Host`)?{...e,Host:e.Host||this.originConfig.add||``}:e}#s(e){e.network===`ws`&&(e[`ws-opts`]={...e[`ws-opts`],headers:this.#o(e[`ws-opts`].headers),path:decodeURIComponent(this.originConfig.searchParams?.get(`path`)??`/`)})}restoreClash(e,t){return this.#s(e),e.name=t,e.server=this.originConfig.hostname??``,e.port=Number(this.originConfig?.port??0),e.uuid=this.originConfig.username??``,e.alpn=e.alpn?e.alpn?.map(e=>decodeURIComponent(decodeURIComponent(e))):e.alpn,e}restoreSingbox(e,t){return e.tag=t,e.server=this.originConfig.hostname??``,e.server_port=Number(this.originConfig.port??0),e.uuid=this.originConfig.username??``,e.tls?.server_name&&(e.tls.server_name=this.originConfig.hostname??``),e.tls?.alpn&&(e.tls.alpn=e.tls.alpn.map(e=>decodeURIComponent(decodeURIComponent(e)))),e}get originPs(){return this.#i}get originLink(){return this.#e}get originConfig(){return this.#n}get confusePs(){return this.#a}get confuseLink(){return this.#t}get confuseConfig(){return this.#r}},na=class extends Z{#e=``;#t=``;#n={};#r={};#i=``;#a=``;constructor(e){super(),this.#a=crypto.randomUUID(),this.setOriginConfig(e),this.setConfuseConfig()}setOriginConfig(e){let[t,n]=e.match(/vmess:\/\/(.*)/)||[];this.#e=e,this.#n=JSON.parse(Y(n)),this.#i=this.#n.ps??``}updateOriginConfig(e){this.#n.ps=e,this.#i=e,this.#e=`vmess://${X(JSON.stringify(this.#n))}`,this.setConfuseConfig()}setConfuseConfig(){this.#r=structuredClone(this.#n),this.#r.add=this.getHostName(),this.#r.port=this.getPort(),this.#r.id=this.getPassword(),this.#r.ps=Q.setPs(this.#i,this.#a),this.#t=`vmess://${X(JSON.stringify(this.#r))}`}#o(e){return q(e,`Host`)?{...e,Host:e.Host||this.originConfig.add||``}:e}#s(e){e.network===`ws`&&(e[`ws-opts`]={...e[`ws-opts`],headers:this.#o(e[`ws-opts`].headers),path:this.originConfig.path})}restoreClash(e,t){return this.#s(e),e.name=t,e.server=this.originConfig.add??``,e.port=Number(this.originConfig?.port??0),e.uuid=this.originConfig?.id??``,q(e,`servername`)&&(e.servername=this.originConfig.add??``),e}restoreSingbox(e,t){return e.server=this.originConfig.add??``,e.server_port=Number(this.originConfig.port??0),e.tag=t,e.tls?.server_name&&(e.tls.server_name=this.originConfig.add??``),e.uuid=this.originConfig?.id??``,e}get originPs(){return this.#i}get originLink(){return this.#e}get originConfig(){return this.#n}get confusePs(){return this.#a}get confuseLink(){return this.#t}get confuseConfig(){return this.#r}};function ra(e){let t=e.password||e.auth||e.auth_str;if(!e||!e.server||!e.port||!t)throw Error(`Hysteria configuration object must contain server, port, and authentication (password, auth, or auth_str).`);let n=e.server,r=e.port,i=e.name||``,a=new URLSearchParams;a.append(`auth`,t),e.peerCA&&a.append(`peerCA`,X(e.peerCA).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=/g,``)),(e.insecure||e[`skip-cert-verify`])&&a.append(`insecure`,`1`),e.alpn&&(typeof e.alpn==`string`||Array.isArray(e.alpn))&&a.append(`alpn`,Array.isArray(e.alpn)?e.alpn.join(`,`):e.alpn),e.upmbps!==void 0&&e.upmbps!==null&&a.append(`upmbps`,e.upmbps.toString()),e.downmbps!==void 0&&e.downmbps!==null&&a.append(`downmbps`,e.downmbps.toString()),e.obfs&&a.append(`obfs`,e.obfs),e[`obfs-param`]&&a.append(`obfs-param`,e[`obfs-param`]),q(e,`up`)&&a.append(`up`,e.up),q(e,`down`)&&a.append(`down`,e.down),q(e,`delay`)&&a.append(`delay`,e.delay),q(e,`sni`)&&a.append(`sni`,e.sni);let o=a.toString(),s=encodeURIComponent(n),c=encodeURIComponent(i),l=`hysteria://${s}:${r}`;return o&&(l+=`?${o}`),i&&(l+=`#${c}`),l}function ia(e){if(!e||!e.server||!e.port||!e.password)throw Error(`Hysteria2 configuration object must contain server, port, and password.`);let t=e.server,n=e.port,r=e.password,i=e.name||``,a=new URLSearchParams;a.append(`password`,r);let o=e.sni||e.servername||e.server;o&&a.append(`sni`,o),(e.insecure||e[`skip-cert-verify`])&&a.append(`insecure`,`1`),e.alpn&&(typeof e.alpn==`string`||Array.isArray(e.alpn))&&a.append(`alpn`,Array.isArray(e.alpn)?e.alpn.join(`,`):e.alpn),e.obfs&&a.append(`obfs`,e.obfs),e[`obfs-param`]&&a.append(`obfs-param`,e[`obfs-param`]),e[`obfs-password`]&&a.append(`obfs-password`,e[`obfs-password`]);let s=a.toString(),c=encodeURIComponent(t),l=encodeURIComponent(i),u=`hysteria2://${c}:${n}`;return s&&(u+=`?${s}`),i&&(u+=`#${l}`),u}function aa(e){if(!e||!e.server||!e.port||!e.cipher||!e.password)throw Error(`Shadowsocks configuration object must contain server, port, cipher, and password.`);let t=e.cipher,n=e.password,r=e.server,i=e.port,a=e.name||``,o=X(`${t}:${n}`),s=new URLSearchParams,c=e.network||`tcp`;if((c!==`tcp`||e.network)&&s.append(`type`,c),e.tls){s.append(`security`,`tls`);let t=e.sni||e.servername||e.server;t&&s.append(`sni`,t),e[`client-fingerprint`]&&s.append(`fp`,e[`client-fingerprint`]),e[`skip-cert-verify`]&&s.append(`allowInsecure`,`1`)}switch(c){case`ws`:case`http`:{let t=e[`ws-opts`]||e[`http-opts`]||{},n;n=t.headers&&t.headers.Host?t.headers.Host:e.sni||e.servername?e.sni||e.servername:e.server,n&&s.append(`host`,n);let r=t.path||`/`;r!==`/`&&s.append(`path`,r);break}case`grpc`:{let t=e[`grpc-opts`]||{};t.serviceName&&s.append(`serviceName`,t.serviceName);break}}e.tfo&&s.append(`tfo`,`1`),e.udp&&s.append(`udp`,`1`);let l=`ss://${o}@${encodeURIComponent(r)}:${i}`,u=s.toString();return u&&(l+=`?${u}`),a&&(l+=`#${encodeURIComponent(a)}`),l}function oa(e){return X(e).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=/g,``)}function sa(e){if(!e||!e.server||!e.port||!e.protocol||!e.method||!e.obfs||!e.password)throw Error(`ShadowsocksR configuration object must contain server, port, protocol, method, obfs, and password.`);let t=e.server,n=e.port,r=e.protocol,i=e.method||e.cipher,a=e.obfs,o=e.password,s=e[`obfs-param`]||``,c=e[`protocol-param`]||``,l=e.name||``,u=`${t}:${n}:${r}:${i}:${a}:${oa(o)}/`,d=new URLSearchParams;if(s){let e=oa(s);d.append(`obfsparam`,e)}if(c){let e=oa(c);d.append(`protoparam`,e)}let f=d.toString();f&&(u+=`?${f}`);let p=oa(u),m=encodeURIComponent(l),h=`ssr://${p}`;return l&&(h+=`#${m}`),h}function ca(e){if(!e||!e.server||!e.port||!e.password)throw Error(`Trojan configuration object must contain server, port, and password.`);let t=e.password,n=e.server,r=e.port,i=e.name||``,a=new URLSearchParams,o=e.sni||e.servername||e.server;o&&a.append(`sni`,o),e[`skip-cert-verify`]&&a.append(`allowInsecure`,`1`);let s=e.network||`tcp`;switch(a.append(`type`,s),s){case`ws`:case`http`:{let t=e[`ws-opts`]||e[`http-opts`]||{},n;n=t.headers&&t.headers.Host?t.headers.Host:e.sni||e.servername?e.sni||e.servername:e.server,n&&a.append(`host`,n);let r=t.path||`/`;r!==`/`&&a.append(`path`,r);break}case`grpc`:{let t=e[`grpc-opts`]||{};t.serviceName&&a.append(`serviceName`,t.serviceName);break}}e.flow&&a.append(`flow`,e.flow),e.tfo&&a.append(`tfo`,`1`),e.udp&&a.append(`udp`,`1`),e[`client-fingerprint`]&&a.append(`fp`,e[`client-fingerprint`]);let c=`trojan://${encodeURIComponent(t)}@${encodeURIComponent(n)}:${r}`,l=a.toString();return l&&(c+=`?${l}`),i&&(c+=`#${encodeURIComponent(i)}`),c}function la(e){if(e.type!==`vless`)throw Error(`Configuration type must be "vless"`);if(!e.uuid||!e.server||!e.port)throw Error(`Missing required fields: uuid, server, or port`);let t=e.uuid,n=e.server,r=e.port,i=`#${encodeURIComponent(e.name||`vless-node`)}`,a=new URLSearchParams,o=e.network||`tcp`,s=`none`;if(e.security===`reality`||e[`reality-opts`]?s=`reality`:(e.security===`tls`||e.tls===!0)&&(s=`tls`),(o!==`tcp`||o===`tcp`&&e[`tcp-opts`]?.header?.type&&e[`tcp-opts`].header.type!==`none`)&&a.set(`type`,o),s===`tls`){a.set(`security`,`tls`),e.servername&&a.set(`sni`,e.servername),Array.isArray(e.alpn)&&e.alpn.length>0&&a.set(`alpn`,encodeURIComponent(e.alpn.join(`,`)));let t=e[`client-fingerprint`]||e.fingerprint;t&&a.set(`fp`,encodeURIComponent(t)),e[`skip-cert-verify`]===!0&&a.set(`allowInsecure`,`1`),e.flow&&a.set(`flow`,e.flow)}else if(s===`reality`){a.set(`security`,`reality`),e.servername&&a.set(`sni`,e.servername);let t=e[`reality-opts`]||{},n=t[`public-key`]||t.publicKey,r=t[`short-id`]||t.shortId;n&&a.set(`pbk`,encodeURIComponent(n)),r&&a.set(`sid`,encodeURIComponent(r));let i=e[`client-fingerprint`]||e.fingerprint;i&&a.set(`fp`,encodeURIComponent(i))}switch(o){case`tcp`:e[`tcp-opts`]?.header?.type&&e[`tcp-opts`].header.type!==`none`&&a.set(`headerType`,e[`tcp-opts`].header.type);break;case`ws`:e[`ws-opts`]&&(e[`ws-opts`].headers?.Host&&a.set(`host`,e[`ws-opts`].headers.Host),e[`ws-opts`].path&&a.set(`path`,encodeURIComponent(e[`ws-opts`].path)));break;case`grpc`:if(e[`grpc-opts`]){(e[`grpc-opts`][`grpc-mode`]||e[`grpc-opts`].mode)===`multi`&&a.set(`mode`,`multi`);let t=e[`grpc-opts`][`grpc-service-name`];t&&a.set(`serviceName`,encodeURIComponent(t))}break;case`quic`:s!==`tls`&&s!==`reality`&&(a.has(`security`)||a.set(`security`,`tls`)),e[`quic-opts`]&&(e[`quic-opts`].security&&e[`quic-opts`].security!==`none`&&a.set(`quicSecurity`,encodeURIComponent(e[`quic-opts`].security)),e[`quic-opts`].key&&a.set(`key`,encodeURIComponent(e[`quic-opts`].key)),e[`quic-opts`].header?.type&&e[`quic-opts`].header.type!==`none`&&a.set(`headerType`,e[`quic-opts`].header.type));break;case`httpupgrade`:e[`httpupgrade-opts`]&&(e[`httpupgrade-opts`].host&&a.set(`host`,e[`httpupgrade-opts`].host),e[`httpupgrade-opts`].path&&a.set(`path`,encodeURIComponent(e[`httpupgrade-opts`].path)));break;case`h2`:if(s!==`tls`&&s!==`reality`&&(a.has(`security`)||a.set(`security`,`tls`)),e[`h2-opts`]){let t=e[`h2-opts`].host;Array.isArray(t)&&t.length>0?a.set(`host`,encodeURIComponent(t.join(`,`))):typeof t==`string`&&a.set(`host`,encodeURIComponent(t)),e[`h2-opts`].path&&a.set(`path`,encodeURIComponent(e[`h2-opts`].path))}break;default:console.warn(`Unsupported network type for URL generation: ${o}`)}e.tfo===!0&&a.set(`tfo`,`1`);let c=a.toString();return`vless://${t}@${n}:${r}${c?`?${c}`:``}${i}`}function ua(e){if(!e||!e.server||!e.port||!e.uuid)throw Error(`Vmess configuration object must contain server, port, and uuid.`);let t={v:`2`,ps:e.name||``,add:e.server,port:e.port,id:e.uuid,aid:e.alterId||0,scy:e.cipher||`auto`,net:e.network||`tcp`};switch(e.tls?(t.tls=`tls`,t.sni=e.servername||e.server,e[`client-fingerprint`]&&(t.fp=e[`client-fingerprint`])):t.tls=``,t.net){case`ws`:case`http`:{let n=e[`ws-opts`]||e[`http-opts`]||{};n.headers&&n.headers.Host?t.host=n.headers.Host:t.sni?t.host=t.sni:t.host=t.add,t.path=n.path||`/`,t.net===`http`&&!e.tls?t.type=`http`:t.net===`ws`&&!e.tls&&(t.type=`ws`);break}case`tcp`:e.tls||(t.type=`none`);break;case`grpc`:e[`grpc-opts`]&&e[`grpc-opts`].serviceName&&(t.serviceName=e[`grpc-opts`].serviceName),t.type=`grpc`;break}return(t.type===`none`||t.net===t.type&&!e.tls)&&delete t.type,t.tfo=e.tfo?`1`:`0`,t.udp=e.udp?`1`:`0`,`vmess://${X(JSON.stringify(t))}`}function da(e){let t=[];for(let n of e)try{n.type===`vmess`&&t.push(ua(n)),n.type===`trojan`&&t.push(ca(n)),n.type===`vless`&&t.push(la(n)),n.type===`ss`&&t.push(aa(n)),n.type===`ssr`&&t.push(sa(n)),(n.type===`hysteria2`||n.type===`hy2`)&&t.push(ia(n)),n.type===`hysteria`&&t.push(ra(n))}catch{continue}return t}var fa=class extends Xi{urlSet=new Set;vpsStore=new Map;originUrls=new Set;vps=[];includeProtocol=[];constructor(e,t=[],n=``){super(t),this.vps=e,this.includeProtocol=n?JSON.parse(n):[]}async parse(e=this.vps){for await(let t of e)try{let e=this.updateVpsPs(t);if(e){let t=null;e.startsWith(`vless://`)&&this.hasProtocol(`vless`)?t=new ta(e):e.startsWith(`vmess://`)&&this.hasProtocol(`vmess`)?t=new na(e):e.startsWith(`trojan://`)&&this.hasProtocol(`trojan`)?t=new ea(e):e.startsWith(`ss://`)&&this.hasProtocol(`shadowsocks`)?t=new Qi(e):e.startsWith(`ssr://`)&&this.hasProtocol(`shadowsocksr`)?t=new $i(e):this.isHysteria2(e)&&this.hasProtocol(`hysteria`,`hysteria2`,`hy2`)&&(t=new Zi(e)),t&&this.setStore(e,t)}if(t.startsWith(`https://`)||t.startsWith(`http://`)){let e=await Ki(t,{retries:3}).then(async e=>e.data.text()),{subType:n,content:r}=this.getSubType(e);if(n===`base64`&&r&&(this.updateExist(Array.from(this.originUrls)),await this.parse(r.split(`
`).filter(Boolean))),n===`yaml`&&r){let e=r.proxies;if(e.length){this.updateExist(Array.from(this.originUrls));let t=da(e);await this.parse(t.filter(Boolean))}}}}catch{continue}}setStore(e,t){this.urlSet.add(t.confuseLink),this.originUrls.add(e),this.vpsStore.set(t.confusePs,t)}getSubType(e){try{return{subType:`base64`,content:Y(e)}}catch{try{return{subType:`yaml`,content:Li(e)}}catch{try{let t=JSON.parse(e);return{subType:`json`,content:JSON.stringify(t)}}catch{return{subType:`unknown`,content:e}}}}}isHysteria2(e){return e.startsWith(`hysteria2://`)||e.startsWith(`hysteria://`)||e.startsWith(`hy2://`)}hasProtocol(...e){return this.includeProtocol.length===0||e.some(e=>this.includeProtocol.includes(e))}get urls(){return Array.from(this.urlSet)}get vpsMap(){return this.vpsStore}get originVps(){return Array.from(this.originUrls)}},pa=class{async getConfig(e){try{let t=(await Promise.all(e.map(e=>Ki(e,{retries:3}).then(e=>e.data.text())))).map(e=>Li(e));return this.mergeClashConfig(t)}catch(e){throw Error(`Failed to get clash config: ${e.message||e}`)}}isSameProxies(e,t){if(e.length!==t.length)return!1;let n=new Set(e);return t.every(e=>n.has(e))}mergeGroupProxies(e,t){let n=new Set(e),r=[...e];for(let e of t)n.has(e)||(n.add(e),r.push(e));return r}mergeClashConfig(e=[]){try{if(!e.length)return{};if(e.length===1)return e[0];let t=[];for(let n of e)n.proxies?.length&&t.push(...n.proxies);let n=new Map,r=[];for(let t of e)if(t[`proxy-groups`]?.length)for(let e of t[`proxy-groups`]){let t=n.get(e.name);if(!t)n.set(e.name,{...e,proxies:[...e.proxies||[]]}),r.push(e.name);else{let n=t.proxies||[],r=e.proxies||[];this.isSameProxies(n,r)||(t.proxies=this.mergeGroupProxies(n,r))}}return{...e[0],proxies:t,"proxy-groups":r.map(e=>n.get(e))}}catch(e){throw Error(`Failed to merge clash config: ${e.message||e}`)}}},ma=class{async getConfig(e){try{let t=(await Promise.all(e.map(e=>Ki(e,{retries:3}).then(e=>e.data.text())))).filter(e=>Bi(e)).map(e=>JSON.parse(e));return this.mergeConfig(t)}catch(e){throw Error(`Failed to get singbox config: ${e.message||e}`)}}mergeConfig(e){try{if(e.length===0)return{};let t=structuredClone(e[0]),n=[],r=new Set,i=new Map;for(let t of e)if(t.outbounds?.length){for(let e of t.outbounds)if(e.outbounds){let t=`${e.type}:${e.tag}`;if(!i.has(t)){let n=new Set(e.outbounds.filter(e=>!Q.isConfigType(e)));i.set(t,{base:e,baseOutbounds:n,linkOutbounds:new Set})}e.outbounds.forEach(e=>{Q.isConfigType(e)&&i.get(t)?.linkOutbounds.add(e)})}}for(let t of e)if(t.outbounds?.length){for(let e of t.outbounds)if(!e.outbounds)if(Q.isConfigType(e.tag))n.push(e);else{let t=`${e.type}:${e.tag}`;r.has(t)||(r.add(t),n.push(e))}}for(let[e,t]of i){let e={...t.base},r=new Set([...t.baseOutbounds,...t.linkOutbounds]);e.outbounds=Array.from(r),n.push(e)}return t.outbounds=n,t}catch(e){throw Error(`Failed to merge singbox config: ${e.message||e}`)}}},ha=class extends fa{async getConfig(e,t){try{return await this.parse(t),Ji(this.originVps.join(`
`))}catch(e){throw Error(`Failed to get v2ray config: ${e.message||e}`)}}},ga=class{urls=[];vps=[];chunkCount=Number(K.CHUNK_COUNT);backend=K.BACKEND;parser=null;clashClient=new pa;singboxClient=new ma;v2rayClient=new ha(this.vps);constructor(e){this.chunkCount=Number(e.CHUNK_COUNT??K.CHUNK_COUNT),this.backend=e.BACKEND??K.BACKEND,this.parser=null}async setSubUrls(e){let{searchParams:t}=new URL(e.url),n=t.get(`url`),r=t.get(`protocol`);this.backend=t.get(`backend`)??this.backend;let i=n.split(/\||\n/).filter(Boolean);this.parser=new fa(i,[],r),this.vps=i,await this.parser.parse(i);let a=zi(Array.from(this.parser.urls),Number(this.chunkCount));this.urls=a.map(t=>{let n=new URL(`${this.backend}/sub`),{searchParams:r}=new URL(e.url);return r.set(`url`,t),n.search=r.toString(),n.toString()})}async getClashConfig(){return await this.clashClient.getConfig(this.urls)}async getSingboxConfig(){return await this.singboxClient.getConfig(this.urls)}async getV2RayConfig(){return await this.v2rayClient.getConfig(this.urls,this.vps)}get vpsStore(){return this.parser?.vpsMap}},_a=class{confuseConfig;constructor(e){this.confuseConfig=e}getOriginConfig(e){try{return this.confuseConfig.proxies=this.restoreProxies(this.confuseConfig.proxies,e),this.confuseConfig[`proxy-groups`]=this.confuseConfig?.[`proxy-groups`]?.map(e=>(e.proxies&&=this.updateProxiesGroups(e.proxies),e)),this.confuseConfig}catch(e){throw Error(`Get origin config failed: ${e.message||e}, function trace: ${e.stack}`)}}restoreProxies(e,t){let n=[];if(!e)return n;for(let r of e)try{let[e,i]=Q.getPs(r.name);t.has(i)&&(t.get(i)?.restoreClash(r,e),n.push(r))}catch(e){console.warn(`Restore proxies failed: ${e.message||e}, function trace: ${e.stack}`);continue}return n}updateProxiesGroups(e){try{return e.map(e=>{let[t]=Q.getPs(e);return t})}catch(e){throw Error(`Update proxies groups failed: ${e.message||e}, function trace: ${e.stack}`)}}},va=class{confuseConfig;constructor(e){this.confuseConfig=e}getOriginConfig(e){try{return this.confuseConfig.outbounds=this.restoreOutbounds(this.confuseConfig.outbounds,e),this.confuseConfig}catch(e){throw Error(`Get origin config failed: ${e.message||e}, function trace: ${e.stack}`)}}restoreOutbounds(e=[],t){let n=[];if(!e)return n;for(let r of e)try{if(this.isConfuseVps(r.tag)){let[e,n]=Q.getPs(r.tag);t.get(n)?.restoreSingbox(r,e)}Reflect.has(r,`outbounds`)&&(r.outbounds=this.updateOutbouns(r.outbounds)),n.push(r)}catch(e){console.warn(`Restore outbounds failed: ${e.message||e}, function trace: ${e.stack}`);continue}return n}updateOutbouns(e=[]){try{return e.map(e=>{if(this.isConfuseVps(e)){let[t]=Q.getPs(e);return t}return e})}catch(e){throw Error(`Update outbounds failed: ${e.message||e}, function trace: ${e.stack}`)}}isConfuseVps(e){return Q.isConfigType(e)}},ya=class{confuseConfig;constructor(e){this.confuseConfig=e}getOriginConfig(){try{return this.confuseConfig}catch(e){throw Error(`Get origin config failed: ${e.message||e}, function trace: ${e.stack}`)}}},ba=class{constructor(e){this.confuse=e,this.confuse=e}async getClashConfig(){return new _a(await this.confuse.getClashConfig()).getOriginConfig(this.confuse.vpsStore)}async getSingboxConfig(){return new va(await this.confuse.getSingboxConfig()).getOriginConfig(this.confuse.vpsStore)}async getV2RayConfig(){return new ya(await this.confuse.getV2RayConfig()).getOriginConfig()}},xa=class{constructor(e){this.repo=e}async toSub(e,t,n){let r=new ga(t);await r.setSubUrls(e);let i=new ba(r);if([`clash`,`clashr`].includes(n))return{body:Ri(await i.getClashConfig(),{indent:2,lineWidth:200}),contentType:`text/yaml; charset=UTF-8`};if(n===`singbox`){let e=await i.getSingboxConfig();return{body:JSON.stringify(e),contentType:`text/plain; charset=UTF-8`}}if(n===`v2ray`)return{body:await i.getV2RayConfig(),contentType:`text/plain; charset=UTF-8`};throw Error(`Unsupported client type, support list: clash, singbox, v2ray`)}getVersionRedirect(e,t){let{searchParams:n}=new URL(e.url);return`${n.get(`backend`)??t.BACKEND??K.BACKEND}/version`}async add(e,t){return this.ensureRepo(),this.repo.add(e,t)}async deleteByCode(e){return this.ensureRepo(),this.repo.deleteByCode(e)}async getByCode(e){return this.ensureRepo(),this.repo.getByCode(e)}async getList(e=1,t=10){return this.ensureRepo(),this.repo.getList(e,t)}ensureRepo(){if(!this.repo)throw Error(`Short URL service is not enabled (no repository configured)`)}};const $=new ze;function Sa(e){let n=e.get(`repo`);if(!n)throw new t(503,{message:`Short URL service is not enabled`});return new St(new xa(n))}$.post(`/api/add`,e=>Sa(e).add(e)),$.delete(`/api/delete`,e=>Sa(e).delete(e)),$.get(`/api/queryByCode`,e=>Sa(e).queryByCode(e)),$.get(`/api/queryList`,e=>Sa(e).queryList(e)),$.get(`/:code`,e=>Sa(e).redirect(e));const Ca=new ze;Ca.get(`/sub`,e=>new St(new xa(e.get(`repo`))).toSub(e)),Ca.get(`/version`,e=>new St(new xa(e.get(`repo`))).getVersion(e));function wa(e){e.route(`/`,xt),e.route(`/`,Ca),e.route(`/`,$)}function Ta(e){let t=new ze;return t.use(`*`,Xe()),t.use(`*`,Ve()),t.use(`*`,Ze(e.repo)),t.onError(He),t.notFound(e=>e.json({error:`Not Found`},404)),wa(t),t}function Ea(){return crypto.randomUUID().substring(0,8)}var Da=class{constructor(e){this.db=e}async add(e,t){let n=Ea(),r=`${t}/${n}`,i=await this.db.prepare(`INSERT INTO short_url (short_code, short_url, long_url) VALUES (?, ?, ?) RETURNING id`).bind(n,r,e).first();if(!i?.id)throw Error(`Failed to create short URL`);return{id:i.id,short_code:n,short_url:r,long_url:e}}async deleteByCode(e){await this.db.prepare(`DELETE FROM short_url WHERE short_code = ?`).bind(e).run()}async getByCode(e){return await this.db.prepare(`SELECT id, short_code, short_url, long_url FROM short_url WHERE short_code = ?`).bind(e).first()}async getList(e,t){let n=(e-1)*t,[r,i]=await Promise.all([this.db.prepare(`SELECT COUNT(*) as count FROM short_url`).first(),this.db.prepare(`SELECT id, short_code, short_url, long_url FROM short_url LIMIT ? OFFSET ?`).bind(t,n).all()]);return{total:r?.count||0,items:i?.results||[]}}};function Oa(e){return e?new Da(e):null}var ka={fetch(e,t,n){let r=Oa(t.DB),i=Ta({repo:r}),a={...t,SHORT_URL_ENABLED:r!==null};return i.fetch(e,a,n)}};export{ka as default};