
	function DrawTilesMap()
	{
		   var zoomVal = 0;
		   var radiusMiles = 0;
		   var radiusMeters = 0;
		   var lat = parseFloat(document.getElementById("lat").value);
		   var lon = parseFloat(document.getElementById("lon").value);
		   var custCounty = document.getElementById("county").value;
 		   var showCountyName = document.getElementById("ShowCountyName").value;  
	   	   var metricCode = document.getElementById("MetricCodeForRasterURL").value;
		   
		   if(document.getElementById("PrimaryMapRadiusMiles") != null)
		   {  
				radiusMiles = parseInt(document.getElementById("PrimaryMapRadiusMiles").value);
		   }
		   
		    //radiusMiles = 90; //test
		   
		    radiusMeters = radiusMiles * 1609.34;
		      
			//1.Draw BASE MAP layer
			var osm = L.tileLayer('https://api.mapbox.com/styles/v1/indigoag-it/cjs3m68vm2ky81fqk1mx5vft9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaW5kaWdvYWctaXQiLCJhIjoiY2pydWxiMjRsMDl4MjQ0bDUxcjdkb2FxaCJ9.Jt2VXR5rX8dJSYq9yio5Hw', {attribution: ''});
     		var map = L.map('mapid', {
				center: [lat, lon],
				zoom: zoomVal,
				minZoom: 1,
				maxZoom: 8,
			    zoomSnap: 0.025,
				zoomControl:false,
				layers: [osm]
			});
			  
			//2.Draw CIRCLE with CONFIGURED Radius miles 
			var circle = L.circle([lat, lon], {
				color: 'white',
				fillOpacity: 0.0,
				radius: radiusMeters 
			}).addTo(map);
			 
			//L.marker([lat, lon]).addTo(map);
			  
	        //3.Define map BOUNDS to show full circle / decide ZOOM level
		    var circlebounds = circle.getBounds(); 
			var corner1 = circlebounds.getSouthWest();
			var corner2 = circlebounds.getNorthEast();
			var maxBounds = [corner1, corner2];
			map.fitBounds(maxBounds);
			map.setZoom(map.getBoundsZoom(maxBounds));
			
			//4.Draw Counties BORDER lines
			 L.geoJson(countiesData, 
			 {
				style: function (feature) 
				{
					 return { fillColor: 'transparent', weight: 1, opacity: 1, color: 'white', dashArray: '1', fillOpacity: 0.0 };
				},
				   
				onEachFeature: function (feature, layer)
				{
					var coordinates = feature.geometry.coordinates[0];
					var i = 0
					var withInRadius = true;
					for(i = 0; i < coordinates.length; i ++)
					{
						var clon = coordinates[i][0];
						var clat = coordinates[i][1];
						
						if(circlebounds.contains([clat,clon]) == false){
							withInRadius = false;
						 }
						if (withInRadius == false) break;
					}
					if (withInRadius == true)
					{
						if (feature.properties.NAME.toUpperCase() === custCounty.toUpperCase())
						{
							
							L.geoJSON(feature, {
								style: function(feature) 
								{
								   return { weight: 4, opacity: 0.8, color: 'white',  fillOpacity: 0.0};
								}
							}).addTo(map);
						}
						if(showCountyName == "true")
						{
							 
							layer.bindTooltip(feature.properties.NAME, {direction: "center", permanent: true, className: "my-label", offset: [0, 0] }); 
						}
					}
			}
			}).addTo(map);
			   
			//5.TILES LAYER from tiles.telluslabs
		    var saturl =  document.getElementById("saturl").value;
			var lyr = L.tileLayer(saturl, {tms: true, opacity: 1, attribution: ""});
			lyr.addTo(map);
			 
			//6.Show / hide LEGEND based on the metricCode value.
 			if (metricCode == 'TELLUSCHIN')
			{
			    document.getElementById("legend1").style.display = "block";
			} 
			else if (metricCode == 'TLCHINFHAN')
			{
				document.getElementById("legend2").style.display = "block";
			}
   	}
 
 function styleCounty(feature)
 {		return {
		fillColor: 'transparent',
		color: 'green',
		weight: 14,
		opacity: 1,
		border: 'red'
		};   
 }
 //Style for counties borders
	function styleUSABorder(feature) 
	{
		return {
 			weight: 14,
			opacity: 1,
			color: 'red',
			fillOpacity: 0.0
		};
	}
 
	//Style for counties borders
	function style(feature) 
	{
		return {
 			weight: 1,
			opacity: 0.8,
			color: 'white',
			dashArray: '1',
			fillOpacity: 0.0
		};
	}
	
	function DrawUSAMap()
	{
			var lat = parseFloat(document.getElementById("lat").value);
			var lon = parseFloat(document.getElementById("lon").value);
			   
			//1.Draw Base map layer
			var osm = L.tileLayer('https://api.mapbox.com/styles/v1/indigoag-it/cjs3m68vm2ky81fqk1mx5vft9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaW5kaWdvYWctaXQiLCJhIjoiY2pydWxiMjRsMDl4MjQ0bDUxcjdkb2FxaCJ9.Jt2VXR5rX8dJSYq9yio5Hw', {attribution: ''});
     		var map = L.map('usamapid', { 
						center: [lat, lon], zoom: 3, minZoom: 1, maxZoom: 18, zoomControl:false, 
						layers: [osm]
			});
			  
			//2.Client Location marker 
			L.marker([lat, lon]).addTo(map);
			 
			//4.Tiles layer from tiles.telluslabs
			var saturl =  document.getElementById("saturl").value;
			var lyr = L.tileLayer(saturl, {tms: true, opacity: 1, attribution: ""});
			lyr.addTo(map);
 
			//5.Draw USA Border Line
			L.geoJson(usaBorderGeoJson[0].geojson,  {
						style: function (feature) {
						return { fillColor: 'transparent', weight: 2, opacity: 1, color: 'white', fillOpacity: 0.0 }; 
						 }}).addTo(map);
			  
			//6.Define USA map bounds
			var maxBounds = [[27.3648,-74.0318148], [47,-118.5542]];
 			map.setMaxBounds(maxBounds);
			map.fitBounds(maxBounds);
	}
	  
	function DisplayArrows() 
	{
			//Displays up/down arrows dynamically based on last and this year values 
			
			var p1Last = parseFloat(document.getElementById("p1-last").innerHTML);
			
			if(isNaN(p1Last))
				{document.getElementById("p1-last").innerHTML = 'N/A'}
			
			
			var p2Last = parseFloat(document.getElementById("p2-last").innerHTML);
			
			if(isNaN(p2Last))
				{document.getElementById("p2-last").innerHTML = 'N/A'}
			
			var p3Last = parseFloat(document.getElementById("p3-last").innerHTML);
			 
			
			if(isNaN(p3Last))
				{document.getElementById("p3-last").innerHTML = 'N/A'} 
			  
			var p1This = parseFloat(document.getElementById("p1-this").innerHTML);
			
			
			if(isNaN(p1This))
				{document.getElementById("p1-this").innerHTML = 'N/A'} 
			
			var p2This = parseFloat(document.getElementById("p2-this").innerHTML);
			
			if(isNaN(p2This))
				{document.getElementById("p2-this").innerHTML = 'N/A'} 
				
			var p3This = parseFloat(document.getElementById("p3-this").innerHTML);
			
			if(isNaN(p3This))
				{document.getElementById("p3-this").innerHTML = 'N/A'} 
			 
			if (p1Last > p1This)
			{
				document.getElementById("down1").style.display = "block";
			}
			else if (p1Last < p1This)
			{
				document.getElementById("up1").style.display = "block";
			} 
			if(p2Last > p2This)
			{
				document.getElementById("down2").style.display = "block";
			}
			else if (p2Last < p2This)
			{
				document.getElementById("up2").style.display = "block";
			}
			  
			if(p3Last > p3This)
			{
				document.getElementById("down3").style.display = "block";
			}
			else if (p3Last < p3This)
			{
				document.getElementById("up3").style.display = "block";
			} 
	}
 