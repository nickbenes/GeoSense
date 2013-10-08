/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Control.CacheRead=OpenLayers.Class(OpenLayers.Control,{fetchEvent:"tileloadstart",layers:null,autoActivate:!0,setMap:function(e){OpenLayers.Control.prototype.setMap.apply(this,arguments);var t,n=this.layers||e.layers;for(t=n.length-1;t>=0;--t)this.addLayer({layer:n[t]});this.layers||e.events.on({addlayer:this.addLayer,removeLayer:this.removeLayer,scope:this})},addLayer:function(e){e.layer.events.register(this.fetchEvent,this,this.fetch)},removeLayer:function(e){e.layer.events.unregister(this.fetchEvent,this,this.fetch)},fetch:function(e){if(this.active&&window.localStorage&&e.tile instanceof OpenLayers.Tile.Image){var t=e.tile,n=t.url;!t.layer.crossOriginKeyword&&OpenLayers.ProxyHost&&n.indexOf(OpenLayers.ProxyHost)===0&&(n=OpenLayers.Control.CacheWrite.urlMap[n]);var r=window.localStorage.getItem("olCache_"+n);r&&(t.url=r,e.type==="tileerror"&&t.setImgSrc(r))}},destroy:function(){if(this.layers||this.map){var e,t=this.layers||this.map.layers;for(e=t.length-1;e>=0;--e)this.removeLayer({layer:t[e]})}this.map&&this.map.events.un({addlayer:this.addLayer,removeLayer:this.removeLayer,scope:this}),OpenLayers.Control.prototype.destroy.apply(this,arguments)},CLASS_NAME:"OpenLayers.Control.CacheRead"});