var Rn=Object.defineProperty;var Sn=(r,e,n)=>e in r?Rn(r,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):r[e]=n;var M=(r,e,n)=>Sn(r,typeof e!="symbol"?e+"":e,n);import"./modulepreload-polyfill-B5Qt9EMX.js";class Z extends Error{constructor(e,n){super(`${e} (line ${n})`),this.line=n,this.name="BrainrotError"}}class dn extends Z{constructor(e,n){super(e,n),this.name="LexError"}}class rn extends Z{constructor(e,n){super(e,n),this.name="ParseError"}}class h extends Z{constructor(e,n){super(e,n),this.name="RuntimeError"}}class In extends Z{constructor(e,n){super(e,n),this.name="StepBudgetError"}}var i=(r=>(r.NUMBER="NUMBER",r.STRING="STRING",r.IDENTIFIER="IDENTIFIER",r.COOK="COOK",r.BE="BE",r.SIGMA="SIGMA",r.YEET="YEET",r.LOWKEY="LOWKEY",r.CAUGHT="CAUGHT",r.SUS="SUS",r.MID="MID",r.NAH="NAH",r.GRIND="GRIND",r.DIP="DIP",r.SKIP="SKIP",r.NOCAP="NOCAP",r.CAP="CAP",r.GHOST="GHOST",r.AND="AND",r.OR="OR",r.NOT="NOT",r.IS="IS",r.AINT="AINT",r.FINNA="FINNA",r.FROM="FROM",r.TO="TO",r.BY="BY",r.VIBIN="VIBIN",r.IN="IN",r.LEFT_PAREN="LEFT_PAREN",r.RIGHT_PAREN="RIGHT_PAREN",r.LEFT_BRACE="LEFT_BRACE",r.RIGHT_BRACE="RIGHT_BRACE",r.LEFT_BRACKET="LEFT_BRACKET",r.RIGHT_BRACKET="RIGHT_BRACKET",r.COMMA="COMMA",r.DOT="DOT",r.COLON="COLON",r.PLUS="PLUS",r.MINUS="MINUS",r.STAR="STAR",r.SLASH="SLASH",r.PERCENT="PERCENT",r.LESS="LESS",r.LESS_EQUAL="LESS_EQUAL",r.GREATER="GREATER",r.GREATER_EQUAL="GREATER_EQUAL",r.EQUAL_EQUAL="EQUAL_EQUAL",r.BANG_EQUAL="BANG_EQUAL",r.PLUS_EQUAL="PLUS_EQUAL",r.MINUS_EQUAL="MINUS_EQUAL",r.STAR_EQUAL="STAR_EQUAL",r.SLASH_EQUAL="SLASH_EQUAL",r.PERCENT_EQUAL="PERCENT_EQUAL",r.EOF="EOF",r))(i||{});const Nn={cook:"COOK",be:"BE",sigma:"SIGMA",yeet:"YEET",lowkey:"LOWKEY",caught:"CAUGHT",sus:"SUS",mid:"MID",nah:"NAH",grind:"GRIND",dip:"DIP",skip:"SKIP",nocap:"NOCAP",cap:"CAP",ghost:"GHOST",and:"AND",or:"OR",not:"NOT",is:"IS",aint:"AINT",finna:"FINNA",from:"FROM",to:"TO",by:"BY",vibin:"VIBIN",in:"IN"};class x{constructor(){M(this,"entries",new Map)}}function gn(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)&&!(r instanceof x)&&(r.kind==="sigma"||r.kind==="builtin")}class B{constructor(e=null){M(this,"values",new Map);this.parent=e}define(e,n){this.values.set(e,n)}get(e){if(this.values.has(e.lexeme))return this.values.get(e.lexeme);if(this.parent)return this.parent.get(e);throw new h(`yo '${e.lexeme}' ain't been cooked yet fr`,e.line)}tryGet(e){if(this.values.has(e))return this.values.get(e);if(this.parent)return this.parent.tryGet(e)}assign(e,n){if(this.values.has(e.lexeme)){this.values.set(e.lexeme,n);return}if(this.parent){this.parent.assign(e,n);return}throw new h(`yo '${e.lexeme}' ain't been cooked yet fr, cook it first`,e.line)}}class hn{constructor(e){this.value=e}}class W{constructor(e){this.line=e}}class V{constructor(e){this.line=e}}function $(r){return r===null?"ghost":r===!0?"nocap":r===!1?"cap":typeof r=="number"?String(r):typeof r=="string"?r:Array.isArray(r)?`[${r.map(En).join(", ")}]`:r instanceof x?`{${[...r.entries].map(([n,t])=>`${n}: ${En(t)}`).join(", ")}}`:r.kind==="sigma"?`<sigma ${r.name}>`:`<builtin ${r.name}>`}function En(r){return typeof r=="string"?`"${r}"`:$(r)}class Ln{constructor(e){M(this,"globals",new B);M(this,"steps",0);M(this,"maxSteps");M(this,"onOutput");M(this,"onInput");this.onOutput=e.onOutput,this.onInput=e.onInput??null,this.maxSteps=e.maxSteps??1/0}print(e){this.onOutput(e)}resetSteps(){this.steps=0}interpret(e){try{for(const n of e)this.execute(n,this.globals)}catch(n){throw n instanceof W?new h("can't dip outside a loop bro",n.line):n instanceof V?new h("can't skip outside a loop bro",n.line):n instanceof hn?new h("can't yeet outside a sigma bro",0):n}}tick(e){if(++this.steps>this.maxSteps)throw new In("this code been running way too long, go touch grass",e)}execute(e,n){switch(e.kind){case"varDecl":{this.tick(e.name.line),n.define(e.name.lexeme,this.evaluate(e.initializer,n));return}case"assign":{this.tick(e.name.line),n.assign(e.name,this.evaluate(e.value,n));return}case"indexAssign":{this.tick(e.bracket.line);const t=this.evaluate(e.object,n),a=this.evaluate(e.index,n);if(Array.isArray(t)){t[this.checkIndex(t,a,e.bracket.line)]=this.evaluate(e.value,n);return}if(t instanceof x){if(typeof a!="string")throw new h("object keys gotta be strings, that ain't one",e.bracket.line);t.entries.set(a,this.evaluate(e.value,n));return}throw new h("you can only stuff values into an array or an object, that ain't either",e.bracket.line)}case"propAssign":{this.tick(e.name.line);const t=this.evaluate(e.object,n);if(!(t instanceof x))throw new h(`can't set '.${e.name.lexeme}' on ${g(t)}, that ain't an object`,e.name.line);t.entries.set(e.name.lexeme,this.evaluate(e.value,n));return}case"expr":{this.tick(0),this.evaluate(e.expr,n);return}case"funcDecl":{this.tick(e.name.line),n.define(e.name.lexeme,{kind:"sigma",name:e.name.lexeme,params:e.params,body:e.body,closure:n});return}case"return":throw new hn(e.value?this.evaluate(e.value,n):null);case"if":{for(const t of this.branchesOf(e))if(t.cond===null||J(this.evaluate(t.cond,n))){this.executeBlock(t.body,new B(n));return}return}case"while":{for(;J(this.evaluate(e.cond,n));){this.tick(e.keyword.line);try{this.executeBlock(e.body,new B(n))}catch(t){if(t instanceof W)return;if(t instanceof V)continue;throw t}}return}case"forRange":{const t=e.keyword.line,a=this.requireNumber(this.evaluate(e.from,n),"from",t),s=this.requireNumber(this.evaluate(e.to,n),"to",t),u=e.by?this.requireNumber(this.evaluate(e.by,n),"by",t):a<=s?1:-1;if(u===0)throw new h("'by 0' goes nowhere, pick a real step",t);for(let f=a;u>0?f<=s:f>=s;f+=u){this.tick(t);const c=new B(n);c.define(e.varName.lexeme,f);try{this.executeBlock(e.body,c)}catch(y){if(y instanceof W)return;if(y instanceof V)continue;throw y}}return}case"forEach":{const t=e.keyword.line,a=this.evaluate(e.iterable,n);let s;if(Array.isArray(a))s=a.slice();else if(typeof a=="string")s=[...a];else if(a instanceof x)s=[...a.entries.keys()];else throw new h(`can't vibe through ${g(a)}, gimme an array, string, or object`,t);for(const u of s){this.tick(t);const f=new B(n);f.define(e.varName.lexeme,u);try{this.executeBlock(e.body,f)}catch(c){if(c instanceof W)return;if(c instanceof V)continue;throw c}}return}case"try":{try{this.executeBlock(e.body,new B(n))}catch(t){if(t instanceof h){const a=new B(n);a.define(e.errName.lexeme,t.message),this.executeBlock(e.handler,a);return}throw t}return}case"break":throw new W(e.keyword.line);case"continue":throw new V(e.keyword.line)}}requireNumber(e,n,t){if(typeof e!="number")throw new h(`'${n}' needs a number, not ${g(e)}`,t);return e}branchesOf(e){const n=[...e.branches];return e.elseBody&&n.push({cond:null,body:e.elseBody}),n}executeBlock(e,n){for(const t of e)this.execute(t,n)}evaluate(e,n){switch(e.kind){case"literal":return e.value;case"variable":return n.get(e.name);case"array":return e.elements.map(t=>this.evaluate(t,n));case"object":{const t=new x;for(const{key:a,value:s}of e.entries)t.entries.set(a,this.evaluate(s,n));return t}case"get":{const t=this.evaluate(e.object,n);if(!(t instanceof x))throw new h(`can't read '.${e.name.lexeme}' off ${g(t)}, that ain't an object`,e.name.line);return t.entries.get(e.name.lexeme)??null}case"lambda":return{kind:"sigma",name:"(lambda)",params:e.params,body:e.body,closure:n};case"unary":{const t=this.evaluate(e.right,n);if(e.op.type===i.NOT)return!J(t);if(typeof t!="number")throw new h(`can't negate ${g(t)}, that math ain't mathing`,e.op.line);return-t}case"logical":{const t=this.evaluate(e.left,n);return e.op.type===i.OR?J(t)?t:this.evaluate(e.right,n):J(t)?this.evaluate(e.right,n):t}case"binary":return this.binary(e.op,this.evaluate(e.left,n),this.evaluate(e.right,n));case"index":{const t=this.evaluate(e.object,n),a=this.evaluate(e.index,n);if(Array.isArray(t))return t[this.checkIndex(t,a,e.bracket.line)];if(typeof t=="string"){const s=[...t];return s[this.checkIndex(s,a,e.bracket.line)]}if(t instanceof x){if(typeof a!="string")throw new h("object keys gotta be strings, that ain't one",e.bracket.line);return t.entries.get(a)??null}throw new h(`can't index into ${g(t)}, that ain't a list bro`,e.bracket.line)}case"call":{const t=this.evaluate(e.callee,n),a=e.args.map(s=>this.evaluate(s,n));return this.call(t,a,e.paren.line)}}}call(e,n,t){if(!gn(e))throw new h(`${g(e)} ain't a function, you can't call that`,t);if(e.kind==="builtin"){if(e.arity!==null&&n.length!==e.arity)throw new h(`${e.name} wanted ${e.arity} args but got ${n.length}, do better`,t);return e.call(n,t)}if(n.length!==e.params.length)throw new h(`${e.name} wanted ${e.params.length} args but got ${n.length}, do better`,t);const a=new B(e.closure);e.params.forEach((s,u)=>a.define(s.lexeme,n[u]));try{this.executeBlock(e.body,a)}catch(s){if(s instanceof hn)return s.value;throw s}return null}callValue(e,n,t){return this.call(e,n,t)}checkIndex(e,n,t){if(typeof n!="number"||!Number.isInteger(n))throw new h(`index gotta be a whole number, not ${En(n)}`,t);if(n<0||n>=e.length)throw new h(`index ${n} is outta pocket, this only got ${e.length} things`,t);return n}binary(e,n,t){switch(e.type){case i.PLUS:{if(typeof n=="number"&&typeof t=="number")return n+t;if(typeof n=="string"||typeof t=="string")return $(n)+$(t);break}case i.MINUS:case i.STAR:case i.SLASH:case i.PERCENT:{if(typeof n=="number"&&typeof t=="number"){if(t===0&&(e.type===i.SLASH||e.type===i.PERCENT))throw new h("can't divide by zero, that's cap",e.line);return e.type===i.MINUS?n-t:e.type===i.STAR?n*t:e.type===i.SLASH?n/t:n%t}break}case i.LESS:case i.LESS_EQUAL:case i.GREATER:case i.GREATER_EQUAL:{if(typeof n=="number"&&typeof t=="number"||typeof n=="string"&&typeof t=="string")return e.type===i.LESS?n<t:e.type===i.LESS_EQUAL?n<=t:e.type===i.GREATER?n>t:n>=t;break}case i.EQUAL_EQUAL:case i.IS:return n===t;case i.BANG_EQUAL:case i.AINT:return n!==t}throw new h(`can't do ${g(n)} ${e.lexeme} ${g(t)}, that math ain't mathing`,e.line)}}function J(r){return r!==!1&&r!==null}function g(r){return r===null?"ghost":typeof r=="boolean"?"a boolean":typeof r=="number"?"a number":typeof r=="string"?"a string":Array.isArray(r)?"an array":r instanceof x?"an object":"a function"}function U(r,e,n){if(Array.isArray(r))return r;throw new h(`${e} wanted an array, not ${g(r)}`,n)}function O(r,e,n){if(typeof r=="string")return r;throw new h(`${e} wanted a string, not ${g(r)}`,n)}function A(r,e,n){if(typeof r=="number")return r;throw new h(`${e} wanted a number, not ${g(r)}`,n)}function bn(r,e,n){if(r instanceof x)return r;throw new h(`${e} wanted an object, not ${g(r)}`,n)}function _n(r){const e=[{kind:"builtin",name:"yap",arity:null,call:n=>(r.print(n.map($).join(" ")),null)},{kind:"builtin",name:"gimme",arity:null,call:(n,t)=>{if(n.length>1)throw new h("gimme takes at most 1 arg (the prompt)",t);if(!r.onInput)throw new h("gimme can't work here, ain't nobody around to answer",t);return r.onInput(n[0]===void 0?"":$(n[0]))}},{kind:"builtin",name:"count",arity:1,call:([n],t)=>{if(Array.isArray(n))return n.length;if(typeof n=="string")return[...n].length;if(n instanceof x)return n.entries.size;throw new h(`can't count ${g(n)}, gimme an array, string, or object`,t)}},{kind:"builtin",name:"push",arity:2,call:([n,t],a)=>(U(n,"push",a).push(t),n.length)},{kind:"builtin",name:"pop",arity:1,call:([n],t)=>{const a=U(n,"pop",t);if(a.length===0)throw new h("this array is empty, nothing left to pop",t);return a.pop()}},{kind:"builtin",name:"chop",arity:3,call:([n,t,a],s)=>{const u=A(t,"chop",s),f=A(a,"chop",s);if(Array.isArray(n))return n.slice(u,f);if(typeof n=="string")return[...n].slice(u,f).join("");throw new h(`chop wanted an array or string, not ${g(n)}`,s)}},{kind:"builtin",name:"where",arity:2,call:([n,t],a)=>{const s=U(n,"where",a).indexOf(t);return s===-1?null:s}},{kind:"builtin",name:"sort",arity:1,call:([n],t)=>{const a=U(n,"sort",t),s=a.every(f=>typeof f=="number"),u=a.every(f=>typeof f=="string");if(!s&&!u)throw new h("sort needs all numbers or all strings, this array is mixed up",t);return[...a].sort((f,c)=>s?f-c:String(f).localeCompare(String(c)))}},{kind:"builtin",name:"map",arity:2,call:([n,t],a)=>U(n,"map",a).map(s=>r.callValue(t,[s],a))},{kind:"builtin",name:"keep",arity:2,call:([n,t],a)=>U(n,"keep",a).filter(s=>{const u=r.callValue(t,[s],a);return u!==!1&&u!==null})},{kind:"builtin",name:"glue",arity:2,call:([n,t],a)=>U(n,"glue",a).map($).join(O(t,"glue",a))},{kind:"builtin",name:"rip",arity:2,call:([n,t],a)=>O(n,"rip",a).split(O(t,"rip",a))},{kind:"builtin",name:"screm",arity:1,call:([n],t)=>O(n,"screm",t).toUpperCase()},{kind:"builtin",name:"whisper",arity:1,call:([n],t)=>O(n,"whisper",t).toLowerCase()},{kind:"builtin",name:"trim",arity:1,call:([n],t)=>O(n,"trim",t).trim()},{kind:"builtin",name:"num",arity:1,call:([n])=>{if(typeof n=="number")return n;if(typeof n=="string"){const t=Number(n.trim());return n.trim()!==""&&!Number.isNaN(t)?t:null}return null}},{kind:"builtin",name:"str",arity:1,call:([n])=>$(n)},{kind:"builtin",name:"floor",arity:1,call:([n],t)=>Math.floor(A(n,"floor",t))},{kind:"builtin",name:"round",arity:1,call:([n],t)=>Math.round(A(n,"round",t))},{kind:"builtin",name:"abs",arity:1,call:([n],t)=>Math.abs(A(n,"abs",t))},{kind:"builtin",name:"sqrt",arity:1,call:([n],t)=>{const a=A(n,"sqrt",t);if(a<0)throw new h("sqrt of a negative? we don't do imaginary here",t);return Math.sqrt(a)}},{kind:"builtin",name:"pow",arity:2,call:([n,t],a)=>Math.pow(A(n,"pow",a),A(t,"pow",a))},{kind:"builtin",name:"rando",arity:null,call:(n,t)=>{if(n.length===0)return Math.random();if(n.length===2){const a=Math.ceil(A(n[0],"rando",t)),s=Math.floor(A(n[1],"rando",t));if(a>s)throw new h("rando range is backwards, flip it",t);return a+Math.floor(Math.random()*(s-a+1))}throw new h("rando takes 0 args (float 0-1) or 2 args (int range), not "+n.length,t)}},{kind:"builtin",name:"keys",arity:1,call:([n],t)=>[...bn(n,"keys",t).entries.keys()]},{kind:"builtin",name:"has",arity:2,call:([n,t],a)=>bn(n,"has",a).entries.has(O(t,"has",a))},{kind:"builtin",name:"unfollow",arity:2,call:([n,t],a)=>bn(n,"unfollow",a).entries.delete(O(t,"unfollow",a))},{kind:"builtin",name:"fold",arity:3,call:([n,t,a],s)=>{const u=U(n,"fold",s);let f=a;for(const c of u)f=r.callValue(t,[f,c],s);return f}},{kind:"builtin",name:"flip",arity:1,call:([n],t)=>[...U(n,"flip",t)].reverse()},{kind:"builtin",name:"sum",arity:1,call:([n],t)=>{const a=U(n,"sum",t);let s=0;for(const u of a)s+=A(u,"sum",t);return s}},{kind:"builtin",name:"contains",arity:2,call:([n,t],a)=>{if(Array.isArray(n))return n.includes(t);if(typeof n=="string")return n.includes(O(t,"contains",a));throw new h(`contains wanted an array or string, not ${g(n)}`,a)}},{kind:"builtin",name:"min",arity:2,call:([n,t],a)=>Math.min(A(n,"min",a),A(t,"min",a))},{kind:"builtin",name:"max",arity:2,call:([n,t],a)=>Math.max(A(n,"max",a),A(t,"max",a))},{kind:"builtin",name:"ceil",arity:1,call:([n],t)=>Math.ceil(A(n,"ceil",t))},{kind:"builtin",name:"clamp",arity:3,call:([n,t,a],s)=>{const u=A(n,"clamp",s),f=A(t,"clamp",s),c=A(a,"clamp",s);return Math.min(Math.max(u,f),c)}}];for(const n of e)r.globals.define(n.name,n)}function k(r,e,n){if(typeof r=="number")return r;throw new h(`${e} wanted a number, not ${g(r)}`,n)}function mn(r,e,n){if(typeof r=="string")return r;throw new h(`${e} wanted a string, not ${g(r)}`,n)}function xn(r,e){const n=[{kind:"builtin",name:"canvas",arity:2,call:([t,a],s)=>(e.canvas(k(t,"canvas",s),k(a,"canvas",s)),null)},{kind:"builtin",name:"background",arity:1,call:([t],a)=>(e.background(mn(t,"background",a)),null)},{kind:"builtin",name:"paint",arity:1,call:([t],a)=>(e.paint(mn(t,"paint",a)),null)},{kind:"builtin",name:"box",arity:4,call:([t,a,s,u],f)=>(e.box(k(t,"box",f),k(a,"box",f),k(s,"box",f),k(u,"box",f)),null)},{kind:"builtin",name:"dot",arity:3,call:([t,a,s],u)=>(e.dot(k(t,"dot",u),k(a,"dot",u),k(s,"dot",u)),null)},{kind:"builtin",name:"streak",arity:4,call:([t,a,s,u],f)=>(e.streak(k(t,"streak",f),k(a,"streak",f),k(s,"streak",f),k(u,"streak",f)),null)},{kind:"builtin",name:"words",arity:4,call:([t,a,s,u],f)=>(e.words($(t),k(a,"words",f),k(s,"words",f),k(u,"words",f)),null)},{kind:"builtin",name:"held",arity:1,call:([t],a)=>e.held(mn(t,"held",a))},{kind:"builtin",name:"mouseX",arity:0,call:()=>e.mouseX()},{kind:"builtin",name:"mouseY",arity:0,call:()=>e.mouseY()},{kind:"builtin",name:"frames",arity:0,call:()=>e.frames()},{kind:"builtin",name:"delta",arity:0,call:()=>e.delta()}];for(const t of n)r.globals.define(t.name,t)}const An={"(":i.LEFT_PAREN,")":i.RIGHT_PAREN,"{":i.LEFT_BRACE,"}":i.RIGHT_BRACE,"[":i.LEFT_BRACKET,"]":i.RIGHT_BRACKET,",":i.COMMA,".":i.DOT,":":i.COLON};function Cn(r){const e=[];let n=0,t=0,a=1;const s=()=>t>=r.length,u=()=>s()?"\0":r[t],f=()=>t+1>=r.length?"\0":r[t+1],c=()=>r[t++],y=b=>s()||r[t]!==b?!1:(t++,!0),l=(b,L=null)=>{e.push({type:b,lexeme:r.slice(n,t),literal:L,line:a})},N=b=>b>="0"&&b<="9",F=b=>b>="a"&&b<="z"||b>="A"&&b<="Z"||b==="_",Q=b=>F(b)||N(b);for(;!s();){n=t;const b=c();if(!(b===" "||b==="\r"||b==="	")){if(b===`
`){a++;continue}if(b in An){l(An[b]);continue}if(b==="+"){l(y("=")?i.PLUS_EQUAL:i.PLUS);continue}if(b==="-"){l(y("=")?i.MINUS_EQUAL:i.MINUS);continue}if(b==="*"){l(y("=")?i.STAR_EQUAL:i.STAR);continue}if(b==="/"){l(y("=")?i.SLASH_EQUAL:i.SLASH);continue}if(b==="%"){l(y("=")?i.PERCENT_EQUAL:i.PERCENT);continue}if(b==="<"){l(y("=")?i.LESS_EQUAL:i.LESS);continue}if(b===">"){l(y("=")?i.GREATER_EQUAL:i.GREATER);continue}if(b==="="&&y("=")){l(i.EQUAL_EQUAL);continue}if(b==="!"&&y("=")){l(i.BANG_EQUAL);continue}if(b==='"'){const L=a;let I="";for(;u()!=='"'&&!s();){const _=c();if(_===`
`)a++,I+=_;else if(_==="\\"){const C=s()?"":c();if(C==="n")I+=`
`;else if(C==="t")I+="	";else if(C==='"')I+='"';else if(C==="\\")I+="\\";else throw new dn(`'\\${C}' ain't a real escape, we got \\n \\t \\" \\\\`,a)}else I+=_}if(s())throw new dn(`bruh this string ain't closed 💀 put a " on it`,L);c(),l(i.STRING,I);continue}if(N(b)){for(;N(u());)c();if(u()==="."&&N(f()))for(c();N(u());)c();l(i.NUMBER,Number(r.slice(n,t)));continue}if(F(b)){for(;Q(u());)c();const L=r.slice(n,t);if(L==="btw"){for(;u()!==`
`&&!s();)c();continue}l(Nn[L]??i.IDENTIFIER);continue}throw new dn(`bruh what even is '${b}' 💀`,a)}}return e.push({type:i.EOF,lexeme:"",literal:null,line:a}),e}function Un(r){let e=0;const n=()=>r[e],t=()=>r[e+1]??r[r.length-1],a=()=>r[e-1],s=()=>n().type===i.EOF,u=o=>n().type===o,f=()=>(s()||e++,a()),c=(...o)=>o.some(u)?(f(),!0):!1,y=o=>o.type===i.EOF?"end of file":`'${o.lexeme}'`,l=(o,d)=>{if(u(o))return f();throw new rn(`expected ${d} but got ${y(n())}, that ain't it chief`,n().line)},N=()=>c(i.COOK)?F():u(i.SIGMA)&&t().type===i.IDENTIFIER?(f(),Q()):c(i.SUS)?b():c(i.GRIND)?L():c(i.FINNA)?I():c(i.VIBIN)?C():c(i.YEET)?nn():c(i.LOWKEY)?_():c(i.DIP)?{kind:"break",keyword:a()}:c(i.SKIP)?{kind:"continue",keyword:a()}:H(),F=()=>{const o=l(i.IDENTIFIER,"a variable name after 'cook'");return l(i.BE,"'be'"),{kind:"varDecl",name:o,initializer:w()}},Q=()=>{const o=l(i.IDENTIFIER,"a function name after 'sigma'");l(i.LEFT_PAREN,"'('");const d=[];if(!u(i.RIGHT_PAREN))do d.push(l(i.IDENTIFIER,"a parameter name"));while(c(i.COMMA));return l(i.RIGHT_PAREN,"')'"),{kind:"funcDecl",name:o,params:d,body:S()}},b=()=>{const o=[];l(i.LEFT_PAREN,"'(' after 'sus'");const d=w();for(l(i.RIGHT_PAREN,"')'"),o.push({cond:d,body:S()});c(i.MID);){l(i.LEFT_PAREN,"'(' after 'mid'");const D=w();l(i.RIGHT_PAREN,"')'"),o.push({cond:D,body:S()})}let E=null;return c(i.NAH)&&(E=S()),{kind:"if",branches:o,elseBody:E}},L=()=>{const o=a();l(i.LEFT_PAREN,"'(' after 'grind'");const d=w();return l(i.RIGHT_PAREN,"')'"),{kind:"while",cond:d,body:S(),keyword:o}},I=()=>{const o=a();l(i.LEFT_PAREN,"'(' after 'finna'");const d=l(i.IDENTIFIER,"a loop variable");l(i.FROM,"'from'");const E=w();l(i.TO,"'to'");const D=w(),fn=c(i.BY)?w():null;return l(i.RIGHT_PAREN,"')'"),{kind:"forRange",varName:d,from:E,to:D,by:fn,body:S(),keyword:o}},_=()=>{const o=a(),d=S();l(i.CAUGHT,"'caught' after the lowkey block"),l(i.LEFT_PAREN,"'(' after 'caught'");const E=l(i.IDENTIFIER,"an error variable name");l(i.RIGHT_PAREN,"')'");const D=S();return{kind:"try",body:d,errName:E,handler:D,keyword:o}},C=()=>{const o=a();l(i.LEFT_PAREN,"'(' after 'vibin'");const d=l(i.IDENTIFIER,"a loop variable");l(i.IN,"'in'");const E=w();return l(i.RIGHT_PAREN,"')'"),{kind:"forEach",varName:d,iterable:E,body:S(),keyword:o}},nn=()=>{const o=a(),d=u(i.RIGHT_BRACE)?null:w();return{kind:"return",keyword:o,value:d}},en={[i.PLUS_EQUAL]:i.PLUS,[i.MINUS_EQUAL]:i.MINUS,[i.STAR_EQUAL]:i.STAR,[i.SLASH_EQUAL]:i.SLASH,[i.PERCENT_EQUAL]:i.PERCENT},z=(o,d,E)=>{if(o.kind==="variable")return{kind:"assign",name:o.name,value:d};if(o.kind==="index")return{kind:"indexAssign",object:o.object,index:o.index,value:d,bracket:o.bracket};if(o.kind==="get")return{kind:"propAssign",object:o.object,name:o.name,value:d};throw new rn("you can only 'be' a variable, an array slot, or an object field, that ain't it chief",E.line)},H=()=>{const o=w(),d=en[n().type];if(d!==void 0){const E=f(),D=w(),fn={...E,type:d};return z(o,{kind:"binary",left:o,op:fn,right:D},E)}if(c(i.BE)){const E=w();return z(o,E,a())}return{kind:"expr",expr:o}},S=()=>{l(i.LEFT_BRACE,"'{'");const o=[];for(;!u(i.RIGHT_BRACE)&&!s();)o.push(N());return l(i.RIGHT_BRACE,"'}'"),o},w=()=>tn(),tn=()=>{let o=K();for(;c(i.OR);)o={kind:"logical",left:o,op:a(),right:K()};return o},K=()=>{let o=Y();for(;c(i.AND);)o={kind:"logical",left:o,op:a(),right:Y()};return o},Y=()=>{let o=X();for(;c(i.EQUAL_EQUAL,i.BANG_EQUAL,i.IS,i.AINT);)o={kind:"binary",left:o,op:a(),right:X()};return o},X=()=>{let o=T();for(;c(i.LESS,i.LESS_EQUAL,i.GREATER,i.GREATER_EQUAL);)o={kind:"binary",left:o,op:a(),right:T()};return o},T=()=>{let o=j();for(;c(i.PLUS,i.MINUS);)o={kind:"binary",left:o,op:a(),right:j()};return o},j=()=>{let o=q();for(;c(i.STAR,i.SLASH,i.PERCENT);)o={kind:"binary",left:o,op:a(),right:q()};return o},q=()=>c(i.NOT,i.MINUS)?{kind:"unary",op:a(),right:q()}:m(),m=()=>{let o=p();for(;;)if(c(i.LEFT_PAREN)){const d=[];if(!u(i.RIGHT_PAREN))do d.push(w());while(c(i.COMMA));const E=l(i.RIGHT_PAREN,"')'");o={kind:"call",callee:o,args:d,paren:E}}else if(c(i.LEFT_BRACKET)){const d=w(),E=l(i.RIGHT_BRACKET,"']'");o={kind:"index",object:o,index:d,bracket:E}}else if(c(i.DOT)){const d=l(i.IDENTIFIER,"a field name after '.'");o={kind:"get",object:o,name:d}}else break;return o},p=()=>{if(c(i.NUMBER,i.STRING))return{kind:"literal",value:a().literal};if(c(i.NOCAP))return{kind:"literal",value:!0};if(c(i.CAP))return{kind:"literal",value:!1};if(c(i.GHOST))return{kind:"literal",value:null};if(c(i.IDENTIFIER))return{kind:"variable",name:a()};if(c(i.LEFT_PAREN)){const o=w();return l(i.RIGHT_PAREN,"')'"),o}if(c(i.LEFT_BRACKET)){const o=a(),d=[];if(!u(i.RIGHT_BRACKET))do d.push(w());while(c(i.COMMA));return l(i.RIGHT_BRACKET,"']'"),{kind:"array",elements:d,bracket:o}}if(c(i.LEFT_BRACE))return R();if(c(i.SIGMA))return v();throw new rn(`wasn't expecting ${y(n())} there, that ain't it chief`,n().line)},R=()=>{const o=a(),d=[];if(!u(i.RIGHT_BRACE))do{let E;if(c(i.IDENTIFIER))E=a().lexeme;else if(c(i.STRING))E=a().literal;else throw new rn(`expected a field name but got ${y(n())}, that ain't it chief`,n().line);l(i.COLON,"':'"),d.push({key:E,value:w()})}while(c(i.COMMA));return l(i.RIGHT_BRACE,"'}'"),{kind:"object",entries:d,brace:o}},v=()=>{const o=a();l(i.LEFT_PAREN,"'(' after 'sigma'");const d=[];if(!u(i.RIGHT_PAREN))do d.push(l(i.IDENTIFIER,"a parameter name"));while(c(i.COMMA));return l(i.RIGHT_PAREN,"')'"),{kind:"lambda",params:d,body:S(),keyword:o}},yn=[];for(;!s();)yn.push(N());return yn}function kn(r,e){try{const n=Un(Cn(r)),t=new Ln(e);return _n(t),e.game&&xn(t,e.game),t.interpret(n),{ok:!0,interpreter:t}}catch(n){if(n instanceof Z)return{ok:!1,error:n.message};throw n}}const Pn=5e5;function pn(r){return r===" "?"space":r}function On(r,e,n,t){const a=e.getContext("2d");let s="#ffffff",u=e.width,f=e.height;const c=new Set;let y=0,l=0,N=0,F=performance.now(),Q=0;const L=kn(r,{onOutput:n,game:{canvas:(m,p)=>{u=m,f=p,e.width=m,e.height=p},background:m=>{a.fillStyle=m,a.fillRect(0,0,u,f)},paint:m=>{s=m},box:(m,p,R,v)=>{a.fillStyle=s,a.fillRect(m,p,R,v)},dot:(m,p,R)=>{a.fillStyle=s,a.beginPath(),a.arc(m,p,R,0,Math.PI*2),a.fill()},streak:(m,p,R,v)=>{a.strokeStyle=s,a.beginPath(),a.moveTo(m,p),a.lineTo(R,v),a.stroke()},words:(m,p,R,v)=>{a.fillStyle=s,a.font=`${v}px "JetBrains Mono", monospace`,a.fillText(m,p,R)},held:m=>c.has(pn(m)),mouseX:()=>y,mouseY:()=>l,frames:()=>N,delta:()=>Q},maxSteps:Pn});if(!L.ok)return t(L.error),null;const I=L.interpreter,_=m=>{const p=I.globals.tryGet(m);return p!==void 0&&gn(p)?p:null},C=_("draw");if(!C)return null;const nn=_("update"),en=_("keypressed"),z=_("clicked");let H=!0,S=0;function w(m,p){I.resetSteps();try{return I.callValue(m,p,0),!0}catch(R){return H=!1,t(R instanceof Error?R.message:"yo something dipped, skipped, or yeeted where it shouldn't have"),!1}}function tn(m){const p=m.target;if(!p)return!1;const R=p.tagName;return R==="INPUT"||R==="TEXTAREA"||p.isContentEditable}const K=m=>{if(tn(m))return;const p=pn(m.key);c.add(p),en&&H&&w(en,[p])},Y=m=>{tn(m)||c.delete(pn(m.key))},X=m=>{const p=e.getBoundingClientRect();y=m.clientX-p.left,l=m.clientY-p.top},T=()=>{z&&H&&w(z,[])};window.addEventListener("keydown",K),window.addEventListener("keyup",Y),e.addEventListener("mousemove",X),e.addEventListener("mousedown",T),e.addEventListener("touchstart",T);function j(){H=!1,cancelAnimationFrame(S),window.removeEventListener("keydown",K),window.removeEventListener("keyup",Y),e.removeEventListener("mousemove",X),e.removeEventListener("mousedown",T),e.removeEventListener("touchstart",T)}function q(m){if(H){if(Q=N===0?0:m-F,F=m,nn&&!w(nn,[])||!w(C,[]))return j();N++,S=requestAnimationFrame(q)}}return S=requestAnimationFrame(q),{stop:j}}const Gn=`btw arrays and closures showing off fr

cook squad be ["rizz", "gyatt", "sigma"]
push(squad, "ohio")

cook i be 0
grind (i < count(squad)) {
  yap(i, "->", squad[i])
  i be i + 1
}

btw closures work too, no cap
sigma makeCounter() {
  cook n be 0
  sigma inc() {
    n be n + 1
    yeet n
  }
  yeet inc
}

cook counter be makeCounter()
counter()
counter()
yap("counter hit", counter(), "times")
`,Mn=`btw recursive fibonacci, certified sigma grindset

sigma fib(n) {
  sus (n < 2) { yeet n }
  yeet fib(n - 1) + fib(n - 2)
}

cook i be 0
grind (i < 10) {
  yap("fib(" + i + ") is", fib(i))
  i be i + 1
}
`,Bn=`btw fizzbuzz but make it brainrot

cook i be 1
grind (i <= 15) {
  sus (i % 15 is 0) {
    yap("fizzbuzz")
  } mid (i % 3 is 0) {
    yap("fizz")
  } mid (i % 5 is 0) {
    yap("buzz")
  } nah {
    yap(i)
  }
  i be i + 1
}
`,$n=`btw the holistic tour: objects, loops, lambdas, string tools

cook squad be [
  {name: "drake", aura: 42},
  {name: "kai", aura: 9001},
  {name: "livvy", aura: 777}
]

btw for-each + objects with dot access
vibin (member in squad) {
  sus (member.aura > 1000) {
    yap(screm(member.name), "got MAX aura fr")
  } nah {
    yap(member.name, "sitting at", member.aura)
  }
}

btw range loop, inclusive both ends
finna (i from 1 to 3) {
  yap("day " + i + " of the grind")
}

btw lambdas + map/keep
cook auras be map(squad, sigma (m) { yeet m.aura })
yap("all auras:", auras)
yap("sorted:", sort(auras))
yap("elite only:", keep(auras, sigma (a) { yeet a > 500 }))

btw word frequency with an object as a map
cook freq be {}
vibin (w in rip("cap no cap no no", " ")) {
  sus (has(freq, w)) { freq[w] be freq[w] + 1 }
  nah { freq[w] be 1 }
}
yap("the tally:", freq)
`,Fn=`btw flappy bird, certified sigma grindset

canvas(400, 500)

cook birdY be 250
cook vel be 0
cook grav be 0.4
cook flap be -7
cook pipes be []
cook score be 0
cook dead be cap
cook gap be 130
cook pipeW be 50
cook birdX be 80

sigma spawnPipe() {
  cook top be rando(60, 340)
  push(pipes, {x: 400, top: top, scored: cap})
}

spawnPipe()

sigma jump() {
  sus (dead) {
    birdY be 250
    vel be 0
    pipes be []
    score be 0
    dead be cap
    spawnPipe()
  } nah {
    vel be flap
  }
}

sigma keypressed(key) {
  sus (key is "space") { jump() }
}

sigma clicked() { jump() }

sigma update() {
  sus (dead) { yeet ghost }

  vel += grav
  birdY += vel

  vibin (p in pipes) {
    p.x -= 3
    sus (not p.scored and p.x + pipeW < birdX) {
      p.scored be nocap
      score += 1
    }
  }
  cook alive be keep(pipes, sigma (p) { yeet p.x + pipeW > 0 })
  pipes be alive

  sus (count(pipes) > 0) {
    cook last be pipes[count(pipes) - 1]
    sus (last.x < 220) { spawnPipe() }
  } nah {
    spawnPipe()
  }

  sus (birdY > 490 or birdY < 0) { dead be nocap }
  vibin (p in pipes) {
    sus (birdX + 12 > p.x and birdX - 12 < p.x + pipeW) {
      sus (birdY - 12 < p.top or birdY + 12 > p.top + gap) {
        dead be nocap
      }
    }
  }
}

sigma draw() {
  background("#5ec6ff")

  paint("#3ea832")
  vibin (p in pipes) {
    box(p.x, 0, pipeW, p.top)
    box(p.x, p.top + gap, pipeW, 500)
  }

  paint("#ffd93d")
  dot(birdX, birdY, 12)

  paint("#ffffff")
  words("score: " + score, 12, 30, 20)

  sus (dead) {
    paint("#000000")
    words("rip. tap to respawn", 90, 250, 22)
  }
}
`,ln={fizzbuzz:Bn,fib:Mn,arrays:Gn,vibecheck:$n,flappy:Fn},Hn=5e6,G=document.querySelector("#editor"),sn=document.querySelector("#output"),P=document.querySelector("#status"),Tn=document.querySelector("#run-button"),wn=document.querySelector("#example-select"),an=document.querySelector("#game-canvas");let cn=null;function vn(){cn&&(cn.stop(),cn=null)}function on(r,e){const n=document.createElement("div");n.className=e==="out"?"out-line":"err-line",n.textContent=r,sn.appendChild(n)}function un(){vn(),sn.textContent="",P.textContent="",P.className="status";const r=On(G.value,an,a=>on(a,"out"),a=>{on(`💀 ${a}`,"err"),P.textContent="L",P.classList.add("err")});if(r){cn=r,an.style.display="block",an.focus(),P.textContent="▶ running",P.classList.add("ok");return}an.style.display="none";const e=performance.now(),n=kn(G.value,{onOutput:a=>on(a,"out"),onInput:a=>window.prompt(a||"gimme:"),maxSteps:Hn}),t=(performance.now()-e).toFixed(0);n.ok?(P.textContent=`W · ${t}ms`,P.classList.add("ok")):(on(`💀 ${n.error}`,"err"),P.textContent="L",P.classList.add("err")),sn.scrollTop=sn.scrollHeight}Tn.addEventListener("click",un);document.addEventListener("keydown",r=>{(r.metaKey||r.ctrlKey)&&r.key==="Enter"&&(r.preventDefault(),un())});wn.addEventListener("change",()=>{G.value=ln[wn.value]??"",un()});G.addEventListener("keydown",r=>{if(r.key==="Tab"){r.preventDefault();const{selectionStart:e,selectionEnd:n,value:t}=G;G.value=`${t.slice(0,e)}  ${t.slice(n)}`,G.selectionStart=G.selectionEnd=e+2}});function Dn(){const r=/^#code=(.+)$/.exec(location.hash);if(!r)return null;try{return new TextDecoder().decode(Uint8Array.from(atob(r[1]),e=>e.charCodeAt(0)))}catch{return null}}function Qn(){const r=/^#example=(.+)$/.exec(location.hash),e=r==null?void 0:r[1];return e&&e in ln?(wn.value=e,ln[e]):null}G.value=Dn()??Qn()??ln.fizzbuzz;un();
