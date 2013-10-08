/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Control.PinchZoom=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,pinchOrigin:null,currentCenter:null,autoActivate:!0,preserveCenter:!1,initialize:function(e){OpenLayers.Control.prototype.initialize.apply(this,arguments),this.handler=new OpenLayers.Handler.Pinch(this,{start:this.pinchStart,move:this.pinchMove,done:this.pinchDone},this.handlerOptions)},pinchStart:function(e,t){var n=this.preserveCenter?this.map.getPixelFromLonLat(this.map.getCenter()):e.xy;this.pinchOrigin=n,this.currentCenter=n},pinchMove:function(e,t){var n=t.scale,r=this.map.layerContainerOriginPx,i=this.pinchOrigin,s=this.preserveCenter?this.map.getPixelFromLonLat(this.map.getCenter()):e.xy,o=Math.round(r.x+s.x-i.x+(n-1)*(r.x-i.x)),u=Math.round(r.y+s.y-i.y+(n-1)*(r.y-i.y));this.map.applyTransform(o,u,n),this.currentCenter=s},pinchDone:function(e,t,n){this.map.applyTransform();var r=this.map.getZoomForResolution(this.map.getResolution()/n.scale,!0);if(r!==this.map.getZoom()||!this.currentCenter.equals(this.pinchOrigin)){var i=this.map.getResolutionForZoom(r),s=this.map.getLonLatFromPixel(this.pinchOrigin),o=this.currentCenter,u=this.map.getSize();s.lon+=i*(u.w/2-o.x),s.lat-=i*(u.h/2-o.y),this.map.div.clientWidth=this.map.div.clientWidth,this.map.setCenter(s,r)}},CLASS_NAME:"OpenLayers.Control.PinchZoom"});