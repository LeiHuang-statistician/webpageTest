function SpecCurve(data,fontSize,titpos, color,ydx) {

    d3.select("#loader").remove()

    const margin = { top: 60, right: 60, bottom: 50, left: 60 };
    const w = 600 - margin.left - margin.right;
    const h = 500 - margin.top - margin.bottom;
    // Create SVG
    const svg = d3.select("#roc-curve")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)

    var g = svg.append("g")
	        .attr("id","svg_g")
	        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([-0.05, 1.02]) //change 1.02 can change the space between data and top axis
        .range([0, w]);

    const yScale = d3.scaleLinear()
        .domain([-0.02, 1.02]) //change -0.02 can change the space between data and top axis
        .range([h, 0]);

    // Add axes
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${h})`)
        .call(
            d3.axisBottom(xScale)
            .ticks(5)
            .tickSizeOuter(0)
            .tickFormat(d3.format(".1f"))
        )
        .style("font-size", fontSize-1)
        .append("text")
        .attr("x", w/ 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .text(xlab)
        .style("font-size", fontSize);

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0).tickFormat(d3.format(".1f")))
        .style("font-size", fontSize-1)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -h / 2.6)
        .attr("fill", "#000")
        .text(ylab)
        .style("font-size", fontSize);

   g.append("g")
        .attr("class", "x2 axis")
        .attr("transform", `translate(${h,0})`)
        .call(
            d3.axisTop(xScale) //top axis
            .tickSize(0)
            .tickFormat(" ")
            .tickSizeOuter(0)
        )


   g.append("g")
        .attr("class", "y2 axis") //right axis
        .call(d3.axisRight(yScale).tickSize(0).tickSizeOuter(0).tickFormat(" "))
        .attr("transform", `translate(${0,w})`)


    // Add diagonal reference line
    g.append("line")
        .attr("class", "diagonal")
        .attr("x1", 0)
        .attr("y1", h )
        .attr("x2", w )
        .attr("y2", 0)
        .attr("stroke", "#ccc")
        .style("stroke-dasharray", "8,4")
        .attr("stroke-width", "1.5px")
        .attr("fill", "none");

    g.append("line")
      .attr("class", "diagonal")
      .attr("x1", 0)
      .attr("y1", 0)      // starts at top
      .attr("x2", w )
      .attr("y2", h )
      .attr("stroke", "#ccc")
      .style("stroke-dasharray", "8,4")
      .attr("stroke-width", "1.5px")
      .attr("fill", "none");

    // Create line generator and draw sensitivity curve
    const lineSen = d3.line()
        .x(d => xScale(d.prob))
        .y(d => yScale(d.tpr));

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineSen)
        .style("stroke", 'blue')
        .attr("stroke-width","1.5px")
        .attr("fill", "none");

   // Create line generator and  draw spec curve
    const lineSpec = d3.line()
        .x(d => xScale(d.prob))
        .y(d => yScale(d.specificity));

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineSpec)
        .attr("stroke", 'green')
        .attr("stroke-width","1.5px")
        .attr("fill", "none");

    if (ydx===1){
           // Create line generator and  draw youden curve
        const lineYoud = d3.line()
            .x(d => xScale(d.prob))
            .y(d => yScale(d.youden));

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", lineYoud)
            .style("stroke", 'red')
            .attr("stroke-width","1.5px")
            .attr("fill", "none");
    }

//**********title*************//
    var til=g.append('g')
      .attr('class','title')
      til.selectAll(".tiltext").data(title)
      .enter()
       .append('text')
       .attr("class", "tiltext")
      .text(d=>d)
      .style('font-family','Helvetica')
      .style("text-anchor", "middle")
      .attr('dy', -15)
      .attr('transform',(d,i)=> `translate( ${titpos-50}, ${(-20*i)})`)
      .style("font-size", function(d,i){return (fontSize)+(i*1)})
      .style('font-weight', (d,i)=>i<title.length-1 ? 300:700)
      .style('font-style', (d,i)=>i<title.length-1 ? "italic":"normal");

//********************lengend**************************
// 2. Create legend data
const legendData = color.domain();

// 3. Add legend group
const legend = g.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${w  - 100},20)`); // Position in top-right

// 4. Create legend items
const legendItems = legend.selectAll(".legend-item")
  .data(legendData)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(-50,${i * 20})`); // Space items vertically

legendItems.append("line")
   .attr("x1", 0)            // Start at left edge
   .attr("y1", 10)          // Y-position (constant)
   .attr("x2", "5%")       // Stretch to full width
   .attr("y2", 10)
   .attr("transform",  `translate(-8,0)`)
     .style("stroke", d => color(d));

// 6. Add text labels
legendItems.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", "0.35em")
  .text(d => d)
  .style("font-size", "16px")
  .style("font-family", "sans-serif");



	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////


  const svgS=document.getElementById("roc-curve")
  const {x,y,width,height}=svgS.viewBox.baseVal;
  var svgData = $("#roc-curve")[0].outerHTML;
  var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  const image=document.createElement('img');
  image.src=svgUrl
  //console.log(svgUrl)

  image.addEventListener('load', ()=>{
      canvas=document.createElement('canvas')
      canvas.width=width;
      canvas.height=height;
      context=canvas.getContext('2d')
      context.drawImage(image,x,y,width, height)
      //console.log('context',context)
      const link=document.getElementById('link');
      link.href=canvas.toDataURL();
      //console.log(link)
      URL.revokeObjectURL(svgUrl);
  })


  function printToCart2( ) {
    let popupWinindow;
    let innerContents = document.getElementById("roc-curve").outerHTML;
    popupWinindow = window.open();
    popupWinindow.document.open();
    popupWinindow.document.write('<body onload="window.print()">' + innerContents );
    popupWinindow.document.close();
  }
  document.querySelector("#download").onclick = function(){
  printToCart2()
  }

}
