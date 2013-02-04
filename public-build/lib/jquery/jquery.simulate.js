/*
 * jquery.simulate - simulate browser mouse and keyboard events
 *
 * Copyright (c) 2009 Eduardo Lundgren (eduardolundgren@gmail.com)
 * and Richard D. Worth (rdworth@gmail.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */

(function(e){e.fn.extend({simulate:function(t,n){return this.each(function(){var r=e.extend({},e.simulate.defaults,n||{});new e.simulate(this,t,r)})}}),e.simulate=function(e,t,n){this.target=e,this.options=n,/^drag$/.test(t)?this[t].apply(this,[this.target,n]):this.simulateEvent(e,t,n)},e.extend(e.simulate.prototype,{simulateEvent:function(e,t,n){var r=this.createEvent(t,n);return this.dispatchEvent(e,t,r,n),r},createEvent:function(e,t){if(/^mouse(over|out|down|up|move)|(dbl)?click$/.test(e))return this.mouseEvent(e,t);if(/^key(up|down|press)$/.test(e))return this.keyboardEvent(e,t)},mouseEvent:function(t,n){var r,i=e.extend({bubbles:!0,cancelable:t!="mousemove",view:window,detail:0,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:undefined},n),s=e(i.relatedTarget)[0];return e.isFunction(document.createEvent)?(r=document.createEvent("MouseEvents"),r.initMouseEvent(t,i.bubbles,i.cancelable,i.view,i.detail,i.screenX,i.screenY,i.clientX,i.clientY,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.button,i.relatedTarget||document.body.parentNode)):document.createEventObject&&(r=document.createEventObject(),e.extend(r,i),r.button={0:1,1:4,2:2}[r.button]||r.button),r},keyboardEvent:function(t,n){var r,i=e.extend({bubbles:!0,cancelable:!0,view:window,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:0,charCode:0},n);if(e.isFunction(document.createEvent))try{r=document.createEvent("KeyEvents"),r.initKeyEvent(t,i.bubbles,i.cancelable,i.view,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.keyCode,i.charCode)}catch(s){r=document.createEvent("Events"),r.initEvent(t,i.bubbles,i.cancelable),e.extend(r,{view:i.view,ctrlKey:i.ctrlKey,altKey:i.altKey,shiftKey:i.shiftKey,metaKey:i.metaKey,keyCode:i.keyCode,charCode:i.charCode})}else document.createEventObject&&(r=document.createEventObject(),e.extend(r,i));if(e.browser.msie||e.browser.opera)r.keyCode=i.charCode>0?i.charCode:i.keyCode,r.charCode=undefined;return r},dispatchEvent:function(e,t,n){return e.dispatchEvent?e.dispatchEvent(n):e.fireEvent&&e.fireEvent("on"+t,n),n},drag:function(e){var t=this,n=this.findCenter(this.target),r=this.options,i=Math.floor(n.x),s=Math.floor(n.y),o=r.dx||0,u=r.dy||0,a=this.target,f={clientX:i,clientY:s};this.simulateEvent(a,"mousedown",f),f={clientX:i+1,clientY:s+1},this.simulateEvent(document,"mousemove",f),f={clientX:i+o,clientY:s+u},this.simulateEvent(document,"mousemove",f),this.simulateEvent(document,"mousemove",f),this.simulateEvent(a,"mouseup",f)},findCenter:function(t){var t=e(this.target),n=t.offset();return{x:n.left+t.outerWidth()/2,y:n.top+t.outerHeight()/2}}}),e.extend(e.simulate,{defaults:{speed:"sync"},VK_TAB:9,VK_ENTER:13,VK_ESC:27,VK_PGUP:33,VK_PGDN:34,VK_END:35,VK_HOME:36,VK_LEFT:37,VK_UP:38,VK_RIGHT:39,VK_DOWN:40})})(jQuery);