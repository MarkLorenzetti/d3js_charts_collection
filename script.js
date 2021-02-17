	const dataset1 = 'data/artists-popularity.csv';
	const dataset2 = 'data/loudness_by_year.csv';
	const dataset3 = 'data/beatles_rolling_stones.csv'
	const svg1 = d3.select('#graph1');
	const svg2 = d3.select('#graph2');
	const svg3 = d3.select('#graph3');
/////////////////////////////// - graph 1 - /////////////////////////////////////////

const width1 = +svg1.attr('width');
const height1 = +svg1.attr('height');

const render1 = data =>{
	const xValue = d => d.artists;
	const yValue = d => d.popularity;

	//The margin convention: making room for axes
	const margin1 = {top: 50, right: 50, bottom: 150, left: 150};
	const innerWidth1 = width1 - margin1.left - margin1.right;
	const innerHeight1 = height1 - margin1.top - margin1.bottom;

	//input-output mapping
	const xScale = d3.scaleBand()
		.domain(data.map(xValue))
		.range([0, innerWidth1])
		.padding(0.1);

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data, yValue)])
		.range([innerHeight1, 0]);

	const g = svg1.append('g')
		.attr('transform', `translate(${margin1.left},${margin1.top})`);

	const yAxes = d3.axisLeft(yScale)
		.tickFormat(d3.format('.2s'))

	g.append('g').call(yAxes)
		.selectAll("text")
		.attr('class', 'axis-label')
		//.attr("x", -1);
		//.tickSize(-innerHeight);

	const xAxisG = g.append('g').call(d3.axisBottom(xScale))
		.attr('transform', `translate(0,${innerHeight1})`)
		
	xAxisG.selectAll("text")
			.attr('class', 'axis-label')
		    .attr("transform", "translate(0)rotate(-45)")
		    //.attr("x", 5)
		    .style("text-anchor", "end");

	xAxisG.append('text')
		.attr('class', 'axis-label')
		.attr('y', -50)
		.attr('x', 120)
		.attr("transform", "translate(0)rotate(-90)")
		.attr('fill', 'black')
		.text("popularity");
		    
	g.selectAll('.domain').remove();
		
	//bars
	g.selectAll('rect').data(data)
		.enter().append('rect')
		.attr("class", "bar")
        .on("mouseover", onMouseOver) //Add listener for the mouseover event
        .on("mouseout", onMouseOut)   //Add listener for the mouseout event
		.attr('x', d => xScale(xValue(d)))
		.attr('y', d => yScale(0)) //Starting point before the effect
		.attr('height', d => innerHeight1 - yScale(0))// value = 0
		.attr('width', xScale.bandwidth())

	// Animation
	g.selectAll('rect')
		.transition()
	    .ease(d3.easeLinear)
	    .duration(400)
	    .attr('y', d => yScale(yValue(d))) //Ending point after the effect
	    .attr('height', d => innerHeight1 - yScale(yValue(d))) // value in accordance to the values
	    .delay(function (d, i) {
	        return i * 200;
    })

	g.append('text')
		.attr('x', innerWidth1 / 3) //380
		.attr('y', -20)
		.text("Top 15 most popular bands");

	//mouseover event handler function
	function onMouseOver(d, i) {
	    d3.select(this).attr('class', 'highlight');
	    d3.select(this)
	      .transition()
	      .duration(400)
	      .attr('width', xScale.bandwidth() + 5)
	      .attr("y", function(d) { return yScale(d.popularity) - 10; })
	      .attr("height", function(d) { return innerHeight1 - yScale(d.popularity) + 10; });

	    g.append("text")
	     .attr('class', 'val') // add class to text label
	     .attr('x', function() {
	         return xScale(d.artists);
	     })
	     .attr('y', function() {
	         return yScale(d.popularity) - 15;
	     })
	     .text(function() {
	         return d.popularity;  // Value of the text
	     });
	}

    //mouseout event handler function
    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', xScale.bandwidth())
          .attr("y", function(d) { return yScale(d.popularity); })
          .attr("height", function(d) { return innerHeight1 - yScale(d.popularity); });
        d3.selectAll('.val')
          .remove()
    	}

	};

	d3.csv(dataset1, function(data) {
		for(i = 0; i < data.length; i++){
			data[i].popularity = +data[i].popularity;
			}
			render1(data);
	});

