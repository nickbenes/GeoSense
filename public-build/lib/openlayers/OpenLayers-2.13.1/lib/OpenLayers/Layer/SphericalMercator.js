/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Layer.SphericalMercator={getExtent:function(){var e=null;return this.sphericalMercator?e=this.map.calculateBounds():e=OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this),e},getLonLatFromViewPortPx:function(e){return OpenLayers.Layer.prototype.getLonLatFromViewPortPx.apply(this,arguments)},getViewPortPxFromLonLat:function(e){return OpenLayers.Layer.prototype.getViewPortPxFromLonLat.apply(this,arguments)},initMercatorParameters:function(){this.RESOLUTIONS=[];var e=156543.03390625;for(var t=0;t<=this.MAX_ZOOM_LEVEL;++t)this.RESOLUTIONS[t]=e/Math.pow(2,t);this.units="m",this.projection=this.projection||"EPSG:900913"},forwardMercator:function(){var e=new OpenLayers.Projection("EPSG:4326"),t=new OpenLayers.Projection("EPSG:900913");return function(n,r){var i=OpenLayers.Projection.transform({x:n,y:r},e,t);return new OpenLayers.LonLat(i.x,i.y)}}(),inverseMercator:function(){var e=new OpenLayers.Projection("EPSG:4326"),t=new OpenLayers.Projection("EPSG:900913");return function(n,r){var i=OpenLayers.Projection.transform({x:n,y:r},t,e);return new OpenLayers.LonLat(i.x,i.y)}}()};