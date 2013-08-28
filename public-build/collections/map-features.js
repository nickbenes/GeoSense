define(["jquery","underscore","backbone","models/geo-feature","parsers/index"],function(e,t,n,r,i){var s=n.Collection.extend({model:r,comparator:function(e){return e.get("datetime")},initialize:function(t,n){this.mapLayer=n.mapLayer,this.queryParams=n.queryParams?e.extend({},n.queryParams):{},this.urlParams=n.urlParams?e.extend({},n.urlParams):{},this.urlFormat=n.urlFormat,n.parser?this.parser=new i[n.parser](this):this.parser=new i.GeoJSON(this),this.initiallyFetched=this.visibleMapAreaFetched=!1,this.on("error",function(){this.initiallyFetched=!1})},canFetch:function(){return this.mapLayer.attributes.featureCollection||this.urlFormat!=undefined&&this.urlFormat!=""},fetch:function(e){var e=e||{};return this.urlFormat!=undefined&&(e=t.extend(e,{dataType:"jsonp"})),s.__super__.fetch.call(this,e)},url:function(e){if(this.urlFormat!=undefined){var n=this.urlFormat.format(this.urlParams);return n}if(!e){var e={},r=this.urlParams.bounds;r&&(e.b=[r[0][0],r[0][1],r[1][0],r[1][1]]),e.z=this.urlParams.zoom}return this.mapLayer.url()+"/features"+"?"+genQueryString(t.extend(this.queryParams,e))},setVisibleMapArea:function(e){var t=e.bounds;this.urlParams={bounds:t,zoom:e.zoom,centerX:e.center[0],centerY:e.center[1],radius:e.radius,query:""},this.visibleMapAreaFetched=!1},isCurrent:function(){return this.initiallyFetched&&this.visibleMapAreaFetched},parse:function(e,t){this.initiallyFetched=this.visibleMapAreaFetched=!0;var n=this.parser.parse(e,t);return this.counts=n.counts||{},n.features}});return s});