/////////////////////////// - graph 2 - ////////////////////////////////////////////////

const width2 = +svg2.attr('width');
const height2 = +svg2.attr('height');

const render2 = data =>{

	const xValue = d => d.year;
	const yValue = d => d.loudness;
	
	//The margin convention: making room for axes
	const margin2 = {top: 50, right: 50, bottom: 50, left: 150};
	const innerWidth2 = width2 - margin2.left - margin2.right;
	const innerHeight2 = height2 - margin2.top - margin2.bottom;

	//date-time parsing
	const parseDate = d3.timeFormat("%Y");
	const parseLoud = d3.format(".1f");

	//input - output mapping
	const xScale = d3.scaleTime()
		.domain(d3.extent(data, xValue))
		.range([0, innerWidth2])

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, yValue))
		.range([innerHeight2, 0]);

	//Axis referencies
	const g = svg2.append('g')
		.attr('transform', `translate(${margin2.left},${margin2.top})`);

	g.append('g').call(d3.axisLeft(yScale))
	
	const xAxisG = g.append('g').call(d3.axisBottom(xScale))
		.attr('transform', `translate(0,${innerHeight2})`)

	xAxisG.append('text')
		.attr('class', 'axis-label')
		.attr('y', -40)
		.attr('x', innerWidth2 / 4)
		.attr("transform", "translate(0)rotate(-90)")
		.attr('fill', 'black')
		.text("Loudness");

	// Define the div for the tooltip
	const div = d3.select("body").append("div")
		.append('text')
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

	//add the circles
		const dots = svg2.selectAll("dot")	
		    .data(data)			
		    .enter().append("circle")
		    	.style("opacity", .5)							
		        .attr("r", 4)		
		        .attr("cx", d => xScale(xValue(d))+margin2.left)		 
		        .attr("cy", d => yScale(yValue(d))+margin2.top)
		        .on("mouseover", onmouseover)
		        .on("mouseout", onmouseout);

	//circles on/off
	$( "#graph2" ).click(function() {
	  $( "circle" ).toggle();
	});

	//input -output line generator
	const lineGenerator = d3.line()
		.x(d => xScale(xValue(d)))
		.y(d => yScale(yValue(d)))
		//.curve(d3.curveBasis);

	//drawing the line
	const path = g.append('path')
				.attr('class', 'simple-line-path')
				.attr('d', lineGenerator(data));

	const totalLength = path.node().getTotalLength();

	//Scroll activation 
	$(window).scroll(function(){
    	var wh = $(window).height()-50;
        if($(window).scrollTop() > $('#graph2').offset().top-wh){
			path
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
		      .transition()
			        .duration(4000)
			        .ease(d3.easeLinear)
			        .attr("stroke-dashoffset", 0);
      	}
    });

	//Title of the graph
    g.append('text')
		.attr('x', innerWidth2 / 3)
		.attr('y', -20)
		.text("Loudness over the time");

	//tooltip handler
	function onmouseover(d){
		div.transition()		
            .duration(200)		
            .style("opacity", .8);		
        div.html("Year: " + parseDate(xValue(d)) + "<br/>" + "loudness: " + parseLoud(yValue(d)))
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px")
        }

    function onmouseout(d){
 		div.transition()		
	        .duration(500)		
	        .style("opacity", 0);
		}
	}

	d3.csv(dataset2, function(data){
	for(i=0; i<data.length; i++){
		data[i].loudness = +data[i].loudness;
		const aDate = new Date(data[i].year)
		data[i].year = aDate;		
		}
		render2(data);
	});

