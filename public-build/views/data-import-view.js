/*!prev || !prev.length*/

define(["jquery","underscore","backbone","config","utils","text!templates/data-import.html","views/modal-view"],function(e,t,n,r,i,s,o){var u=o.extend({tagName:"div",className:"data-import-view modal large fade",events:{"change .step.source input":"sourceInputChanged","click .import-run":"importButtonClicked","click .source-submit":"sourceSubmitButtonClicked","click .back":"backButtonClicked","click .from-field .remove":"fromFieldRemoveClicked","click .btn.filetype":"filetypeButtonClicked"},expandObjects:!0,initialize:function(e){this.template=t.template(s),this.vent=e.vent,this.responseData=null,this.dataTitle="",this.dataDescription="",this.maxPreview=30,this.inspectedSource,this.fromFieldColors=["#a52a2a","#f89406","#46a546","#62cffc","#ff7f50","#87ceeb","#daa520","#b8860b","#c43c35","#556b2f"],this.defaultDescripts=[{to:"geometry.coordinates",type:"LatLng",label:"coordinates",options:{},allowedTypes:["LatLng","LngLat"]},{toTemplate:"properties.$field",type:"Number",label:"",options:{}},{toTemplate:"properties.$field",type:"String",label:"",options:{}},{toTemplate:"properties.$field",type:"Date",label:"",options:{}}],this.emptyDescript={toTemplate:"properties.$field",type:"String",label:"",options:{}},this.fieldTypes={Number:"Number",String:"Text",Date:"Date",Array:"List",Object:"Object",LatLng:"Lat,Lng",LngLat:"Lng,Lat"}},canImport:function(){return!this.isLoading&&this.$("input[name=url]").val().length&&this.$(".filetype.active").length},setButtonState:function(){this.$(".btn.source-submit").attr("disabled",!this.canImport()),this.$(".import-run").attr("disabled",!this.canImport())},sourceSubmitButtonClicked:function(){var e=this;return this.canImport()?(this.runImport({inspect:!0,max:this.maxPreview},{success:function(t){t.items&&t.items.length&&(e.initDataTransformForSource(t),e.setStep("mapping"))}}),!1):!1},filetypeButtonClicked:function(t){return this.$(".btn.filetype").each(function(){e(this).toggleClass("active",t.currentTarget==this)}),this.setButtonState(),!1},backButtonClicked:function(){this.setStep("source")},sourceInputChanged:function(){var t=this,n=this.$("input[name=url]").data("prevVal"),r=this.$("input[name=url]").val();this.$("input[name=url]").data("prevVal",r),r=r.replace(/^https:\/\/www.dropbox.com\//,"https://dl.dropbox.com/"),this.$("input[name=url]").val(r);var i=r.match(/\.([^\.]+)$/),s=i?i[1]:undefined;t.$(".btn.filetype").each(function(){e(this).toggleClass("active",s!=undefined&&e(this).hasClass(s))}),this.setButtonState()},importButtonClicked:function(){var e=this;return this.canImport()?(this.runImport({background:!0},{success:function(t){app.saveNewMapLayer(t.collection._id),e.setStep("source"),e.close()}}),!1):!1},displayAttr:function(e){return Array.isArray(e)?"["+e+"]":typeof e=="object"?"[Object]":e+""},initDataTransformForSource:function(n){var r=this;this.inspectedSource=n,this.fromFields={};var i=function(e,n){t.each(e,function(e,t){var s=n?n+"."+t:t;r.fromFields[s]=s,typeof e=="object"&&!Array.isArray(e)&&i(e,s)})};i(this.inspectedSource.items[0]),console.log("initDataTransformForSource"),this.descripts=t.deepClone(this.defaultDescripts),this.$(".from-data thead").empty(),this.$(".from-data tbody").empty(),this.$(".to-data thead").empty(),this.$(".to-data tbody").empty();var s=0;for(var o in this.fromFields){var u=this.fromFieldTemplate.clone();u.removeClass("element-template"),e(".field-name",u).text(o),e(".label",u).css("background-color",this.fromFieldColors[s%this.fromFieldColors.length]),e(".from-field",u).attr("data-from",o),this.$(".from-data thead").append(u).show(),s++}t.each(this.inspectedSource.items,function(e){var n="";t.each(r.fromFields,function(t,i){n+="<td>"+r.displayAttr(getAttr(e,i))+"</td>"}),r.$(".from-data tbody").append("<tr>"+n+"</tr>")}),this.updateHandleStates(),t.each(this.descripts,function(e){r.initDescript(e)}),this.$(".from-field").draggable({revert:"invalid",helper:"clone",connectToSortable:".to-field",stack:".drag.label",start:function(t,n){r.preventSortableEvents=!0,e(n.helper).removeClass("half-opacity"),r.$(".to-field").addClass("highlight")},stop:function(e,t){console.log("* draggable stop"),r.preventSortableEvents=!1,r.removePopover(),r.$(".to-field").removeClass("highlight"),r.$(".to-data .from-field").removeClass("half-opacity"),r.updateHandleStates(),r.updateDescripts(),r.loadImportPreview()}})},initDescript:function(t){var n=this,r=n.toFieldTemplate.clone();r.removeClass("element-template"),t.dismiss=function(){e(".show-field-settings",r).popover("hide")},t.updateContainer=function(){e(".field-label",r).text(t.label),e(".field-type",r).text(n.fieldTypes[t.type])},t.container=r,n.initDescriptSettings(t),n.$(".to-data thead").append(r).show(),t.updateContainer(),e(".to-field",r).sortable({connectWith:".to-field",start:function(e,t){},stop:function(e,t){if(n.preventSortableEvents)return;n.removePopover(),console.log("* sortable stop"),n.updateDescripts(),n.loadImportPreview()}})},initDescriptSettings:function(n){var r=this,i=e(".field-settings",n.container).remove();e("select.field-type",i).each(function(){var i=e(this),s=n.allowedTypes||t.keys(r.fieldTypes);t.each(s,function(e){i.append('<option value="'+e+'">'+r.fieldTypes[e]+"</option>")})}),e(".show-field-settings",n.container).popover({title:"Transform",content:i,html:!0,container:"body",animation:!1}).on("shown",function(t){e(this).addClass("active");var s=this;e(".field-setting",i).each(function(){e(this).attr("type")=="checkbox"?e(this).attr("checked",getAttr(n,e(this).attr("name"))):e(this).val(getAttr(n,e(this).attr("name")))}),e(".field-setting",i).change(function(){setAttr(n,e(this).attr("name"),e(this).attr("type")=="checkbox"?e(this).is(":checked"):e(this).val()),r.updateDescripts(),r.loadImportPreview()}),r.$(".show-field-settings").each(function(){this!=s&&e(this).popover("hide")})}).on("hidden",function(t){return e(this).removeClass("active"),!1}).click(function(e){return!1})},updateDescripts:function(){var n=[];t.each(this.descripts,function(r){r.from=[];var i=e(".from-field",r.container);r.from=[];for(var s=0;s<i.length;s++)r.from.push(e(i[s]).attr("data-from"));r.from.length?(!r.to&&r.toTemplate&&(r.to=r.toTemplate.replace("$field",r.from[0].replace(/\./g," ")),r.label=r.to),n.push({to:t.clone(r.to),from:t.clone(r.from),options:t.clone(r.options),type:t.clone(r.type)})):r.toTemplate&&(r.to=null,r.label=""),r.updateContainer()});if(n.length>=this.descripts.length-1){var r=t.clone(this.emptyDescript);this.descripts.push(r),this.initDescript(r)}return n},render:function(){var t=this;e(this.el).html(this.template());var t=this;return this.spinner=this.$(".spinner").html((new Spinner({radius:6,length:0,width:6,color:"#333",lines:7,speed:1.5})).spin().el).hide(),this.setStep("source"),DEV&&this.$("[name=url]").val("https://dl.dropboxusercontent.com/s/28fvvskvmhrhdxx/Amsterdam.dat.json"),this.sourceInputChanged(),this.fromFieldTemplate=this.$(".from-data thead .element-template"),this.toFieldTemplate=this.$(".to-data thead .element-template"),this.$(".element-template").remove(),this.$("input.text").click(function(){e(this).select()}),this},removePopover:function(){t.each(this.descripts,function(e){e.dismiss()})},detach:function(){return this.removePopover(),u.__super__.detach.call(this)},setStep:function(t){this.setAlert(),this.$(".step").each(function(){e(this).toggle(e(this).is("."+t))})},updateHandleStates:function(){var t=this,n=this.$(".to-data .from-field");this.$(".from-data .from-field").each(function(){for(var t=0;t<n.length;t++)if(e(n[t]).attr("data-from")==e(this).attr("data-from")){e(this).addClass("half-opacity");return}e(this).removeClass("half-opacity")}),this.$(".target").toggleClass("mapped",n.length>0)},fromFieldRemoveClicked:function(t){return e(t.currentTarget).closest(".from-field").remove(),this.updateHandleStates(),this.previousValidDescripts=null,this.updateDescripts(),this.loadImportPreview(),!1},setAlert:function(e,t){e?(this.$(".modal-body .alert").show("fast"),this.$(".modal-body .errors").html(e),this.$(".modal-body .error-title").html(t)):this.$(".modal-body .alert").hide()},runImport:function(n,r){var i=this,r=r||{},s;if(!n.inspect){s=this.updateDescripts();if(!s.length&&n.preview){i.updateImportPreview([]);return}}if(r.ifChanged&&this.previousValidDescripts&&t.isEqual(this.previousValidDescripts,s))return;this.previousValidDescripts=s;var n=t.extend({url:this.$("input[name=url]").val(),format:this.$(".filetype.active").attr("data-value"),transform:s},n);console.log("Requesting import",n),this.setAlert(),this.setLoading(!0),this.request,this.request=e.ajax({type:"POST",url:window.BASE_URL+"api/import/",data:n,success:function(e){console.log("import response",e),i.setLoading(!1),n.preview&&i.updateImportPreview(e.items),r.success&&r.success(e)},error:function(t,s,o){i.setLoading(!1);var u=e.parseJSON(t.responseText),a=u&&u.errors?u.errors:u.error?{"":u}:null;console.error("import failed",a);var f="";if(a){for(var l in a)f+="<li>"+a[l].message+"</li>";r.silent||i.setAlert("<ul>"+f+"</ul>","Import failed with the following errors:")}n.preview&&i.updateImportPreview([]),r.error&&r.error(responseData)}})},setLoading:function(e){this.isLoading=e,this.setButtonState(),e?this.spinner.show():this.spinner.hide()},loadImportPreview:function(){this.runImport({preview:!0,max:this.maxPreview},{silent:!0,ifChanged:!0})},updateImportPreview:function(e){var n=this,r=e.reduce(function(e,r){var i="";return r&&t.each(n.descripts,function(e){var t,s,o,u;if(e.to){o=getAttr(r,e.to),u=typeof o=="object"&&o.error;if(u){s="conversion-error";switch(o.name){case"ValueSkippedWarning":t=o.message;break;default:t=o.message}}else switch(e.type){default:t=n.displayAttr(o);break;case"Date":o&&(t=new Date(o),t&&(t=t.format(locale.formats.DATE_TIME)))}}var a=e.to&&e.to.length;a&&(t==undefined||(typeof t=="string"||Array.isArray(t))&&!t.length)?(s="conversion-blank",t="blank"):u||(a?t='<i class="icon icon-ok-circle half-opacity"></i> '+t:t="&nbsp;"),i+="<td"+(s?' class="'+s+'"':"")+">"+t+"</td>"}),e.push("<tr>"+i+"</tr>"),e},[]);this.$(".to-data tbody").html(r.join(""))}});return u});