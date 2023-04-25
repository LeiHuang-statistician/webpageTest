function htmplot(){
    

// set the dimensions and margins of the graph
// append the svg object to the body of the page
var svg = d3.select("#svg1")
  .attr("width", widthA + margin.left + margin.right)
  .attr("height", heightA + margin.top + margin.bottom)
  .append('g')
  .attr('id', 'svg-forestplot')
  .attr('transform', `translate(${margin.left},${margin.top})`)

//Read the data

//console.log(data)
  // Labels of row and columns -> unique identifier of the column called 'xlabel' and 'ylabel'
  var myGroups = d3.map(data, function(d){return d.xlabel;})
  var myVars = d3.map(data, function(d){return d.ylabel;})

  // Build X scales and axis:
  var xb = d3.scaleBand()
    .range([ 0, widthA ])
    .domain(myGroups)
    .padding(0.01);
  svg.append("g")
    .attr('id','xband')
    .style("font-size", labfontsize)
    .attr("transform", "translate(0," + heightA + ")")
    .call(d3.axisBottom(xb).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var yb = d3.scaleBand()
    .range([ heightA, 0 ])
    .domain(myVars)
    .padding(0.01);
  svg.append("g")
    .attr('id','yband')
    .style("font-size", labfontsize)
    .call(d3.axisLeft(yb).tickSize(0))
    .select(".domain").remove()
 

  // Build color scale
  myColor = d3.scaleSequential()
  .interpolator(colortheme)
  .domain([rmin,rmax])

  // add the squares
  svg.selectAll()
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return xb(d.xlabel) })
      .attr("y", function(d) { return yb(d.ylabel) })
      .attr("rx", 0) /*box radiu*/
      .attr("ry", 0)
      .attr("width", xb.bandwidth())
      .attr("height", yb.bandwidth())
      .style("fill", d=>+d.value===99999? "white":myColor(d.value) )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
   

      svg.selectAll()
      .data(data)
      .enter()
      .append("text")
        .attr("x", function(d) { return xb(d.xlabel) })
        .attr("y", function(d) { return yb(d.ylabel) })
        .text(d=>logr==="OD"? (+d.value).toFixed(1) : logr==="TD" ? (+d.value).toFixed(2) : d.value )
        .style("text-anchor", "middle")
        .style("font-size",labfontsize)
        .style("fill",function(d){
                        // pct=percentRank(eff,d.value)
                        // if (pct<0.95) {return "black"}
                        if (+d.value===99999){return 'white'}
                        return "black"
                      })
        .style("opacity", d=>vls===1? 1 : 0)
        .attr('transform', `translate(${xb.bandwidth()/2},${yb.bandwidth()/2})`)
     
      

    


           var colors=[]
           for (var i=rmax;i>=rmin;i--){
               color=myColor(i)
               colors.push(color)
           }


        var grad = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
      
      grad.selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
          return 100 * (i / (colors.length - 1)) + '%';
        })
      
      svg.append('rect')
        .attr('width', 20)
        .attr('height', yb.bandwidth()*(varn-1))  /*panel height*/
        .style('fill', 'url(#grad)')
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .attr('transform', `translate(${paneltr},${yb.bandwidth()/2})`)
      
        var xA = d3.scaleLinear()
        .domain([rmax,rmin])
        .range([0, yb.bandwidth()*(varn-1)])    /*right axis height*/
        .nice()
        var xAxis = d3.axisRight(xA)
        .ticks(5)
        .tickSize(0)

        xAxidsG=svg.append('g')
        .attr("id", "xAxidsG")
        .attr("class", "xAxidsG")
        .style("font-size",labfontsize-1)
        .attr('transform', `translate(${paneltr+20},${yb.bandwidth()/2})`)
        .call(xAxis)
        .select(".domain").remove()



// Add title to graph

var til=svg.append('g')
.attr('class','title')

svg.selectAll(".tiltext").data(title)
.enter()
 .append('text')
 .attr("class", "tiltext")
.text(d=>d)
.style('font-size', titlefontsize)
.style('font-weight', 300)
.style('font-family','Helvetica')
.style("text-anchor", "middle")
.attr('dy', -10)
.attr('transform',(d,i)=> `translate( ${titpos}, ${(-20*i)})`)

// d3.selectAll("#yband .tick text")
//    .attr("transform","rotate(-45deg)")
//$("#yband .tick text").css("transform", "rotate(-45deg)");

  const svgS=document.getElementById("svg1")
  const {x,y,width,height}=svgS.viewBox.baseVal;
  var svgData = $("#svg1")[0].outerHTML;
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
    let innerContents = document.getElementById("svg1").outerHTML;
    popupWinindow = window.open();
    popupWinindow.document.open();
    popupWinindow.document.write('<body onload="window.print()">' + innerContents );
    popupWinindow.document.close();
  }
  document.querySelector("#download").onclick = function(){
  printToCart2()
  }

  $('#rmin').val(rmin);
  $('#rmax').val(rmax);
  $("#loader").hide();
}
