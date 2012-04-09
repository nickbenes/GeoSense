window.MapOLView = window.MapViewBase.extend({

    tagName: 'div',
	className: 'map-view',
	
    events: {
    },

    initialize: function(options) {
		MapOLView.__super__.initialize.call(this, options);
	    this.template = _.template(tpl.get('map'));
	
		_.bindAll(this, "updateMapStyle");
	 	options.vent.bind("updateMapStyle", this.updateMapStyle);
	
		_.bindAll(this, "toggleLayerVisibility");
		options.vent.bind("toggleLayerVisibility", this.toggleLayerVisibility);
	
		this.layerArray = [];
		
		Feature = OpenLayers.Feature.Vector;
		Geometry = OpenLayers.Geometry;
		Rule = OpenLayers.Rule;
		Filter = OpenLayers.Filter;
		
		OpenLayers.ImgPath = "http://js.mapbox.com/theme/dark/";	
    },

    render: function() {
		$(this.el).html(this.template());				
        return this;
    },

	start: function() {
		var self = this;
					
		this.gmap = new OpenLayers.Layer.Google("Google Streets", {
			type: 'styled',
		    sphericalMercator: true,
		});
		        
		var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
		    restrictedExtent = maxExtent.clone(),
		    maxResolution = 156543.0339;
		
		map_controls = [ 
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.Navigation(),
		];

		this.map = new OpenLayers.Map({
		    div: "map_canvas",
		    projection: new OpenLayers.Projection("EPSG:900913"),
			displayProjection: new OpenLayers.Projection("EPSG:4326"),
		    numZoomLevels: 18,
		    maxResolution: maxResolution,
		    maxExtent: maxExtent,
		    restrictedExtent: restrictedExtent,
			controls: map_controls,
			
		});	
				
		this.map.addLayers([this.gmap]);
		
		this.addCommentLayer();
				
		this.updateMapStyle(_defaultMapStyle);
		
		this.detectMapClick();
		
		if(DEBUG)
			this.map.addControl(new OpenLayers.Control.MousePosition());
						
		this.setMapLocation(_defaultMapLocation);
	},
	
	addCommentLayer: function()
	{
		var features = [		    
		    new Feature(
		        new Geometry.Point(90, 45),
		        {cls: "one"}
		    ), 
		];

		// create rule based styles
		var Rule = OpenLayers.Rule;
		var Filter = OpenLayers.Filter;
		var style = new OpenLayers.Style({
		    pointRadius: 15,
		    fillOpacity: .7
		}, {
		    rules: [
		        new Rule({
		            filter: new Filter.Comparison({
		                type: "==",
		                property: "cls",
		                value: "one"
		            }),
		            symbolizer: {
		                externalGraphic: "../assets/comment.png"
		            }
		        }),
		       
		    ]
		});
		
		var selectedStyle = new OpenLayers.Style({
		    pointRadius: 15,
		    fillOpacity: .85
		}, {
		    rules: [
		        new Rule({
		            filter: new Filter.Comparison({
		                type: "==",
		                property: "cls",
		                value: "one"
		            }),
		            symbolizer: {
		                externalGraphic: "../assets/comment-o.png"
		            }
		        }),
		    ]
		});
		
		var commentLayer = new OpenLayers.Layer.Vector(null, {
		    styleMap: new OpenLayers.StyleMap({
		        "default": style,
		        select: selectedStyle
		    }),
			projection: new OpenLayers.Projection("EPSG:4326"),
			sphericalMercator: true,
		    renderers: ["Canvas"]
		});
		commentLayer.addFeatures(features);
	
		this.map.addLayers([commentLayer]);
		
		var select = new OpenLayers.Control.SelectFeature(commentLayer);
		this.map.addControl(select);
		select.activate();
	},
	
	addCollectionAsLayer: function(collection)
	{
		var layer = new OpenLayers.Layer.VectorPt(null, {
			projectionon: new OpenLayers.Projection("EPSG:4326"),
			sphericalMercator: true,
		    renderers: ["Canvas2"]
		});
		
		layer.collectionId = collection.collectionId;
		
		this.layerArray.push(layer);
		currLayer = this.layerArray.length;
		
		this.map.addLayers([this.layerArray[currLayer-1]]);
		
	},
	
	toggleLayerVisibility: function(index, type)
	{		
		var currCollection = index;
		var currIndex;
		$.each(this.layerArray, function(index, value) { 
			if(value.collectionId == currCollection)
				currIndex = index;
		});
		
		currVisibility = this.layerArray[currIndex].getVisibility()
		
		if(type == 0)
		{
			this.layerArray[currIndex].setVisibility(false);
		}else
		{
			this.layerArray[currIndex].setVisibility(true);
		}
		
		//Update our local data object array
		//this.dataObjectArray[currIndex].visible = type;
		//console.log(this.dataObjectArray[currIndex].visible);
	},
	
	updateMapStyle: function(theme)
	{		
		var _visibility = "simplified"
		
		if(theme == 'light')
		{
			var style = [
			  {
			    stylers: [
				      { saturation: -100 },
				      { visibility: _visibility },
				      { lightness: 8 },
				      { gamma: 1.31 }
				    ]
			  }
			];
		} else if (theme == 'dark')
		{
			var style = [
			  {
			    stylers: [
				      { saturation: -100 },
				      { visibility: _visibility },
				      { lightness: 45 },
				      { invert_lightness: true },
				      { gamma: 0.88 }
					]
			  }
			];	
		} else if (theme == 'none')
		{
			var style = [
			  {
			    stylers: []
			  }
			];	
		}
		
		var stylers = style;	
		var styledMapOptions = {
			name: "Styled Map"
		};
		var styledMapType = new google.maps.StyledMapType(stylers, styledMapOptions);

		this.gmap.mapObject.mapTypes.set('styled', styledMapType);
		this.gmap.mapObject.setMapTypeId('styled');
	},
		
	setViewPort: function(result)
	{
		var first = result[0],
		
		    center = this.toWebMercator(first.geometry.location),
		    viewport = first.geometry.viewport,
		    viewportSW = viewport.getSouthWest(),
		    viewportNE = viewport.getNorthEast(),
		    min = this.toWebMercator(viewportSW),
		    max = this.toWebMercator(viewportNE),
		    zoom = this.map.getZoomForExtent(new OpenLayers.Bounds(min.x, min.y, max.x, max.y));

		    this.map.setCenter(new OpenLayers.LonLat(center.x, center.y), zoom);		
	},
	
	toWebMercator: function (googLatLng) {
		tranlation = new Geometry.Point(googLatLng.Ya, googLatLng.Xa);
		tranlation.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));	
	  	return { x: tranlation.x, y: tranlation.y };
	},
	
	detectMapClick: function ()
	{
		OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
		 	  defaultHandlerOptions: {
                   'single': true,
                   'double': false,
                   'pixelTolerance': 0,
                   'stopSingle': false,
                   'stopDouble': false
               },

               initialize: function(options) {
                   this.handlerOptions = OpenLayers.Util.extend(
                       {}, this.defaultHandlerOptions
                   );
                   OpenLayers.Control.prototype.initialize.apply(
                       this, arguments
                   ); 
                   this.handler = new OpenLayers.Handler.Click(
                       this, {
                           'click': this.trigger
                       }, this.handlerOptions
                   );
               }, 

               trigger: function(e) {
                   var lonlat = this.map.getLonLatFromPixel(e.xy);

				//Temporary!!!!
				var commentid = 0123456;
				var mapid = _mapId;
				var lat = lonlat.lat;
				var lon = lonlat.lon
				var name = 'beef';
				var text = 'burrito';
				var date = new Date();

				$.ajax({
					type: 'POST',
					url: '/api/comment/' + commentid + '/' + mapid + '/' + lat + '/' + lon + '/' + name + '/' + text + '/' + date,
					success: function(data) {
						console.log('stored comment');
					},
					error: function() {
						console.error('failed to store comment');
					}
				})
             }
		});
		
		var click = new OpenLayers.Control.Click();
		this.map.addControl(click);
		click.activate();
	},
	
	removeCollectionFromMap: function(model) {
				
		var currCollection = model.collectionId;
		var currIndex;
								
		$.each(this.layerArray, function(index, value) { 
			if(value.collectionId == currCollection)
			{
				currIndex = index;
				console.log(currIndex);
			}
		});
		
		if(this.layerArray[currIndex])
			this.layerArray[currIndex].destroy();
	},

    addOne: function(model, currIndex) {
		var self = this;
				
		//Prep point for layer	
		var index = currIndex;	
		var collectionId = model.get('collectionid'); 
		var name = model.get('name');
		var location = model.get('location');
		var lat = model.get('lon');
		var lon = model.get('lat');
		var val = model.get('val');
		var color = model.get('color');
		
		if(color == '')
		{		
			var rainbow = new Rainbow();
			rainbow.setSpectrum('green', 'FFFFFF', '#ff0000');
			rainbow.setNumberRange(0, 1000);
			var hex = '#' + rainbow.colourAt(val);
			color = hex;
		}
		
		currPoint = new OpenLayers.Geometry.Point(lat, lon);
		currPoint.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
		
		vector = new OpenLayers.Feature.Vector(currPoint, {
	        colour: color,
		});
				
		//Add point to proper layer (by found index)
		this.layerArray[index].features.push(vector);
    },

	addOneComment: function(model) {
		var self = this;
		
		console.log('add comment');
		console.log(model)
    },
});