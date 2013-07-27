/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Format.Filter.v1_1_0=OpenLayers.Class(OpenLayers.Format.GML.v3,OpenLayers.Format.Filter.v1,{VERSION:"1.1.0",schemaLocation:"http://www.opengis.net/ogc/filter/1.1.0/filter.xsd",initialize:function(e){OpenLayers.Format.GML.v3.prototype.initialize.apply(this,[e])},readers:{ogc:OpenLayers.Util.applyDefaults({PropertyIsEqualTo:function(e,t){var n=e.getAttribute("matchCase"),r=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,matchCase:n!=="false"&&n!=="0"});this.readChildNodes(e,r),t.filters.push(r)},PropertyIsNotEqualTo:function(e,t){var n=e.getAttribute("matchCase"),r=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.NOT_EQUAL_TO,matchCase:n!=="false"&&n!=="0"});this.readChildNodes(e,r),t.filters.push(r)},PropertyIsLike:function(e,t){var n=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LIKE});this.readChildNodes(e,n);var r=e.getAttribute("wildCard"),i=e.getAttribute("singleChar"),s=e.getAttribute("escapeChar");n.value2regex(r,i,s),t.filters.push(n)}},OpenLayers.Format.Filter.v1.prototype.readers.ogc),gml:OpenLayers.Format.GML.v3.prototype.readers.gml,feature:OpenLayers.Format.GML.v3.prototype.readers.feature},writers:{ogc:OpenLayers.Util.applyDefaults({PropertyIsEqualTo:function(e){var t=this.createElementNSPlus("ogc:PropertyIsEqualTo",{attributes:{matchCase:e.matchCase}});return this.writeNode("PropertyName",e,t),this.writeOgcExpression(e.value,t),t},PropertyIsNotEqualTo:function(e){var t=this.createElementNSPlus("ogc:PropertyIsNotEqualTo",{attributes:{matchCase:e.matchCase}});return this.writeNode("PropertyName",e,t),this.writeOgcExpression(e.value,t),t},PropertyIsLike:function(e){var t=this.createElementNSPlus("ogc:PropertyIsLike",{attributes:{matchCase:e.matchCase,wildCard:"*",singleChar:".",escapeChar:"!"}});return this.writeNode("PropertyName",e,t),this.writeNode("Literal",e.regex2value(),t),t},BBOX:function(e){var t=this.createElementNSPlus("ogc:BBOX");e.property&&this.writeNode("PropertyName",e,t);var n=this.writeNode("gml:Envelope",e.value);return e.projection&&n.setAttribute("srsName",e.projection),t.appendChild(n),t},SortBy:function(e){var t=this.createElementNSPlus("ogc:SortBy");for(var n=0,r=e.length;n<r;n++)this.writeNode("ogc:SortProperty",e[n],t);return t},SortProperty:function(e){var t=this.createElementNSPlus("ogc:SortProperty");return this.writeNode("ogc:PropertyName",e,t),this.writeNode("ogc:SortOrder",e.order=="DESC"?"DESC":"ASC",t),t},SortOrder:function(e){var t=this.createElementNSPlus("ogc:SortOrder",{value:e});return t}},OpenLayers.Format.Filter.v1.prototype.writers.ogc),gml:OpenLayers.Format.GML.v3.prototype.writers.gml,feature:OpenLayers.Format.GML.v3.prototype.writers.feature},writeSpatial:function(e,t){var n=this.createElementNSPlus("ogc:"+t);this.writeNode("PropertyName",e,n);if(e.value instanceof OpenLayers.Filter.Function)this.writeNode("Function",e.value,n);else{var r;e.value instanceof OpenLayers.Geometry?r=this.writeNode("feature:_geometry",e.value).firstChild:r=this.writeNode("gml:Envelope",e.value),e.projection&&r.setAttribute("srsName",e.projection),n.appendChild(r)}return n},CLASS_NAME:"OpenLayers.Format.Filter.v1_1_0"});