/////////////////////////////// - graph 3 - /////////////////////////////////////////

const width3 = +svg3.attr('width');
const height3 = +svg3.attr('height');

const render3 = data =>{

	const xValue = d => d.release_date;
	const yValue = d => d.popularity;
	const colorValue = d => d.artists;

	//The margin convention: making room for axes
	const margin3 = {top: 50, right: 50, bottom: 50, left: 150};
	const innerWidth3 = width3 - margin3.left - margin3.right;
	const innerHeight3 = height3 - margin3.top - margin3.bottom;

	//date-time parsing
	const parseDate = d3.timeFormat("%Y");
	const parseLoud = d3.format(".1f");

	const xScale = d3.scaleTime()
		.domain(d3.extent(data, xValue))
		.range([0, innerWidth3])

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, yValue))
		.range([innerHeight3, 0])
		.nice();

	const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

	const g = svg3.append('g')
		.attr('transform', `translate(${margin3.left},${margin3.top})`);

	// Add Y axis
	g.append('g').call(d3.axisLeft(yScale))

	.append('text')
		.attr('class', 'axis-label')
		.attr('y', -35)
		.attr('x', -innerHeight3/2)
		.attr('transform', `rotate(-90)`)
		.attr('text-anchor', 'middle')
		.text("popularity");

	// Add X axis
	g.append('g').call(d3.axisBottom(xScale))
		.attr('transform', `translate(0,${innerHeight3})`)

	const lineGenerator = d3.line()
		.x(d => xScale(xValue(d)))
		.y(d => yScale(yValue(d)))
		//.curve(d3.curveBasis);
	
	const nested = d3.nest()
		.key(d => d.artists)
		.entries(data);
	
	colorScale.domain(nested.map(d => d.key));

	// Define the div for the tooltip
	const div = d3.select("body").append("div")
		.append('text')
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

	//points on click with values
		//add the circle
		const dots = svg3.selectAll("dot")	
		    .data(data)			
		    .enter().append("circle")
		    	.style("opacity", .5)							
		        .attr("r", 4)		
		        .attr("cx", d => xScale(xValue(d))+margin3.left)		 
		        .attr("cy", d => yScale(yValue(d))+margin3.top)
		        .on("mouseover", onmouseover)					
		        .on("mouseout", onmouseout);

      	//circles on/off
	$( "#graph3" ).click(function() {
	  $( "circle" ).toggle();
	});

	const path2 = g.selectAll('.line-path').data(nested)
				.enter().append('path')
				.attr('class', 'line-path')
				.attr('d', d => lineGenerator(d.values))
				.attr('stroke', d => colorScale(d.key))
				
	const totalLength2 = path2.node().getTotalLength()*(2);

	$(window).scroll(function(){
    	const wh = $(window).height()-50;
    	let blockAnimation = true;
        if($(window).scrollTop() > $('#graph3').offset().top-wh){
    		path2
		      .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
		      .attr("stroke-dashoffset", totalLength2)
		      .transition()
		        .duration(4000)
		        .ease(d3.easeLinear) //d3.easeSin
		        .attr("stroke-dashoffset", 0);
      		}
    	});

	g.append('text')
		.attr('class', 'title')
		.attr('x', innerWidth3/3)
		.attr('y', -20)
		.text("The Beatles or the Rolling Stones?");

		function onmouseover(d){
		div.transition()		
            .duration(200)		
            .style("opacity", .8);		
        div.html("Year: " + parseDate(xValue(d)) + "<br/>" + "Popularity: " + parseLoud(yValue(d)))
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px")
        }

    function onmouseout(d){
 		div.transition()		
	        .duration(500)		
	        .style("opacity", 0);
		}
	}

	d3.csv(dataset3, function(data){

		for(i=0; i<data.length; i++){
			data[i].popularity = +data[i].popularity;
			const aDate = new Date(data[i].release_date)
			data[i].release_date = aDate;
		}
		render3(data);
	});