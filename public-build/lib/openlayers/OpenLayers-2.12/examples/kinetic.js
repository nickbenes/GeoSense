var map=new OpenLayers.Map({div:"map",resolutions:[.087890625,.0439453125,.02197265625,.010986328125],controls:[new OpenLayers.Control.Navigation({dragPanOptions:{enableKinetic:!0}})]}),layer=new OpenLayers.Layer.TileCache("TileCache Layer",["http://c0.tilecache.osgeo.org/wms-c/cache/","http://c1.tilecache.osgeo.org/wms-c/cache/","http://c2.tilecache.osgeo.org/wms-c/cache/","http://c3.tilecache.osgeo.org/wms-c/cache/","http://c4.tilecache.osgeo.org/wms-c/cache/"],"basic",{serverResolutions:[.703125,.3515625,.17578125,.087890625,.0439453125,.02197265625,.010986328125,.0054931640625,.00274658203125,.001373291015625,.0006866455078125,.00034332275390625,.000171661376953125,858306884765625e-19,4291534423828125e-20,21457672119140625e-21],buffer:4});map.addLayer(layer),map.setCenter(new OpenLayers.LonLat(0,0),0);