define(["jquery","underscore","backbone","config","utils","text!templates/sidebar.html","views/add-data-view","views/data-library-view"],function(e,t,n,r,i,s,o,u){var a=n.View.extend({tagName:"div",className:"sidebar-view",events:{"click #addData":"addDataClicked","click #addDataLibrary":"addDataLibraryClicked","click #scale_linear":"scaleLinearClicked","click #scale_log":"scaleLogClicked","click #tweetButton":"tweetButtonClicked","click #toggleCommentsVisible":"toggleCommentsVisibleClicked","click #toggleCommentsHidden":"toggleCommentsHiddenClicked","click #settingsTab":"settingsTabClicked","click #savePosition":"savePositionClicked"},initialize:function(e){this.template=t.template(s),this.vent=e.vent,t.bindAll(this,"mapAreaChanged"),e.vent.bind("mapAreaChanged",this.mapAreaChanged)},mapAreaChanged:function(e){this.enableSavePositionButton(),this.initialArea={center:e.center,zoom:e.zoom}},enableSavePositionButton:function(){this.$("#savePosition").attr("disabled",!1),this.$("#savePosition").removeClass("disabled")},disableSavePositionButton:function(){this.$("#savePosition").attr("disabled",!0),this.$("#savePosition").addClass("disabled")},savePositionClicked:function(){var t=this;this.colorType==ColorType.SOLID&&(this.colors=[{color:this.$("#colorInput").val()}]);var n={initialArea:this.initialArea};e.ajax({type:"POST",url:"/api/map/"+app.mapInfo._id,dataType:"json",data:n,success:function(e){t.disableSavePositionButton()},error:function(){console.error("failed to update map")}})},render:function(){var t=this;return e(this.el).html(this.template()),this.$("#scale_linear").addClass("active"),app.isMapAdmin()||this.$("#dataManager").remove(),this.updateAppLayout(),this},settingsTabClicked:function(){app.settingsVisible=!app.settingsVisible,this.vent.trigger("redrawMap"),this.updateAppLayout()},updateAppLayout:function(){app.settingsVisible?(e("#settingsTabText").html("HIDE"),e("#settingsTab").removeClass("hidden"),e(".sidebar-view").removeClass("visible"),e(".sidebar-view .black-overlay").removeClass("visible"),e("#app").addClass("sidebar-visible"),e(".map-view").addClass("full"),app.settingsVisible=!0):(e("#settingsTabText").html("SHOW"),e("#settingsTab").addClass("hidden"),e(".sidebar-view").addClass("visible"),e(".sidebar-view .black-overlay").addClass("visible"),e("#app").removeClass("sidebar-visible"),e(".map-view").removeClass("full"))},addDataLibraryClicked:function(){this.toggleDataLibrary()},toggleDataLibrary:function(){app.dataLibraryVisible==0?(this.dataLibraryView=new u,e(this.el).append(this.dataLibraryView.render().el),app.dataLibraryVisible=!0):app.dataLibraryVisible=!1},addDataClicked:function(){this.addDataView&&this.addDataView.remove(),this.addDataView=new o({vent:this.vent}),e("body").append(this.addDataView.render().el),e("#addDataModal").modal("toggle")},scaleLinearClicked:function(){this.vent.trigger("updateValueScale","linear")},scaleLogClicked:function(){this.vent.trigger("updateValueScale","log")},tweetButtonClicked:function(){var e=new TweetCollection({})},toggleCommentsVisibleClicked:function(){this.toggleCommentVisibility(1)},toggleCommentsHiddenClicked:function(){this.toggleCommentVisibility(0)},toggleCommentVisibility:function(e){this.vent.trigger("toggleLayerVisibility",null,e,"comments")},addOne:function(e){var t=this},addAll:function(){var e=this;this.collection.each(function(t){e.addOne(t)})},remove:function(){return e(window).unbind(),e(this.el).remove(),this}});return a});