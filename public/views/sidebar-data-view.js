window.SideBarDataView = Backbone.View.extend({

    tagName: 'div',
	className: 'sidebar-data',
	
    events: {
		'click #removeData:' : 'removeDataClicked',
		'click #editData:' : 'editDataClicked',
		'click #toggleVisible:' : 'toggleVisibleClicked',
		'click #toggleHidden:' : 'toggleHiddenClicked',
		'click #singleColor:' : 'singleColorClicked',
		'click #scaleColor:' : 'scaleColorClicked',
		'click #circlesButton:' : 'circlesButtonClicked',
		'click #pixelsButton:' : 'pixelsButtonClicked',
		
		'click #colorInput' : 'colorInputClicked',
		'click #colorInputLow' : 'colorInputLowClicked',
		'click #colorInputHigh' : 'colorInputHighClicked',
		
    },

    initialize: function(options) {
		this.vent = options.vent;
	
	    this.template = _.template(tpl.get('sidebar-data'));
		this.collectionId = options.collectionId;
		this.title = options.title;
		this.dataLength = options.dataLength;
				
		this.collection.bind('add',   this.addOne, this);
		this.collection.bind('reset', this.addAll, this);
		
    },

    render: function() {
		$(this.el).html(this.template());
				
		if(this.title != '')
		{
			dataTitle = this.title;
		}
		else
		{
			dataTitle = "Untitled Data";
		}
		
		dataTitle += " ("+ this.collection.length + ") <div class='data-color'></div>";
		
		this.$("a").html(dataTitle);
		this.$("a").attr("href", "#collapse" + this.collectionId);
		this.$("#collapse").attr("id", "collapse" + this.collectionId);
		
		if(!_admin)
		{
			this.$('#adminDataControls').remove();
		}
		this.$(".color-picker").miniColors();
		this.$(".color-picker").miniColors('value','#0aa5ff');
	
		
        return this;
    },

	addOne: function(data) {
		var self = this;
    },

    addAll: function() {
      var self = this;
		this.collection.each(function(data){ 
		self.addOne(data);
	 	});
    },

	enableUpdatebutton: function()
	{
		this.$('#updateData').removeClass('disabled');
		this.$('#updateData').addClass('btn-primary');
	},

	colorInputClicked: function()
	{
		this.enableUpdatebutton();
	},
	
	colorInputLowClicked: function()
	{
		this.enableUpdatebutton();
	},
	
	colorInputHighClicked: function()
	{
		this.enableUpdatebutton();
	},

	circlesButtonClicked: function()
	{
		this.enableUpdatebutton();
		this.$('#circlesButton').addClass('active');
		this.$('#pixelsButton').removeClass('active');
	},
	
	pixelsButtonClicked: function()
	{
		this.enableUpdatebutton();
		this.$('#circlesButton').removeClass('active');
		this.$('#pixelsButton').addClass('active');
	},

	singleColorClicked: function()
	{
		$('.color-scale').hide();
		$('.color-single').show();
	},

	scaleColorClicked: function()
	{
		$('.color-scale').show();
		$('.color-single').hide();
	},

	removeDataClicked: function()
	{
		var self = this;
		
		$(this.el).fadeOut('fast',function()
		{
			self.collection.unbindCollection();
		});
		self.collection.reset();
   	},

	editDataClicked: function()
	{
		var self = this;
		
		if(this.editDataView)
			this.editDataView.remove();
			
		this.editDataView = new EditDataView({vent: this.vent, collection:this.collection});
        $('body').append(this.editDataView.render().el);
		$('#editDataModal').modal('toggle');
   	},

	displayDataState: function(state)
	{
		console.log('Currently: ' + state);
	},

	toggleVisibleClicked: function()
	{
		this.toggleVisibility(1);
	},
	
	toggleHiddenClicked: function()
	{
		this.toggleVisibility(0)
	},
	
	toggleVisibility: function(type)
	{
		this.vent.trigger("toggleLayerVisibility", this.collectionId, type);
	}

});