function svgdiv(){
    let  svgUrl0=[];
    d3.csv("heatmap_data.csv").then(function (data) {
   

// set the dimensions and margins of the graph
var margin = {top: 80, right: 25, bottom: 30, left: 40};
var width = 450 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#svgdiv")
.append('svg')
.attr('id', 'svg1')
.attr('xmlns','http://www.w3.org/2000/svg')
.attr('viewbox',"10 0 400 460")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data

//console.log(data)

// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
var myGroups = d3.map(data, function(d){return d.group;})
var myVars = d3.map(data, function(d){return d.variable;})

// Build X scales and axis:
var x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.05);
svg.append("g")
.style("font-size", 15)
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).tickSize(0))
.select(".domain").remove()

// Build Y scales and axis:
var y = d3.scaleBand()
.range([ height, 0 ])
.domain(myVars)
.padding(0.05);
svg.append("g")
.style("font-size", 15)
.call(d3.axisLeft(y).tickSize(0))
.select(".domain").remove()

// Build color scale
var myColor = d3.scaleSequential()
.interpolator(d3.interpolateInferno)
.domain([1,100])


        
// create a tooltip
var tooltip = d3.select("#svgdiv")
.append("div")
.style("position", "absolute")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  tooltip
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}
var mousemove = function(d,i) {
    //console.log($(this).position())
  tooltip
    .html("The exact value of<br>this cell is:"+ i.value)
    .style("left", ($(this).position().left+70))
    .style("top", ($(this).position().top))
}
var mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}

        
svg.selectAll()
.data(data)
.enter()
.append("rect")
    .attr("x", function(d) { return x(d.group) })
    .attr("y", function(d) { return y(d.variable) })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(d.value)} )
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)        
        
        
        
            
// Add title to graph
svg.append("text")
.attr("x", 0)
.attr("y", -50)
.attr("text-anchor", "left")
.style("font-size", "22px")
.text("A d3.js heatmap");

// Add subtitle to graph
svg.append("text")
.attr("x", 0)
.attr("y", -20)
.attr("text-anchor", "left")
.style("font-size", "14px")
.style("fill", "grey")
.style("max-width", 400)
.text("A short description of the take-away message of this chart.");
         
const svgS=document.getElementById("svg1")
const {xs,ys,ws,hs}=svgS.viewBox.baseVal;
var svgData = $("#svg1")[0].outerHTML;

//console.log(svgData)
var svgBlob= new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});


var svgUrl = URL.createObjectURL(svgBlob);
// const image=document.createElement('img');
// image.src=svgUrl
var img_png= d3.select('#jpg-export');
img_png.attr("src", svgUrl)

//$("#svgdiv").remove(); /*delete svg*/


})

}
