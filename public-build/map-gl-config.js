var tilt=.41,IS_IPAD=navigator.userAgent.match(/iPad/i)!=null,VIRTUAL_PHYSICAL_FACTOR=1,CAMERA_FOV=50,SMOOTH_TWEEN_DURATION=50,CAMERA,INITIAL_POLL_INTERVAL=3e3,POLL_INTERVAL=6e3,lensTag=getURLParameter("lens_tag")||!1,globeTag=getURLParameter("globe_tag")||!1,IS_TAGGED_GLOBE=globeTag!=0,IS_LOUPE=getURLParameter("loupe")||!1,IS_AR=IS_LOUPE?!1:!IS_IPAD&&!getURLParameter("ar")?!1:lensTag!=0,IS_GESTURAL=getURLParameter("gestural")||!1,IS_TOP_DOWN=getURLParameter("top_down")||!1,radius=145,LOUPE_FOCAL_DISTANCE=radius*2.5,LOUPE_STRENGTH=CAMERA_FOV*.95,WORLD_ROT_X=Math.PI/2,WORLD_ROT_Y=-Math.PI/2,WORLD_ROT_Z=tilt,WORLD_FIXED_DIST=IS_TOP_DOWN?640:radius*3;if(IS_AR||IS_TOP_DOWN||IS_TAGGED_GLOBE)WORLD_ROT_Z=0;var rotationSpeed=.1,cloudsScale=1.005,moonScale=.23,height=window.innerHeight,width=window.innerWidth,container,stats,camera,controls,scene,renderer,geometry,meshPlanet,meshClouds,meshMoon,dirLight,ambientLight,clock=new THREE.Clock;