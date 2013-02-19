define(["jquery","underscore","backbone","models/point"],function(e,t,n,r){var i=n.Collection.extend({model:r,comparator:function(e){return e.get("datetime")},initialize:function(t,n){this.mapLayer=n.mapLayer,this.mapLayer=n.mapLayer,this.urlParams=n.urlParams?e.extend({},n.urlParams):{},this.initiallyFetched=this.visibleMapAreaFetched=!1,this.on("error",function(){this.initiallyFetched=!1})},url:function(){return this.mapLayer.url()+"/features"+"?"+genQueryString(this.urlParams)},setVisibleMapArea:function(e){console.log("MapPointCollection.setVisibleMapArea "+this.mapLayer.id),this.urlParams.b=[e.bounds[0][0],e.bounds[0][1],e.bounds[1][0],e.bounds[1][1]],this.urlParams.z=e.zoom,this.visibleMapAreaFetched=!1},isCurrent:function(){return this.initiallyFetched&&this.visibleMapAreaFetched},parse:function(e,t){return e.items&&(this.fullCount=e.fullCount,this.maxReducedCount=e.maxReducedCount,this.resultCount=e.resultCount,this.originalCount=e.originalCount,this.gridSize=e.gridSize,e=e.items),this.initiallyFetched=this.visibleMapAreaFetched=!0,i.__super__.parse.call(this,e,t)}});return i});