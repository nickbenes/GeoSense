function isDark(e,t,n,r){r/=255;var i=1-r;e=r*e/255+i,t=r*t/255+i,n=r*n/255+i;var s=e*.299+t*.587+n*.144;return s<.5}var features=[new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("LINESTRING(-90 90, 90 -90)"),{color:"#0f0000"}),new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("LINESTRING(100 50, -100 -50)"),{color:"#00ff00"})],layer=new OpenLayers.Layer.Vector(null,{styleMap:new OpenLayers.StyleMap({strokeWidth:3,strokeColor:"${color}"}),isBaseLayer:!0,renderers:["Canvas"],rendererOptions:{hitDetection:!0}});layer.addFeatures(features);var map=new OpenLayers.Map({div:"map",layers:[layer],center:new OpenLayers.LonLat(0,0),zoom:0}),xOff=2,yOff=2,rows=1+2*yOff,cols=1+2*xOff,template=new jugl.Template("template");template.process({clone:!0,parent:"inspector",context:{rows:rows,cols:cols}});var context=layer.renderer.canvas,size=map.getSize();map.events.on({mousemove:function(e){var t=e.xy.x-1,n=e.xy.y;if(t>=xOff&&t<size.w-xOff&&n>=yOff&&n<size.h-yOff){var r=context.getImageData(t-xOff,n-yOff,rows,cols).data,i,s,o,u,a,f;for(var l=0;l<cols;++l)for(var c=0;c<rows;++c)i=l*4+c*4*cols,s=r[i],o=r[i+1],u=r[i+2],a=r[i+3],f=document.getElementById("c"+l+"r"+c),f.innerHTML="R: "+s+"<br>G: "+o+"<br>B: "+u+"<br>A: "+a,f.style.backgroundColor="rgba("+s+", "+o+", "+u+", "+a/255+")",f.style.color=isDark(s,o,u,a)?"#ffffff":"#000000"}}});