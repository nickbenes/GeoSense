define(["jquery","underscore","backbone","config","utils","text!templates/legend.html"],function(e,t,n,r,i,s){var o=n.View.extend({className:"legend",events:{"click .unit-toggle":"unitToggleClicked","click .color-scheme-trigger":function(e){e.preventDefault()}},initialize:function(e){this.template=t.template(s),this.listenTo(this.model,"toggle:valFormatter",this.valFormatterChanged),this.listenTo(this.model,"toggle:colorScheme",this.colorSchemeChanged)},unitToggleClicked:function(t){this.model.setValFormatter(parseInt(e(t.currentTarget).attr("data-index"))),t.preventDefault()},valFormatterChanged:function(t){var n=this.$(".unit ul li");n.removeClass("active"),this.model.getValFormatters().length>1&&e(n[this.model.sessionOptions.valFormatterIndex]).addClass("active"),this.updateColorBarLabels()},colorSchemeToggleClicked:function(t){this.model.setColorScheme(parseInt(e(t.currentTarget).attr("data-index"))),t.preventDefault()},colorSchemeChanged:function(e){this.render()},removePopover:function(){this.colorSchemeTrigger&&this.colorSchemeTrigger.popover("hide"),e(".popover").remove()},render:function(){var t=this,n=this.model.getLayerOptions();e(this.el).html(this.template()),this.removePopover();var r=this.model.getValFormatter(),i=r.unit,s=this.model.getLayerOptions().colorSchemes,o=this.model.getColorScheme();if(i){var u=[],a=this.model.getValFormatters(),f=this.$(".unit ul");f.html("");for(var l=0;l<a.length;l++){var c=a[l],h='<li class="unit-item'+(a.length>1&&c==r?" active":"")+'">'+(a.length>1?'<a href="#" class="unit-toggle" data-index="'+l+'">':"<span>")+c.unit+(a.length>1?"</a>":"</span>")+"</li>",h=e(h);f.append(h)}this.$(".unit").show()}else this.$(".unit").hide();var p=this.$(".color-scheme-popover").remove();if(s&&s.length>1){var f=this.$(".unit ul"),d=s.map(function(e,t){return'<li><a href="#" class="color-scheme-toggle" data-index="'+t+'">'+e.name+"</a></li>"});f.append('<li><a href="#" class="color-scheme-trigger has-popover" data-placement="bottom"><i class="icon icon-white icon-adjust half-opacity"></i> <span class="caret"></span></a>'),this.colorSchemeTrigger=this.$(".color-scheme-trigger"),e(".color-schemes",p).append(d.join("\n")),this.$(".unit").show(),this.colorSchemeTrigger.popover({animation:!1,content:function(){return e(".color-scheme-toggle",p).each(function(n){e(this).toggleClass("active",n==t.model.sessionOptions.colorSchemeIndex)}),p.html()},html:!0,container:"body",title:__("Color Schemes")}).on("shown",function(){e(".color-scheme-toggle").click(function(e){return t.colorSchemeTrigger.popover("hide"),t.colorSchemeToggleClicked(e)})})}if(this.$(".color-bar").length){var v=[],m=this.model.getNormalizedColors(),g=n.colorLabelColor&&n.colorLabelColor.length?n.colorLabelColor:null,y=100;for(var l=0;l<m.length;l++){var b=m[l].color,w=multRGB(b,.85),E=getRGBChannels(g||b),S=rgb2hsb(E)[2]<.5,S=g?!S:S;v.push('<li style="width: '+Math.round(y/m.length*100)/100+'%;">'+'<div class="segment'+(S?" inverted":"")+'" style="background: '+b+";"+"background: linear-gradient(top, "+b+" 40%, "+w+" 80%);"+"background: -webkit-gradient(linear, left top, left bottom, color-stop(.4, "+b+"), color-stop(.8, "+w+"));"+(g?" color: "+g+";":"")+'">'+"</div>"+"</li>")}this.$(".color-bar").html(v.join("")),this.updateColorBarLabels()}return this},updateColorBarLabels:function(){if(!this.$(".color-bar").length)return;var t=this.model.getValFormatter(),n=this.model.getNormalizedColors(),r=n.length>1,i=this.$(".color-bar .segment"),s=!1;for(var o=0;o<n.length;o++){var u,a,f=this.model.isNumeric(),l=this.model.getMappedExtremes(),c=l.numeric?l.numeric.min:NaN,h=l.numeric?l.numeric.max:NaN,p=this.model.attrMap?this.model.attrMap.numeric:null;if(!f||n[o].title&&n[o].title.length)u=n[o].title||"&nbsp;";else{s=!0;if(r){u=t.format(c+n[o].position*(h-c));if(a==undefined||n[o].position>n[a].position)a=o}else u="%(min)s – %(max)s".format({min:t.format(c),max:t.format(h)})}e(i[o]).html(u)}a!=undefined&&n[a].position<1&&e(i[a]).append("+")}});return o});