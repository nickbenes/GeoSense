function init(){function n(n){t+=n.tile.url.substr(0,5)==="data:",window.localStorage?e.innerHTML=t+" cache hits.":e.innerHTML="Local storage not supported. Try a different browser."}map=new OpenLayers.Map({div:"map",projection:"EPSG:900913",layers:[new OpenLayers.Layer.WMS("OSGeo","http://vmap0.tiles.osgeo.org/wms/vmap0",{layers:"basic"},{eventListeners:{tileloaded:n}})],center:[0,0],zoom:1}),cacheRead=new OpenLayers.Control.CacheRead,map.addControl(cacheRead);var e=document.getElementById("status"),t=0}var map,cacheRead;