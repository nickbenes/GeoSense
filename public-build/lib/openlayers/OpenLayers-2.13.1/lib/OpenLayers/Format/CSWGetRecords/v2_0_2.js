/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Format.CSWGetRecords.v2_0_2=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{csw:"http://www.opengis.net/cat/csw/2.0.2",dc:"http://purl.org/dc/elements/1.1/",dct:"http://purl.org/dc/terms/",gmd:"http://www.isotc211.org/2005/gmd",geonet:"http://www.fao.org/geonetwork",ogc:"http://www.opengis.net/ogc",ows:"http://www.opengis.net/ows",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},defaultPrefix:"csw",version:"2.0.2",schemaLocation:"http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd",requestId:null,resultType:null,outputFormat:null,outputSchema:null,startPosition:null,maxRecords:null,DistributedSearch:null,ResponseHandler:null,Query:null,regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},initialize:function(e){OpenLayers.Format.XML.prototype.initialize.apply(this,[e])},read:function(e){typeof e=="string"&&(e=OpenLayers.Format.XML.prototype.read.apply(this,[e])),e&&e.nodeType==9&&(e=e.documentElement);var t={};return this.readNode(e,t),t},readers:{csw:{GetRecordsResponse:function(e,t){t.records=[],this.readChildNodes(e,t);var n=this.getAttributeNS(e,"","version");n!=""&&(t.version=n)},RequestId:function(e,t){t.RequestId=this.getChildValue(e)},SearchStatus:function(e,t){t.SearchStatus={};var n=this.getAttributeNS(e,"","timestamp");n!=""&&(t.SearchStatus.timestamp=n)},SearchResults:function(e,t){this.readChildNodes(e,t);var n=e.attributes,r={};for(var i=0,s=n.length;i<s;++i)n[i].name=="numberOfRecordsMatched"||n[i].name=="numberOfRecordsReturned"||n[i].name=="nextRecord"?r[n[i].name]=parseInt(n[i].nodeValue):r[n[i].name]=n[i].nodeValue;t.SearchResults=r},SummaryRecord:function(e,t){var n={type:"SummaryRecord"};this.readChildNodes(e,n),t.records.push(n)},BriefRecord:function(e,t){var n={type:"BriefRecord"};this.readChildNodes(e,n),t.records.push(n)},DCMIRecord:function(e,t){var n={type:"DCMIRecord"};this.readChildNodes(e,n),t.records.push(n)},Record:function(e,t){var n={type:"Record"};this.readChildNodes(e,n),t.records.push(n)},"*":function(e,t){var n=e.localName||e.nodeName.split(":").pop();t[n]=this.getChildValue(e)}},geonet:{info:function(e,t){var n={};this.readChildNodes(e,n),t.gninfo=n}},dc:{"*":function(e,t){var n=e.localName||e.nodeName.split(":").pop();OpenLayers.Util.isArray(t[n])||(t[n]=[]);var r={},i=e.attributes;for(var s=0,o=i.length;s<o;++s)r[i[s].name]=i[s].nodeValue;r.value=this.getChildValue(e),r.value!=""&&t[n].push(r)}},dct:{"*":function(e,t){var n=e.localName||e.nodeName.split(":").pop();OpenLayers.Util.isArray(t[n])||(t[n]=[]),t[n].push(this.getChildValue(e))}},ows:OpenLayers.Util.applyDefaults({BoundingBox:function(e,t){t.bounds&&(t.BoundingBox=[{crs:t.projection,value:[t.bounds.left,t.bounds.bottom,t.bounds.right,t.bounds.top]}],delete t.projection,delete t.bounds),OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows.BoundingBox.apply(this,arguments)}},OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows)},write:function(e){var t=this.writeNode("csw:GetRecords",e);return t.setAttribute("xmlns:gmd",this.namespaces.gmd),OpenLayers.Format.XML.prototype.write.apply(this,[t])},writers:{csw:{GetRecords:function(e){e||(e={});var t=this.createElementNSPlus("csw:GetRecords",{attributes:{service:"CSW",version:this.version,requestId:e.requestId||this.requestId,resultType:e.resultType||this.resultType,outputFormat:e.outputFormat||this.outputFormat,outputSchema:e.outputSchema||this.outputSchema,startPosition:e.startPosition||this.startPosition,maxRecords:e.maxRecords||this.maxRecords}});(e.DistributedSearch||this.DistributedSearch)&&this.writeNode("csw:DistributedSearch",e.DistributedSearch||this.DistributedSearch,t);var n=e.ResponseHandler||this.ResponseHandler;if(OpenLayers.Util.isArray(n)&&n.length>0)for(var r=0,i=n.length;r<i;r++)this.writeNode("csw:ResponseHandler",n[r],t);return this.writeNode("Query",e.Query||this.Query,t),t},DistributedSearch:function(e){var t=this.createElementNSPlus("csw:DistributedSearch",{attributes:{hopCount:e.hopCount}});return t},ResponseHandler:function(e){var t=this.createElementNSPlus("csw:ResponseHandler",{value:e.value});return t},Query:function(e){e||(e={});var t=this.createElementNSPlus("csw:Query",{attributes:{typeNames:e.typeNames||"csw:Record"}}),n=e.ElementName;if(OpenLayers.Util.isArray(n)&&n.length>0)for(var r=0,i=n.length;r<i;r++)this.writeNode("csw:ElementName",n[r],t);else this.writeNode("csw:ElementSetName",e.ElementSetName||{value:"summary"},t);return e.Constraint&&this.writeNode("csw:Constraint",e.Constraint,t),e.SortBy&&this.writeNode("ogc:SortBy",e.SortBy,t),t},ElementName:function(e){var t=this.createElementNSPlus("csw:ElementName",{value:e.value});return t},ElementSetName:function(e){var t=this.createElementNSPlus("csw:ElementSetName",{attributes:{typeNames:e.typeNames},value:e.value});return t},Constraint:function(e){var t=this.createElementNSPlus("csw:Constraint",{attributes:{version:e.version}});if(e.Filter){var n=new OpenLayers.Format.Filter({version:e.version});t.appendChild(n.write(e.Filter))}else if(e.CqlText){var r=this.createElementNSPlus("CqlText",{value:e.CqlText.value});t.appendChild(r)}return t}},ogc:OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc},CLASS_NAME:"OpenLayers.Format.CSWGetRecords.v2_0_2"});