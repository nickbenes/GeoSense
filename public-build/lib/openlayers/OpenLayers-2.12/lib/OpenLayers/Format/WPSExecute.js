/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Format.WPSExecute=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ows:"http://www.opengis.net/ows/1.1",gml:"http://www.opengis.net/gml",wps:"http://www.opengis.net/wps/1.0.0",wfs:"http://www.opengis.net/wfs",ogc:"http://www.opengis.net/ogc",wcs:"http://www.opengis.net/wcs",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},VERSION:"1.0.0",schemaLocation:"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd",schemaLocationAttr:function(e){return undefined},write:function(e){var t;window.ActiveXObject?(t=new ActiveXObject("Microsoft.XMLDOM"),this.xmldom=t):t=document.implementation.createDocument("","",null);var n=this.writeNode("wps:Execute",e,t);return this.setAttributeNS(n,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation),OpenLayers.Format.XML.prototype.write.apply(this,[n])},writers:{wps:{Execute:function(e){var t=this.createElementNSPlus("wps:Execute",{attributes:{version:this.VERSION,service:"WPS"}});return this.writeNode("ows:Identifier",e.identifier,t),this.writeNode("wps:DataInputs",e.dataInputs,t),this.writeNode("wps:ResponseForm",e.responseForm,t),t},ResponseForm:function(e){var t=this.createElementNSPlus("wps:ResponseForm",{});return e.rawDataOutput&&this.writeNode("wps:RawDataOutput",e.rawDataOutput,t),e.responseDocument&&this.writeNode("wps:ResponseDocument",e.responseDocument,t),t},ResponseDocument:function(e){var t=this.createElementNSPlus("wps:ResponseDocument",{attributes:{storeExecuteResponse:e.storeExecuteResponse,lineage:e.lineage,status:e.status}});return e.output&&this.writeNode("wps:Output",e.output,t),t},Output:function(e){var t=this.createElementNSPlus("wps:Output",{attributes:{asReference:e.asReference}});return this.writeNode("ows:Identifier",e.identifier,t),this.writeNode("ows:Title",e.title,t),this.writeNode("ows:Abstract",e["abstract"],t),t},RawDataOutput:function(e){var t=this.createElementNSPlus("wps:RawDataOutput",{attributes:{mimeType:e.mimeType}});return this.writeNode("ows:Identifier",e.identifier,t),t},DataInputs:function(e){var t=this.createElementNSPlus("wps:DataInputs",{});for(var n=0,r=e.length;n<r;++n)this.writeNode("wps:Input",e[n],t);return t},Input:function(e){var t=this.createElementNSPlus("wps:Input",{});return this.writeNode("ows:Identifier",e.identifier,t),e.title&&this.writeNode("ows:Title",e.title,t),e.data&&this.writeNode("wps:Data",e.data,t),e.reference&&this.writeNode("wps:Reference",e.reference,t),t},Data:function(e){var t=this.createElementNSPlus("wps:Data",{});return e.literalData?this.writeNode("wps:LiteralData",e.literalData,t):e.complexData&&this.writeNode("wps:ComplexData",e.complexData,t),t},LiteralData:function(e){var t=this.createElementNSPlus("wps:LiteralData",{attributes:{uom:e.uom},value:e.value});return t},ComplexData:function(e){var t=this.createElementNSPlus("wps:ComplexData",{attributes:{mimeType:e.mimeType,encoding:e.encoding,schema:e.schema}}),n=e.value;return typeof n=="string"?t.appendChild(this.getXMLDoc().createCDATASection(e.value)):t.appendChild(n),t},Reference:function(e){var t=this.createElementNSPlus("wps:Reference",{attributes:{mimeType:e.mimeType,"xlink:href":e.href,method:e.method,encoding:e.encoding,schema:e.schema}});return e.body&&this.writeNode("wps:Body",e.body,t),t},Body:function(e){var t=this.createElementNSPlus("wps:Body",{});return e.wcs?this.writeNode("wcs:GetCoverage",e.wcs,t):e.wfs?(this.featureType=e.wfs.featureType,this.version=e.wfs.version,this.writeNode("wfs:GetFeature",e.wfs,t)):this.writeNode("wps:Execute",e,t),t}},wcs:OpenLayers.Format.WCSGetCoverage.prototype.writers.wcs,wfs:OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs,ogc:OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc,ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows},CLASS_NAME:"OpenLayers.Format.WPSExecute"});