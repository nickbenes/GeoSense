/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Format.XML.VersionedOGC=OpenLayers.Class(OpenLayers.Format.XML,{defaultVersion:null,version:null,profile:null,allowFallback:!1,name:null,stringifyOutput:!1,parser:null,initialize:function(e){OpenLayers.Format.XML.prototype.initialize.apply(this,[e]);var t=this.CLASS_NAME;this.name=t.substring(t.lastIndexOf(".")+1)},getVersion:function(e,t){var n;return e?(n=this.version,n||(n=e.getAttribute("version"),n||(n=this.defaultVersion))):n=t&&t.version||this.version||this.defaultVersion,n},getParser:function(e){e=e||this.defaultVersion;var t=this.profile?"_"+this.profile:"";if(!this.parser||this.parser.VERSION!=e){var n=OpenLayers.Format[this.name]["v"+e.replace(/\./g,"_")+t];if(!n){t!==""&&this.allowFallback&&(t="",n=OpenLayers.Format[this.name]["v"+e.replace(/\./g,"_")]);if(!n)throw"Can't find a "+this.name+" parser for version "+e+t}this.parser=new n(this.options)}return this.parser},write:function(e,t){var n=this.getVersion(null,t);this.parser=this.getParser(n);var r=this.parser.write(e,t);return this.stringifyOutput===!1?r:OpenLayers.Format.XML.prototype.write.apply(this,[r])},read:function(e,t){typeof e=="string"&&(e=OpenLayers.Format.XML.prototype.read.apply(this,[e]));var n=e.documentElement,r=this.getVersion(n);this.parser=this.getParser(r);var i=this.parser.read(e,t),s=this.parser.errorProperty||null;if(s!==null&&i[s]===undefined){var o=new OpenLayers.Format.OGCExceptionReport;i.error=o.read(e)}return i.version=r,i},CLASS_NAME:"OpenLayers.Format.XML.VersionedOGC"});