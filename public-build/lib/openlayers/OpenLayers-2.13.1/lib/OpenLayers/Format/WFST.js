/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Format.WFST=function(e){e=OpenLayers.Util.applyDefaults(e,OpenLayers.Format.WFST.DEFAULTS);var t=OpenLayers.Format.WFST["v"+e.version.replace(/\./g,"_")];if(!t)throw"Unsupported WFST version: "+e.version;return new t(e)},OpenLayers.Format.WFST.DEFAULTS={version:"1.0.0"};