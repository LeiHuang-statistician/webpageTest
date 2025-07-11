function RocCurve(data,fontSize,auc,AUC_show,point,titpos) {

    d3.select("#loader").remove()

    const margin = { top: 60, right: 60, bottom: 50, left: 60 };
    const w = 600 - margin.left - margin.right;
    const h = 500 - margin.top - margin.bottom;
    // Create SVG
    const svg = d3.select("#roc-curve")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .attr("filter", null);

    var g = svg.append("g")
	        .attr("id","svg_g")
	        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([-0.05, 1.05])
        .range([0, w]);

    const yScale = d3.scaleLinear()
        .domain([-0.05, 1.05])
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
        .attr("x", w / 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .text("1-Specificity")
        .style("font-size", fontSize);

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0).tickFormat(d3.format(".1f")))
        .style("font-size", fontSize-1)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -h / 2)
        .attr("fill", "#000")
        .text("Sensitivity")
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
        .attr("y1", h)
        .attr("x2", w)
        .attr("y2", 0)
        .attr("stroke", "#ccc")
        .style("stroke-dasharray", "8,4")
        .attr("stroke-width", "1.5px")
        .attr("fill", "none");

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.fpr))
        .y(d => yScale(d.tpr));

    // Draw ROC curve
    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", "steelblue")
        .attr("stroke-width","1.5px")
        .attr("fill", "none")



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
      .attr('transform',(d,i)=> `translate( ${titpos-58}, ${(-20*i)})`)
      .style("font-size", function(d,i){return (fontSize+1)+(i*1)})
      .style('font-weight', (d,i)=>i<title.length-1 ? 300:700)
      .style('font-style', (d,i)=>i<title.length-1 ? "italic":"normal");


   if (AUC_show==1){
        // Add AUC text
        g.append("text")
            .attr("x", w - 200)
            .attr("y", 20)
            .attr("text-anchor", "end")
            .text(`AUC: ${auc.toFixed(3)}`);
    }
   if (point==1){
                // Add points for each threshold
                g.selectAll(".point")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("cx", d => xScale(d.fpr))
                    .attr("cy", d => yScale(d.tpr))
                    .attr("r", d=>d.marker==1? 3.5: 0)
                    .attr("fill", "red")
                    .attr("stroke",'red')
                    .style("stroke-opacity", 1)
                    .style("fill-opacity", 0)
                    .style("stroke-width",'1px');

            const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")




            g.selectAll(".point")
            .on("mouseover", function(event, d) {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY-60}px`)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9);
                    tooltip.html(`
                        FPR: ${d.fpr.toFixed(3)} (1 - Spec)<br/>
                        TPR: ${d.tpr.toFixed(3)} (Sensitivity)<br/>
                        Specificity: ${(1 - d.fpr).toFixed(3)}
                    `);
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
   }


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