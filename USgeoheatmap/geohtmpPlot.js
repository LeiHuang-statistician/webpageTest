
function geohtmp(){
    var path = d3.geoPath();
    var myColor = d3.scaleSequential()
                    .interpolator(colortheme)
                    .domain([rmin,rmax])

    var svg = d3.select("#svg")
      .attr("width", widthA + margin.left + margin.right)
      .attr("height", heightA + margin.top + margin.bottom)
      .append('g')
      .attr('id', 'svg-forestplot')
      // .attr('transform', `translate(${margin.left+80},${margin.top+30})`)
    
       stateG=d3.select("#svg-forestplot")
              .append('g')
             .attr("class", "states")
    
    //
       stateG.selectAll(".pathid")
        .data(states.features)
        .enter()
        .append('g')
        .attr('class','pathid')
        .attr('id', (d,i)=>`pathid${i}`)
        .append("path")
          .attr("d", path)
          .attr("stroke","black")
          .attr("fill", d=>ctl===1? "none":+d.properties.value===99999? "black" : myColor(+d.properties.value))
              .append('title')
              .text(d=>`Map : ${d.properties.name} : ${d.id} , Your dataset: ${d.properties.FIPS}, value: ${d.properties.value}`);

    
        svg.append("g")
          .attr("class", "counties")
          .selectAll("path")
          .data(counties.features)
          .enter().append("path")
          .attr("d", path)
          .attr("fill", d=>{ if (ctl===1) {
                                if (+d.properties.value===99999 || d.properties.FIPS===undefined) {return "black"}
                                 else if (+d.properties.value<=crmax && +d.properties.value>=crmin) {return myColor(+d.properties.value)}
                                 else {return 'white'}
                            } else {return "none"}
                           })
              .append('title')
              .text(d=>`Map : ${d.properties.name} : ${d.id} , Your dataset: ${d.properties.FIPS}, value: ${d.properties.value}`);
    
        if (ctl===1){
          svg.append("path")
              .attr("class", "county-borders")
              .attr("d", path(countiesborder))
              .style("fill", "none")
        }
    
          svg.append("path")
              .attr("class", "state-borders")
              .attr("d", path(statesborder))
              .style("fill", "none")
              .style("stroke","black")
              .style("stroke-width",0.5);
    
          svg.selectAll("text")
                .data(states.features)
                .enter()
                .append("text")
                .attr("fill", "black")
                .style('font-family','Helvetica')
                .style('font-weight', 700)
                .style("font-size",fontsize)
                .attr("transform", function(d) {
                    var stl;
                     stl=stlabel(d.properties.name.toUpperCase())
                    var centroid = path.centroid(d);
                    if (stl==="FL") {return `translate(${centroid[0]+10},${centroid[1]})`}
                    if (stl==="DC") {return `translate(${centroid[0]},${centroid[1]+5})`}
                    if (stl==="MD") {return `translate(${centroid[0]},${centroid[1]-10})`}
                    if (stl==="DE") {return `translate(${centroid[0]+5},${centroid[1]})`}
                    if (stl==="RI") {return `translate(${centroid[0]+5},${centroid[1]+3})`}
                    if (stl==="LA") {return `translate(${centroid[0]-5},${centroid[1]})`}
                    if (stl==="NH") {return `translate(${centroid[0]+5},${centroid[1]})`}
                    return `translate(${centroid[0]},${centroid[1]})`
                })
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .text(d=>{
                     var stl;
                     stl=stlabel(d.properties.name.toUpperCase())
                     return stl})
                .style("opacity", d=>vls===1? 1 : 0)


        var gap=(rmax-rmin)/100
        var colors=[]
           for (var i=rmax;i>=rmin;){
                i=i-gap
               color=myColor(i)
               colors.push(color)
           }
        colors.reverse()
//        eff.sort(function(a, b) {
//          return a - b;
//        });
//
//        //console.log('eff',eff)
//
//        var colors=[]
//        eff.forEach(function(d){
//        color=myColor(d)
//        colors.push(color)
//        })

          var grad = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'grad')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%');

          grad.selectAll('stop')
            .data(colors)
            .enter()
            .append('stop')
            .style('stop-color', function(d){ return d; })
            .attr('offset', function(d,i){
              return 100 * (i / (colors.length - 1)) + '%';
            })

          svg.append('rect')
            .attr('width', 750)
            .attr('height',20)  /*panel height*/
            .style('fill', 'url(#grad')
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr('transform', `translate(100,680)`)

          var xA = d3.scaleLinear()
            .domain([rmin, rmax])
            .range([0, 750])    /*right axis height*/
            .nice()
          var xAxis = d3.axisBottom(xA)
            .ticks(6)
            .tickSize(0)

          xAxidsG=svg.append('g')
            .attr("id", "xAxidsG")
            .attr("class", "xAxidsG")
            .style("font-size",fontsize-2)
            .attr('transform', `translate(100,703)`)
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
            .style('font-size', fontsize)
            .style('font-weight', 600)
            .style('font-family','Helvetica')
            .style("text-anchor", "left")
            .attr('dy', -10)
            .attr('transform',(d,i)=> `translate( ${titpos},680)`)
    
    
      const svgS=document.getElementById("svg")
      const {x,y,width,height}=svgS.viewBox.baseVal;
      var svgData = $("#svg")[0].outerHTML;
      var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      var svgUrl = URL.createObjectURL(svgBlob);
      const image=document.createElement('img');
      image.src=svgUrl
      //console.log(svgData)
    
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
        let innerContents = document.getElementById("svg").outerHTML;
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
    
    