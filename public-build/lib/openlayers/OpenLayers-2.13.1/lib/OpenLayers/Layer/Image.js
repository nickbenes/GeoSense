/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Layer.Image=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:!0,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(e,t,n,r,i){this.url=t,this.extent=n,this.maxExtent=n,this.size=r,OpenLayers.Layer.prototype.initialize.apply(this,[e,i]),this.aspectRatio=this.extent.getHeight()/this.size.h/(this.extent.getWidth()/this.size.w)},destroy:function(){this.tile&&(this.removeTileMonitoringHooks(this.tile),this.tile.destroy(),this.tile=null),OpenLayers.Layer.prototype.destroy.apply(this,arguments)},clone:function(e){return e==null&&(e=new OpenLayers.Layer.Image(this.name,this.url,this.extent,this.size,this.getOptions())),e=OpenLayers.Layer.prototype.clone.apply(this,[e]),e},setMap:function(e){this.options.maxResolution==null&&(this.options.maxResolution=this.aspectRatio*this.extent.getWidth()/this.size.w),OpenLayers.Layer.prototype.setMap.apply(this,arguments)},moveTo:function(e,t,n){OpenLayers.Layer.prototype.moveTo.apply(this,arguments);var r=this.tile==null;if(t||r){this.setTileSize();var i=this.map.getLayerPxFromLonLat({lon:this.extent.left,lat:this.extent.top});r?(this.tile=new OpenLayers.Tile.Image(this,i,this.extent,null,this.tileSize),this.addTileMonitoringHooks(this.tile)):(this.tile.size=this.tileSize.clone(),this.tile.position=i.clone()),this.tile.draw()}},setTileSize:function(){var e=this.extent.getWidth()/this.map.getResolution(),t=this.extent.getHeight()/this.map.getResolution();this.tileSize=new OpenLayers.Size(e,t)},addTileMonitoringHooks:function(e){e.onLoadStart=function(){this.events.triggerEvent("loadstart")},e.events.register("loadstart",this,e.onLoadStart),e.onLoadEnd=function(){this.events.triggerEvent("loadend")},e.events.register("loadend",this,e.onLoadEnd),e.events.register("unload",this,e.onLoadEnd)},removeTileMonitoringHooks:function(e){e.unload(),e.events.un({loadstart:e.onLoadStart,loadend:e.onLoadEnd,unload:e.onLoadEnd,scope:this})},setUrl:function(e){this.url=e,this.tile.draw()},getURL:function(e){return this.url},CLASS_NAME:"OpenLayers.Layer.Image"});