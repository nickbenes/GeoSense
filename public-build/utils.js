function formatLargeNumber(e){if(e>=1e6)e=Math.round(e/1e6*10)/10+"M";else if(e>5e3)e=Math.round(e/1e3)+"K";else if(e>1e3)return parseInt(e);return e}function formatDecimalNumber(e,t){if(e<10){t==null&&(t=2);var n=Math.pow(10,t);return Math.round(e*n)/n}return Math.round(e)}function autoFormatNumber(e){return e>1e3?formatLargeNumber(e):e%1!=0?formatDecimalNumber(e):e}function genQueryString(e,t){var n="";if(e instanceof Array)for(var r=0;r<e.length;r++)n+=(n!=""?"&":"")+t+"="+e[r];else for(var t in e)e[t]instanceof Array?n+=(n!=""?"&":"")+genQueryString(e[t],t):n+=(n!=""?"&":"")+t+"="+e[t];return n}function nl2p(e){return"<p>"+e.split(/(\s*\n\s*){2,}/).join("</p><p>")+"</p>"}function mathEval(exp){var reg=/(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig,valid=!0,evalExp=exp.replace(reg,function(e){if(Math.hasOwnProperty(e))return"Math."+e;valid=!1});if(!valid){var msg="Invalid arithmetic expression: "+exp;console.error(msg);if(DEV)throw new Error(msg);return!1}try{return eval(evalExp)}catch(e){var msg="Eval error: "+evalExp;console.error(msg);if(DEV)throw e;return!1}}function ValFormatter(e){this.eq=e.eq,this.formatStr=e.formatStr,this.unit=e.unit}function __(e,t){var n=locale.strings[e]||e;return t?n.format(t):n}function zeroPad(e,t){return(new Array(e.length<t?t+1-e.length:0)).join("0")+e}function getRGBChannels(e){var t=colorToInt(e);return channels=[(t&16711680)>>16,(t&65280)>>8,t&255]}function rgb2int(e){return e[0]<<16^e[1]<<8^e[2]}function colorToInt(e){return typeof e=="string"?parseInt(e.replace("#","0x")):e}function intToColor(e){return"#"+zeroPad(e.toString(16),6)}function multRGB(e,t){var n=colorToInt(e),r=getRGBChannels(n);for(var i=r.length-1;i>=0;i--)r[i]=Math.min(255,Math.round(r[i]*t));return n=(r[0]<<16)+(r[1]<<8)+r[2],intToColor(n)}function rgb2hsb(e){var t,n,r,i,s,o,u=[e[0]/255,e[1]/255,e[2]/255];return t=Math.min(Math.min(u[0],u[1]),u[2]),o=Math.max(Math.max(u[0],u[1]),u[2]),t==o?new Array(0,0,o):(n=u[0]==t?u[1]-u[2]:u[1]==t?u[2]-u[0]:u[0]-u[1],r=u[0]==t?3:u[1]==t?5:1,i=Math.floor((r-n/(o-t))*60)%360,s=(o-t)/o,o=o,new Array(i,s,o))}function hsb2rgb(e){var t,n,r,i,s,o,u,a,f=[e[0],e[1],e[2]];return f[0]%=360,f[2]==0?new Array(0,0,0):(f[0]/=60,i=Math.floor(f[0]),s=f[0]-i,o=f[2]*(1-f[1]),u=f[2]*(1-f[1]*s),a=f[2]*(1-f[1]*(1-s)),i==0?(t=f[2],n=a,r=o):i==1?(t=u,n=f[2],r=o):i==2?(t=o,n=f[2],r=a):i==3?(t=o,n=u,r=f[2]):i==4?(t=a,n=o,r=f[2]):i==5&&(t=f[2],n=o,r=u),t=Math.floor(t*255),n=Math.floor(n*255),r=Math.floor(r*255),new Array(t,n,r))}function circleToGeoJSON(e,t,n,r,i,s){var o=[],u=2*Math.PI/r;for(var a=0;a<Math.PI*2;a+=u){var f=e.x+Math.cos(a)*t,l=e.y+Math.sin(a)*n;if(i&&s){var c=new OpenLayers.Geometry.Point(f,l);c.transform(i,s),f=c.x,l=c.y}o.push([f,l])}return o.push(o[0]),{type:"LineString",coordinates:o}}function maxWords(e,t){var n=e.split(" ");return n.length>t?n.splice(0,t).join(" ")+"…":e}define([],function(){return{}});var getAttr=function(e,t){var n=function(e,t){if(!e)return undefined;var r=e[t.shift()];return t.length?n(r,t):r};return n(e,t.split("."))},setAttr=function(e,t,n){var r=function(e,t){if(t.length==1){e[t[0]]=n;return}var i=t.shift();e[i]==undefined&&(e[i]={}),r(e[i],t)};r(e,t.split("."))},expandObj=function(e){var t={};for(var n in e)setAttr(t,n,e[n]);return t};$.fn.uiToggle=function(e){var e=e||{},t=!0;e.duration==undefined&&(e.duration="fast");var n=this.each(function(){var n=this;$(this).slideToggle(e),t=t&&$._data(this,"fxshow")&&$._data(this,"fxshow").hidden});return!t&&e.show&&e.show(),e.activate&&$(e.activate).toggleClass(e.activeClass||"active",!t),n};var lpad=function(e,t,n){var r=new String(e);while(r.length<n)r=t+r;return r};ValFormatter.prototype.convert=function(e){var t=e;if(this.eq&&this.eq!=""){var n=this.eq.format({val:t});t=mathEval(n)}return t},ValFormatter.prototype.format=function(e){var t=this.convert(e);return this.formatStr?this.formatStr.format({val:t}):autoFormatNumber(t)},String.prototype.format=function(e){return this.replace(/\%\(([a-z0-9_]+)\)([sif])/ig,function(t,n,r){return typeof e[n]=="function"?e[n].apply(this):typeof e[n]!="undefined"?e[n]:t})},Array.isArray||(Array.isArray=function(e){return Object.prototype.toString.call(e)==="[object Array]"});