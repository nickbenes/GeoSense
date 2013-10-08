// This code comes from the December 2009 release of Google Prettify, which is Copyright � 2006 Google Inc.
// Minor modifications are marked with "ND Change" comments.
// As part of Natural Docs, this code is licensed under version 3 of the GNU Affero General Public License (AGPL.)
// However, it may also be obtained separately under version 2.0 of the Apache License.
// Refer to License.txt for the complete details

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

window.PR_SHOULD_USE_CONTINUATION=!0,window.PR_TAB_WIDTH=8,window.PR_normalizedHtml=window.PR=window.prettyPrintOne=window.prettyPrint=void 0,window._pr_isIE6=function(){var e=navigator&&navigator.userAgent&&navigator.userAgent.match(/\bMSIE ([678])\./);return e=e?+e[1]:!1,window._pr_isIE6=function(){return e},e},function(){function O(e){return e.replace(C,"&amp;").replace(k,"&lt;").replace(L,"&gt;").replace(A,"&quot;")}function M(e){return e.replace(C,"&amp;").replace(k,"&lt;").replace(L,"&gt;")}function F(e){var t=e.indexOf("&");if(t<0)return e;for(--t;(t=e.indexOf("&#",t+1))>=0;){var n=e.indexOf(";",t);if(n>=0){var r=e.substring(t+3,n),i=10;r&&r.charAt(0)==="x"&&(r=r.substring(1),i=16);var s=parseInt(r,i);isNaN(s)||(e=e.substring(0,t)+String.fromCharCode(s)+e.substring(n+1))}}return e.replace(_,"<").replace(D,">").replace(P,"'").replace(H,'"').replace(j," ").replace(B,"&")}function I(e){return"XMP"===e.tagName}function R(e,t){if("PRE"===e.tagName)return!0;if(!q.test(t))return!0;var n="";return e.currentStyle?n=e.currentStyle.whiteSpace:window.getComputedStyle&&(n=window.getComputedStyle(e,null).whiteSpace),!n||n==="pre"}function U(e,t){switch(e.nodeType){case 1:var n=e.tagName.toLowerCase();t.push("<",n);for(var r=0;r<e.attributes.length;++r){var i=e.attributes[r];if(!i.specified)continue;t.push(" "),U(i,t)}t.push(">");for(var s=e.firstChild;s;s=s.nextSibling)U(s,t);(e.firstChild||!/^(?:br|link|img)$/.test(n))&&t.push("</",n,">");break;case 2:t.push(e.name.toLowerCase(),'="',O(e.value),'"');break;case 3:case 4:t.push(M(e.nodeValue))}}function z(e){function u(e){if(e.charAt(0)!=="\\")return e.charCodeAt(0);switch(e.charAt(1)){case"b":return 8;case"t":return 9;case"n":return 10;case"v":return 11;case"f":return 12;case"r":return 13;case"u":case"x":return parseInt(e.substring(2),16)||e.charCodeAt(1);case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":return parseInt(e.substring(1),8);default:return e.charCodeAt(1)}}function a(e){if(e<32)return(e<16?"\\x0":"\\x")+e.toString(16);var t=String.fromCharCode(e);if(t==="\\"||t==="-"||t==="["||t==="]")t="\\"+t;return t}function f(e){var t=e.substring(1,e.length-1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]","g")),n=[],r=[],i=t[0]==="^";for(var s=i?1:0,o=t.length;s<o;++s){var f=t[s];switch(f){case"\\B":case"\\b":case"\\D":case"\\d":case"\\S":case"\\s":case"\\W":case"\\w":n.push(f);continue}var l=u(f),c;s+2<o&&"-"===t[s+1]?(c=u(t[s+2]),s+=2):c=l,r.push([l,c]),c<65||l>122||(c<65||l>90||r.push([Math.max(65,l)|32,Math.min(c,90)|32]),c<97||l>122||r.push([Math.max(97,l)&-33,Math.min(c,122)&-33]))}r.sort(function(e,t){return e[0]-t[0]||t[1]-e[1]});var h=[],p=[NaN,NaN];for(var s=0;s<r.length;++s){var d=r[s];d[0]<=p[1]+1?p[1]=Math.max(p[1],d[1]):h.push(p=d)}var v=["["];i&&v.push("^"),v.push.apply(v,n);for(var s=0;s<h.length;++s){var d=h[s];v.push(a(d[0])),d[1]>d[0]&&(d[1]+1>d[0]&&v.push("-"),v.push(a(d[1])))}return v.push("]"),v.join("")}function l(e){var r=e.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)","g")),i=r.length,s=[];for(var o=0,u=0;o<i;++o){var a=r[o];if(a==="(")++u;else if("\\"===a.charAt(0)){var l=+a.substring(1);l&&l<=u&&(s[l]=-1)}}for(var o=1;o<s.length;++o)-1===s[o]&&(s[o]=++t);for(var o=0,u=0;o<i;++o){var a=r[o];if(a==="(")++u,s[u]===undefined&&(r[o]="(?:");else if("\\"===a.charAt(0)){var l=+a.substring(1);l&&l<=u&&(r[o]="\\"+s[u])}}for(var o=0,u=0;o<i;++o)"^"===r[o]&&"^"!==r[o+1]&&(r[o]="");if(e.ignoreCase&&n)for(var o=0;o<i;++o){var a=r[o],c=a.charAt(0);a.length>=2&&c==="["?r[o]=f(a):c!=="\\"&&(r[o]=a.replace(/[a-zA-Z]/g,function(e){var t=e.charCodeAt(0);return"["+String.fromCharCode(t&-33,t|32)+"]"}))}return r.join("")}var t=0,n=!1,r=!1;for(var i=0,s=e.length;i<s;++i){var o=e[i];if(o.ignoreCase)r=!0;else if(/[a-z]/i.test(o.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,""))){n=!0,r=!1;break}}var c=[];for(var i=0,s=e.length;i<s;++i){var o=e[i];if(o.global||o.multiline)throw new Error(""+o);c.push("(?:"+l(o)+")")}return new RegExp(c.join("|"),r?"gi":"g")}function X(e){if(null===W){var t=document.createElement("PRE");t.appendChild(document.createTextNode('<!DOCTYPE foo PUBLIC "foo bar">\n<foo />')),W=!/</.test(t.innerHTML)}if(W){var n=e.innerHTML;return I(e)?n=M(n):R(e,n)||(n=n.replace(/(<br\s*\/?>)[\r\n]+/g,"$1").replace(/(?:[\r\n]+[ \t]*)+/g," ")),n}var r=[];for(var i=e.firstChild;i;i=i.nextSibling)U(i,r);return r.join("")}function V(e){var t="                ",n=0;return function(r){var i=null,s=0;for(var o=0,u=r.length;o<u;++o){var a=r.charAt(o);switch(a){case"	":i||(i=[]),i.push(r.substring(s,o));var f=e-n%e;n+=f;for(;f>=0;f-=t.length)i.push(t.substring(0,f));s=o+1;break;case"\n":n=0;break;default:++n}}return i?(i.push(r.substring(s)),i.join("")):r}}function Y(e){var t=e.match($),n=[],r=0,i=[];if(t)for(var s=0,o=t.length;s<o;++s){var u=t[s];if(u.length>1&&u.charAt(0)==="<"){if(J.test(u))continue;if(K.test(u))n.push(u.substring(9,u.length-3)),r+=u.length-12;else if(Q.test(u))n.push("\n"),++r;else if(u.indexOf(T)>=0&&Z(u)){var a=u.match(G)[2],f=1,l;e:for(l=s+1;l<o;++l){var c=t[l].match(G);if(c&&c[2]===a)if(c[1]==="/"){if(--f===0)break e}else++f}l<o?(i.push(r,t.slice(s,l+1).join("")),s=l):i.push(r,u)}else i.push(r,u)}else{var h=F(u);n.push(h),r+=h.length}}return{source:n.join(""),tags:i}}function Z(e){return!!e.replace(/\s(\w+)\s*=\s*(?:\"([^\"]*)\"|'([^\']*)'|(\S+))/g,' $1="$2$3$4"').match(/[cC][lL][aA][sS][sS]=\"[^\"]*\bnocode\b/)}function et(e,t,n,r){if(!t)return;var i={source:t,basePos:e};n(i),r.push.apply(r,i.decorations)}function tt(e,t){var n={},r;(function(){var i=e.concat(t),s=[],o={};for(var u=0,a=i.length;u<a;++u){var f=i[u],l=f[3];if(l)for(var c=l.length;--c>=0;)n[l.charAt(c)]=f;var h=f[1],p=""+h;o.hasOwnProperty(p)||(s.push(h),o[p]=null)}s.push(/[\0-\uffff]/),r=z(s)})();var i=t.length,s=/\S/,o=function(e){var s=e.source,u=e.basePos,a=[u,y],f=0,l=s.match(r)||[],c={};for(var h=0,p=l.length;h<p;++h){var d=l[h],v=c[d],m=void 0,g;if(typeof v=="string")g=!1;else{var b=n[d.charAt(0)];if(b)m=d.match(b[1]),v=b[0];else{for(var w=0;w<i;++w){b=t[w],m=d.match(b[1]);if(m){v=b[0];break}}m||(v=y)}g=v.length>=5&&"lang-"===v.substring(0,5),g&&(!m||typeof m[1]!="string")&&(g=!1,v=E),g||(c[d]=v)}var S=f;f+=d.length;if(!g)a.push(u+S,v);else{var x=m[1],T=d.indexOf(x),N=T+x.length;m[2]&&(N=d.length-m[2].length,T=N-x.length);var C=v.substring(5);et(u+S,d.substring(0,T),o,a),et(u+S+T,x,ut(C,x),a),et(u+S+N,d.substring(N),o,a)}}e.decorations=a};return o}function nt(e){var t=[],n=[];e.tripleQuotedStrings?t.push([h,/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,"'\""]):e.multiLineStrings?t.push([h,/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]):t.push([h,/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]),e.verbatimStrings&&n.push([h,/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null]),e.hashComments&&(e.cStyleComments?(t.push([d,/^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]),n.push([h,/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/,null])):t.push([d,/^#[^\r\n]*/,null,"#"])),e.cStyleComments&&(n.push([d,/^\/\/[^\r\n]*/,null]),n.push([d,/^\/\*[\s\S]*?(?:\*\/|$)/,null]));if(e.regexLiterals){var r="/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/";n.push(["lang-regex",new RegExp("^"+N+"("+r+")")])}var i=e.keywords.replace(/^\s+|\s+$/g,"");return i.length&&n.push([p,new RegExp("^(?:"+i.replace(/\s+/g,"|")+")\\b"),null]),t.push([y,/^\s+/,null," \r\n	 "]),n.push([m,/^@[a-z_$][a-z_$@0-9]*/i,null],[v,/^@?[A-Z]+[a-z][A-Za-z_$@0-9]*/,null],[y,/^[a-z_$][a-z_$@0-9]*/i,null],[m,new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*","i"),null,"0123456789"],[g,/^.[^\s\w\.$@\'\"\`\/\#]*/,null]),tt(t,n)}function it(e){function m(e){if(e>s){o&&o!==u&&(i.push("</span>"),o=null),!o&&u&&(o=u,i.push('<span class="',o,'">'));var n=M(l(t.substring(s,e))).replace(v?h:c,"$1&nbsp;");v=d.test(n);var r=window._pr_isIE6()?"&nbsp;<br />":"<br />";i.push(n.replace(p,r)),s=e}}var t=e.source,n=e.extractedTags,r=e.decorations,i=[],s=0,o=null,u=null,a=0,f=0,l=V(window.PR_TAB_WIDTH),c=/([\r\n ]) /g,h=/(^| ) /gm,p=/\r\n?|\n/g,d=/[ \r\n]$/,v=!0;for(;;){var g;a<n.length?f<r.length?g=n[a]<=r[f]:g=!0:g=!1;if(g)m(n[a]),o&&(i.push("</span>"),o=null),i.push(n[a+1]),a+=2;else{if(!(f<r.length))break;m(r[f]),u=r[f+1],f+=2}}m(t.length),o&&i.push("</span>"),e.prettyPrintedHtml=i.join("")}function ot(e,t){for(var n=t.length;--n>=0;){var r=t[n];st.hasOwnProperty(r)?"console"in window&&console.warn("cannot override language handler %s",r):st[r]=e}}function ut(e,t){if(!e||!st.hasOwnProperty(e))e=/^\s*</.test(t)?"default-markup":"default-code";return st[e]}function at(e){var t=e.sourceCodeHtml,n=e.langExtension;e.prettyPrintedHtml=t;try{var r=Y(t),i=r.source;e.source=i,e.basePos=0,e.extractedTags=r.tags,ut(n,i)(e),it(e)}catch(s){"console"in window&&(console.log(s),console.trace())}}function ft(e,t){var n={sourceCodeHtml:e,langExtension:t};return at(n),n.prettyPrintedHtml}function lt(e){function c(){var t=window.PR_SHOULD_USE_CONTINUATION?a.now()+250:Infinity;for(;f<i.length&&a.now()<t;f++){var n=i[f];if(n.className&&n.className.indexOf("prettyprint")>=0){var r=n.className.match(/\blang-(\w+)\b/);r&&(r=r[1]);var s=!1;for(var o=n.parentNode;o;o=o.parentNode)if((o.tagName==="pre"||o.tagName==="code"||o.tagName==="xmp"||o.tagName==="td")&&o.className&&o.className.indexOf("prettyprint")>=0){s=!0;break}if(!s){var u=X(n);u=u.replace(/(?:\r\n?|\n)$/,""),u=u.replace(/&nbsp;/g,""),l={sourceCodeHtml:u,langExtension:r,sourceNode:n},at(l),h()}}}f<i.length?setTimeout(c,250):e&&e()}function h(){var e=l.prettyPrintedHtml;if(!e)return;e=e.replace(/\x11/g,"&nbsp;");var r=l.sourceNode;if(!I(r))r.innerHTML=e;else{var i=document.createElement("PRE");for(var s=0;s<r.attributes.length;++s){var o=r.attributes[s];if(o.specified){var u=o.name.toLowerCase();u==="class"?i.className=o.value:i.setAttribute(o.name,o.value)}}i.innerHTML=e,r.parentNode.replaceChild(i,r),r=i}if(t&&r.tagName==="PRE"){var a=r.getElementsByTagName("br");for(var f=a.length;--f>=0;){var c=a[f];c.parentNode.replaceChild(document.createTextNode(n),c)}}}var t=window._pr_isIE6(),n=t===6?"\r\n":"\r",r=[document.getElementsByTagName("pre"),document.getElementsByTagName("code"),document.getElementsByTagName("td"),document.getElementsByTagName("xmp")],i=[];for(var s=0;s<r.length;++s)for(var o=0,u=r[s].length;o<u;++o)i.push(r[s][o]);r=null;var a=Date;a.now||(a={now:function(){return(new Date).getTime()}});var f=0,l;c()}var e="break continue do else for if return while ",t=e+"auto case char const default "+"double enum extern float goto int long register short signed sizeof "+"static struct switch typedef union unsigned void volatile ",n=t+"catch class delete false import "+"new operator private protected public this throw true try typeof ",r=n+"alignof align_union asm axiom bool "+"concept concept_map const_cast constexpr decltype "+"dynamic_cast explicit export friend inline late_check "+"mutable namespace nullptr reinterpret_cast static_assert static_cast "+"template typeid typename using virtual wchar_t where ",i=n+"abstract boolean byte extends final finally implements import "+"instanceof null native package strictfp super synchronized throws "+"transient ",s=i+"as base by checked decimal delegate descending event "+"fixed foreach from group implicit in interface internal into is lock "+"object out override orderby params partial readonly ref sbyte sealed "+"stackalloc string select uint ulong unchecked unsafe ushort var ",o=n+"debugger eval export function get null set undefined var with "+"Infinity NaN ",u="caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END ",a=e+"and as assert class def del "+"elif except exec finally from global import in is lambda "+"nonlocal not or pass print raise try with yield "+"False True None ",f=e+"alias and begin case class def"+" defined elsif end ensure false in module next nil not or redo rescue "+"retry self super then true undef unless until when yield BEGIN END ",l=e+"case done elif esac eval fi "+"function in local set then until ",c=r+s+o+u+a+f+l,h="str",p="kwd",d="com",v="typ",m="lit",g="pun",y="pln",b="tag",w="dec",E="src",S="atn",x="atv",T="nocode",N=function(){var e=["!","!=","!==","#","%","%=","&","&&","&&=","&=","(","*","*=","+=",",","-=","->","/","/=",":","::",";","<","<<","<<=","<=","=","==","===",">",">=",">>",">>=",">>>",">>>=","?","@","[","^","^=","^^","^^=","{","|","|=","||","||=","~","break","case","continue","delete","do","else","finally","instanceof","return","throw","try","typeof"],t="(?:^^|[+-]";for(var n=0;n<e.length;++n)t+="|"+e[n].replace(/([^=<>:&a-z])/g,"\\$1");return t+=")\\s*",t}(),C=/&/g,k=/</g,L=/>/g,A=/\"/g,_=/&lt;/g,D=/&gt;/g,P=/&apos;/g,H=/&quot;/g,B=/&amp;/g,j=/&nbsp;/g,q=/[\r\n]/g,W=null,$=new RegExp("[^<]+|<!--[\\s\\S]*?-->|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>|</?[a-zA-Z](?:[^>\"']|'[^']*'|\"[^\"]*\")*>|<","g"),J=/^<\!--/,K=/^<!\[CDATA\[/,Q=/^<br\b/i,G=/^<(\/?)([a-zA-Z][a-zA-Z0-9]*)/,rt=nt({keywords:c,hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),st={};ot(rt,["default-code"]),ot(tt([],[[y,/^[^<?]+/],[w,/^<!\w[^>]*(?:>|$)/],[d,/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],[g,/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup","htm","html","mxml","xhtml","xml","xsl"]),ot(tt([[y,/^[\s]+/,null," 	\r\n"],[x,/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[[b,/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],[S,/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],[g,/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]),ot(tt([],[[x,/^[\s\S]+/]]),["uq.val"]),ot(nt({keywords:r,hashComments:!0,cStyleComments:!0}),["c","cc","cpp","cxx","cyc","m"]),ot(nt({keywords:"null true false"}),["json"]),ot(nt({keywords:s,hashComments:!0,cStyleComments:!0,verbatimStrings:!0}),["cs"]),ot(nt({keywords:i,cStyleComments:!0}),["java"]),ot(nt({keywords:l,hashComments:!0,multiLineStrings:!0}),["bsh","csh","sh"]),ot(nt({keywords:a,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py"]),ot(nt({keywords:u,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["perl","pl","pm"]),ot(nt({keywords:f,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb"]),ot(nt({keywords:o,cStyleComments:!0,regexLiterals:!0}),["js"]),ot(tt([],[[h,/^[\s\S]+/]]),["regex"]),window.PR_normalizedHtml=U,window.prettyPrintOne=ft,window.prettyPrint=lt,window.PR={combinePrefixPatterns:z,createSimpleLexer:tt,registerLangHandler:ot,sourceDecorator:nt,PR_ATTRIB_NAME:S,PR_ATTRIB_VALUE:x,PR_COMMENT:d,PR_DECLARATION:w,PR_KEYWORD:p,PR_LITERAL:m,PR_NOCODE:T,PR_PLAIN:y,PR_PUNCTUATION:g,PR_SOURCE:E,PR_STRING:h,PR_TAG:b,PR_TYPE:v}}(),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[\t\n\r \xA0]+/,null,"	\n\r  "],[PR.PR_STRING,/^(?:\"(?:[^\"\\]|\\[\s\S])*(?:\"|$)|\'(?:[^\'\\]|\\[\s\S])*(?:\'|$))/,null,"\"'"]],[[PR.PR_COMMENT,/^--(?:\[(=*)\[[\s\S]*?(?:\]\1\]|$)|[^\r\n]*)/],[PR.PR_STRING,/^\[(=*)\[[\s\S]*?(?:\]\1\]|$)/],[PR.PR_KEYWORD,/^(?:and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,null],[PR.PR_LITERAL,/^[+-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i],[PR.PR_PLAIN,/^[a-z_]\w*/i],[PR.PR_PUNCTUATION,/^[^\w\t\n\r \xA0][^\w\t\n\r \xA0\"\'\-\+=]*/]]),["lua"]),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[\t\n\x0B\x0C\r ]+/,null,"	\n\f\r "],[PR.PR_STRING,/^\"(?:[^\"\\\n\x0C\r]|\\[\s\S])*(?:\"|$)/,null,'"'],[PR.PR_STRING,/^\'(?:[^\'\\\n\x0C\r]|\\[^&])\'?/,null,"'"],[PR.PR_LITERAL,/^(?:0o[0-7]+|0x[\da-f]+|\d+(?:\.\d+)?(?:e[+\-]?\d+)?)/i,null,"0123456789"]],[[PR.PR_COMMENT,/^(?:(?:--+(?:[^\r\n\x0C]*)?)|(?:\{-(?:[^-]|-+[^-\}])*-\}))/],[PR.PR_KEYWORD,/^(?:case|class|data|default|deriving|do|else|if|import|in|infix|infixl|infixr|instance|let|module|newtype|of|then|type|where|_)(?=[^a-zA-Z0-9\']|$)/,null],[PR.PR_PLAIN,/^(?:[A-Z][\w\']*\.)*[a-zA-Z][\w\']*/],[PR.PR_PUNCTUATION,/^[^\t\n\x0B\x0C\r a-zA-Z0-9\'\"]+/]]),["hs"]),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[\t\n\r \xA0]+/,null,"	\n\r  "],[PR.PR_COMMENT,/^#(?:if[\t\n\r \xA0]+(?:[a-z_$][\w\']*|``[^\r\n\t`]*(?:``|$))|else|endif|light)/i,null,"#"],[PR.PR_STRING,/^(?:\"(?:[^\"\\]|\\[\s\S])*(?:\"|$)|\'(?:[^\'\\]|\\[\s\S])*(?:\'|$))/,null,"\"'"]],[[PR.PR_COMMENT,/^(?:\/\/[^\r\n]*|\(\*[\s\S]*?\*\))/],[PR.PR_KEYWORD,/^(?:abstract|and|as|assert|begin|class|default|delegate|do|done|downcast|downto|elif|else|end|exception|extern|false|finally|for|fun|function|if|in|inherit|inline|interface|internal|lazy|let|match|member|module|mutable|namespace|new|null|of|open|or|override|private|public|rec|return|static|struct|then|to|true|try|type|upcast|use|val|void|when|while|with|yield|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|global|include|method|mixin|object|parallel|process|protected|pure|sealed|trait|virtual|volatile)\b/],[PR.PR_LITERAL,/^[+\-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i],[PR.PR_PLAIN,/^(?:[a-z_]\w*[!?#]?|``[^\r\n\t`]*(?:``|$))/i],[PR.PR_PUNCTUATION,/^[^\t\n\r \xA0\"\'\w]+/]]),["fs","ml"]),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[\t\n\r \xA0]+/,null,"	\n\r  "],[PR.PR_STRING,/^(?:"(?:[^\"\\]|\\.)*"|'(?:[^\'\\]|\\.)*')/,null,"\"'"]],[[PR.PR_COMMENT,/^(?:--[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$))/],[PR.PR_KEYWORD,/^(?:ADD|ALL|ALTER|AND|ANY|AS|ASC|AUTHORIZATION|BACKUP|BEGIN|BETWEEN|BREAK|BROWSE|BULK|BY|CASCADE|CASE|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COMMIT|COMPUTE|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATABASE|DBCC|DEALLOCATE|DECLARE|DEFAULT|DELETE|DENY|DESC|DISK|DISTINCT|DISTRIBUTED|DOUBLE|DROP|DUMMY|DUMP|ELSE|END|ERRLVL|ESCAPE|EXCEPT|EXEC|EXECUTE|EXISTS|EXIT|FETCH|FILE|FILLFACTOR|FOR|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GOTO|GRANT|GROUP|HAVING|HOLDLOCK|IDENTITY|IDENTITYCOL|IDENTITY_INSERT|IF|IN|INDEX|INNER|INSERT|INTERSECT|INTO|IS|JOIN|KEY|KILL|LEFT|LIKE|LINENO|LOAD|NATIONAL|NOCHECK|NONCLUSTERED|NOT|NULL|NULLIF|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPENXML|OPTION|OR|ORDER|OUTER|OVER|PERCENT|PLAN|PRECISION|PRIMARY|PRINT|PROC|PROCEDURE|PUBLIC|RAISERROR|READ|READTEXT|RECONFIGURE|REFERENCES|REPLICATION|RESTORE|RESTRICT|RETURN|REVOKE|RIGHT|ROLLBACK|ROWCOUNT|ROWGUIDCOL|RULE|SAVE|SCHEMA|SELECT|SESSION_USER|SET|SETUSER|SHUTDOWN|SOME|STATISTICS|SYSTEM_USER|TABLE|TEXTSIZE|THEN|TO|TOP|TRAN|TRANSACTION|TRIGGER|TRUNCATE|TSEQUAL|UNION|UNIQUE|UPDATE|UPDATETEXT|USE|USER|VALUES|VARYING|VIEW|WAITFOR|WHEN|WHERE|WHILE|WITH|WRITETEXT)(?=[^\w-]|$)/i,null],[PR.PR_LITERAL,/^[+-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i],[PR.PR_PLAIN,/^[a-z_][\w-]*/i],[PR.PR_PUNCTUATION,/^[^\w\t\n\r \xA0\"\'][^\w\t\n\r \xA0+\-\"\']*/]]),["sql"]),PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[\t\n\r \xA0\u2028\u2029]+/,null,"	\n\r  \u2028\u2029"],[PR.PR_STRING,/^(?:[\"\u201C\u201D](?:[^\"\u201C\u201D]|[\"\u201C\u201D]{2})(?:[\"\u201C\u201D]c|$)|[\"\u201C\u201D](?:[^\"\u201C\u201D]|[\"\u201C\u201D]{2})*(?:[\"\u201C\u201D]|$))/i,null,'"“”'],[PR.PR_COMMENT,/^[\'\u2018\u2019][^\r\n\u2028\u2029]*/,null,"'‘’"]],[[PR.PR_KEYWORD,/^(?:AddHandler|AddressOf|Alias|And|AndAlso|Ansi|As|Assembly|Auto|Boolean|ByRef|Byte|ByVal|Call|Case|Catch|CBool|CByte|CChar|CDate|CDbl|CDec|Char|CInt|Class|CLng|CObj|Const|CShort|CSng|CStr|CType|Date|Decimal|Declare|Default|Delegate|Dim|DirectCast|Do|Double|Each|Else|ElseIf|End|EndIf|Enum|Erase|Error|Event|Exit|Finally|For|Friend|Function|Get|GetType|GoSub|GoTo|Handles|If|Implements|Imports|In|Inherits|Integer|Interface|Is|Let|Lib|Like|Long|Loop|Me|Mod|Module|MustInherit|MustOverride|MyBase|MyClass|Namespace|New|Next|Not|NotInheritable|NotOverridable|Object|On|Option|Optional|Or|OrElse|Overloads|Overridable|Overrides|ParamArray|Preserve|Private|Property|Protected|Public|RaiseEvent|ReadOnly|ReDim|RemoveHandler|Resume|Return|Select|Set|Shadows|Shared|Short|Single|Static|Step|Stop|String|Structure|Sub|SyncLock|Then|Throw|To|Try|TypeOf|Unicode|Until|Variant|Wend|When|While|With|WithEvents|WriteOnly|Xor|EndIf|GoSub|Let|Variant|Wend)\b/i,null],[PR.PR_COMMENT,/^REM[^\r\n\u2028\u2029]*/i],[PR.PR_LITERAL,/^(?:True\b|False\b|Nothing\b|\d+(?:E[+\-]?\d+[FRD]?|[FRDSIL])?|(?:&H[0-9A-F]+|&O[0-7]+)[SIL]?|\d*\.\d+(?:E[+\-]?\d+)?[FRD]?|#\s+(?:\d+[\-\/]\d+[\-\/]\d+(?:\s+\d+:\d+(?::\d+)?(\s*(?:AM|PM))?)?|\d+:\d+(?::\d+)?(\s*(?:AM|PM))?)\s+#)/i],[PR.PR_PLAIN,/^(?:(?:[a-z]|_\w)\w*|\[(?:[a-z]|_\w)\w*\])/i],[PR.PR_PUNCTUATION,/^[^\w\t\n\r \"\'\[\]\xA0\u2018\u2019\u201C\u201D\u2028\u2029]+/],[PR.PR_PUNCTUATION,/^(?:\[|\])/]]),["vb","vbs"]);