function init(){var e=new OpenLayers.Layer.Vector("Vector Layer",{styleMap:new OpenLayers.StyleMap({temporary:OpenLayers.Util.applyDefaults({pointRadius:16},OpenLayers.Feature.Vector.style.temporary)})}),t=new OpenLayers.Control.Panel({displayClass:"olControlEditingToolbar"});t.addControls([new OpenLayers.Control({displayClass:"olControlNavigation"}),new OpenLayers.Control.ModifyFeature(e,{vertexRenderIntent:"temporary",displayClass:"olControlModifyFeature"}),new OpenLayers.Control.DrawFeature(e,OpenLayers.Handler.Point,{displayClass:"olControlDrawFeaturePoint"}),new OpenLayers.Control.DrawFeature(e,OpenLayers.Handler.Path,{displayClass:"olControlDrawFeaturePath"}),new OpenLayers.Control.DrawFeature(e,OpenLayers.Handler.Polygon,{displayClass:"olControlDrawFeaturePolygon"})]);var n=new OpenLayers.Layer.OSM;n.wrapDateLine=!1,map=new OpenLayers.Map({div:"map",projection:"EPSG:900913",numZoomLevels:18,controls:[new OpenLayers.Control.TouchNavigation({dragPanOptions:{enableKinetic:!0}}),new OpenLayers.Control.Zoom,t],layers:[n,e],center:new OpenLayers.LonLat(0,0),zoom:1,theme:null}),t.controls[0].activate()};