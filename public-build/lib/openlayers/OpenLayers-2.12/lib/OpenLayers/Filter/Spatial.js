/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Filter.Spatial=OpenLayers.Class(OpenLayers.Filter,{type:null,property:null,value:null,distance:null,distanceUnits:null,evaluate:function(e){var t=!1;switch(this.type){case OpenLayers.Filter.Spatial.BBOX:case OpenLayers.Filter.Spatial.INTERSECTS:if(e.geometry){var n=this.value;this.value.CLASS_NAME=="OpenLayers.Bounds"&&(n=this.value.toGeometry()),e.geometry.intersects(n)&&(t=!0)}break;default:throw new Error("evaluate is not implemented for this filter type.")}return t},clone:function(){var e=OpenLayers.Util.applyDefaults({value:this.value&&this.value.clone&&this.value.clone()},this);return new OpenLayers.Filter.Spatial(e)},CLASS_NAME:"OpenLayers.Filter.Spatial"}),OpenLayers.Filter.Spatial.BBOX="BBOX",OpenLayers.Filter.Spatial.INTERSECTS="INTERSECTS",OpenLayers.Filter.Spatial.DWITHIN="DWITHIN",OpenLayers.Filter.Spatial.WITHIN="WITHIN",OpenLayers.Filter.Spatial.CONTAINS="CONTAINS";