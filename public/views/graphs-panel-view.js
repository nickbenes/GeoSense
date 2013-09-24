define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'utils',
	'text!templates/graphs-panel.html',
	'views/panel-view-base'
], function($, _, Backbone, config, utils, templateHtml, PanelViewBase) {
    "use strict";

	var GraphsPanelView = PanelViewBase.extend({

		className: 'panel panel-default panel-anchor-bottom graphs',
		draggable: false,

		events: {
			'click .graph-toggles button': 'toggleGraphViewClicked'
		},
		
	    initialize: function(options) 
	    {   
	    	GraphsPanelView.__super__.initialize.call(this, options);

	    	var self = this; 	
		    this.template = _.template(templateHtml);	
		    this.redrawQueue = [];
		    this.graphViews = {};
		    this.graphView; 
		    
		    this.on('panel:resize', this.adjustAndRedrawGraphs);
		    this.on('panel:show', this.adjustAndRedrawGraphs);
		},

		adjustAndRedrawGraphs: function() 
		{
			var self = this;
	    	self.redrawQueue.push(setTimeout(function() {
	    		_.each(self.graphViews, function(view, viewKey) {
	    			view.fillExtents();
	    		});
	    		if (self.graphView && self.$el.is(':visible')) {
	    			if (self.graphView.graphRendered) {
		    			self.graphView.redrawGraph();
	    			} else {
		    			self.graphView.renderGraph();
	    			}
	    		}
	    	}, 250));
	    	for (var i = self.redrawQueue.length; i > 1; i--) {
	    		clearTimeout(self.redrawQueue.shift());
	    	}
		},

		render: function()
		{
			GraphsPanelView.__super__.render.call(this);
			this.$('.model-title').text(this.model.getDisplay('title'));
			this.$graphToggles = this.$('.graph-toggles');
			this.$graphToggleTemplate = $('.element-template', this.$graphToggles)
				.remove().removeClass('element-template');
			return this;
		},

		addGraphView: function(key, view, title)
		{
			this.graphViews[key] = view;
			var toggle = this.$graphToggleTemplate.clone()
				.attr('data-value', key)
				.text(title || key);
			this.$graphToggles.append(toggle)
			this.$('.graph-container').append(view.$el);
			if (!this.graphView) {
				this.toggleGraphView(key);
			} else {
				view.hide();
			}
		},

		toggleGraphViewClicked: function(evt) 
		{
			this.toggleGraphView($(evt.currentTarget).attr('data-value'));
			this.updatePanelState(true);
		},

		toggleGraphView: function(key)
		{
			if (key) {
				console.log('toggle graph view:', key);
				this.graphView = this.graphViews[key];
			}
			$('button', this.$graphToggles).each(function() {
				$(this).toggleClass('active', $(this).attr('data-value') == key);
			});
			if (this.$el.is(':visible')) {
				_.each(this.graphViews, function(view, viewKey) {
					if (viewKey == key) {
						view.show();
					} else {
						view.hide();
					}
				});
			}
		}

	});

	return GraphsPanelView;
});