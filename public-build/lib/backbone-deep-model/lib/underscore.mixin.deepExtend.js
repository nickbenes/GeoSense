(function(){var e,t,n,r,i,s,o=[].slice;n=function(e){var t,r;return!_.isObject(e)||_.isFunction(e)?e:_.isDate(e)?new Date(e.getTime()):_.isRegExp(e)?new RegExp(e.source,e.toString().replace(/.*\//,"")):(r=_.isArray(e||_.isArguments(e)),t=function(e,t,i){return r?e.push(n(t)):e[i]=n(t),e},_.reduce(e,t,r?[]:{}))},s=function(e){return e==null?!1:(e.prototype==={}.prototype||e.prototype===Object.prototype)&&_.isObject(e)&&!_.isArray(e)&&!_.isFunction(e)&&!_.isDate(e)&&!_.isRegExp(e)&&!_.isArguments(e)},t=function(e){return _.filter(_.keys(e),function(t){return s(e[t])})},e=function(e){return _.filter(_.keys(e),function(t){return _.isArray(e[t])})},i=function(n,r,s){var o,u,a,f,l,c,h,p,d,v;s==null&&(s=20);if(s<=0)return console.warn("_.deepExtend(): Maximum depth of recursion hit."),_.extend(n,r);c=_.intersection(t(n),t(r)),u=function(e){return r[e]=i(n[e],r[e],s-1)};for(h=0,d=c.length;h<d;h++)l=c[h],u(l);f=_.intersection(e(n),e(r)),o=function(e){return r[e]=_.union(n[e],r[e])};for(p=0,v=f.length;p<v;p++)a=f[p],o(a);return _.extend(n,r)},r=function(){var e,t,r,s;r=2<=arguments.length?o.call(arguments,0,s=arguments.length-1):(s=0,[]),t=arguments[s++],_.isNumber(t)||(r.push(t),t=20);if(r.length<=1)return r[0];if(t<=0)return _.extend.apply(this,r);e=r.shift();while(r.length>0)e=i(e,n(r.shift()),t);return e},_.mixin({deepClone:n,isBasicObject:s,basicObjects:t,arrays:e,deepExtend:r})}).call(this);