/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

OpenLayers.Control.ZoomIn=OpenLayers.Class(OpenLayers.Control.Button,{trigger:function(){this.map&&this.map.zoomIn()},CLASS_NAME:"OpenLayers.Control.ZoomIn"});