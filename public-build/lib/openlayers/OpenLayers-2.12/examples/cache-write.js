function init(){function t(){window.localStorage?e.innerHTML=localStorage.length+" entries in cache.":e.innerHTML="Local storage not supported. Try a different browser."}map=new OpenLayers.Map({div:"map",projection:"EPSG:900913",layers:[new OpenLayers.Layer.WMS("OSGeo","http://vmap0.tiles.osgeo.org/wms/vmap0",{layers:"basic"},{eventListeners:{tileloaded:t}})],center:[0,0],zoom:1}),cacheWrite=new OpenLayers.Control.CacheWrite({autoActivate:!0,imageFormat:"image/jpeg",eventListeners:{cachefull:function(){e.innerHTML="Cache full."}}}),map.addControl(cacheWrite);var e=document.getElementById("status");document.getElementById("clear").onclick=function(){OpenLayers.Control.CacheWrite.clearCache(),t()}}OpenLayers.ProxyHost="proxy.cgi?url=";var map,cacheWrite;