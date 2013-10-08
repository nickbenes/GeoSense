define(["jquery","underscore","backbone","config","utils","text!templates/map-tour.html"],function(e,t,n,r,i,s){var o=window.PanelViewBase.extend({className:"panel panel-default map-tour",events:{"click .btn.previous":"previousStep","click .btn.next":"nextStep"},initialize:function(e){o.__super__.initialize.call(this,e),this.template=t.template(s),t.bindAll(this,"updateMapInfo"),e.vent.bind("updateMapInfo",this.updateMapInfo),this.step=0,this.mapInfo=e.mapInfo},updateMapInfo:function(e){e&&(this.mapInfo=e),this.mapInfo.tour.steps.length<2?this.$(".step-buttons").hide():this.$(".step-buttons").show(),this.setStep(0)},setStep:function(e){this.step=e;var t=this.mapInfo.tour.steps[this.step];this.$(".step-body").html(t.body),this.setTitle(t.title||this.mapInfo.title);for(var n=app.mapInfo.layers.length-1;n>=0;n--){var r=app.mapInfo.layers[n].featureCollection._id,i=this.$(".data-legend."+r),s=t.layers.indexOf(n)!=-1;this.vent.trigger("toggleLayerVisibility",r,s,!0)}},previousStep:function(){return this.step==0?this.setStep(this.mapInfo.tour.steps.length-1):this.setStep(this.step-1),!1},nextStep:function(){return this.step==this.mapInfo.tour.steps.length-1?this.setStep(0):this.setStep(this.step+1),!1},render:function(){return o.__super__.render.call(this),this.updateMapInfo(),this}});return o});