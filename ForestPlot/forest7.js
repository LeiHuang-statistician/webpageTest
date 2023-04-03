


function csvToJSON(csvDataString){
          const rowsHeader = csvDataString.split('\r').join('').split('\n')
          const headers = rowsHeader[0].split(',');
          const content = rowsHeader.filter((_,i) => i>0);
          //console.log('Headers: ',headers);
          const jsonFormatted = content.map(row => {
              const columns = row.split(',');
              return columns.reduce((p,c, i) => {
                  p[headers[i]] = c;
                  return p;
              }, {})
          })
          console.log('jsonFormatted:',jsonFormatted);
          // here you have the JSON formatted
          return jsonFormatted.filter(function(x) {
                  return x[headers[0]] !== "" ;
                      });
      }
   function makestring(arr,name){
         var vals=[];
              for(var i=0;i<arr.length;i++){
                 vals.push(arr[i][name]);
                      }

           var valsfilter = vals.filter(function(x) {
                  return x !== undefined ;
                      })
           var valsfilter2 = valsfilter.filter(function(x) {
                  return x !== "" ;
                      })
               return valsfilter2;
      }





function svggraph(){
   var svg = d3.select('#svg')
     .style('background-color','white')
     .append('g')
     .attr('id', 'svg-forestplot')
     .attr("transform", `translate(${margin.left} ,${margin.top})`)


    var bg = svg.append('g')
    .attr('id','bg')
    bg.selectAll('.bgrow').data(data)
       .enter()
       .append('rect')
       .attr('class','bgrow')
       .attr('height', rowHeight)
       .attr('width', widthA)
       .attr('x', 0)
       .attr('y', 0)
       .attr('fill', (d, i) => { return (i % 2 === 0)? bgc2: bgc1 })
       .attr('transform', (d, i) =>`translate( 0, ${rowHeight * i+rowHeight/5-5})`);



    var disc = svg.append('g')
    .attr('id','disc')

    disc.selectAll('.discrow').data(data)
        .enter()
        .append('text')
        .attr('class','discrow')
        .text(function(d){
                      var des=d.description.toString();
                     if (des.includes("|comma|")){
                           des=des.replace("|comma|",",")
                     }
                     if (des.includes(">=")){
                           des='\u2265'+des.replace(">=","")
                     }
                     if (des.includes("blank")){
                           des=des.replace("blank","")
                     }

                     if (des.includes("|%")){
                           console.log("des",des)
                           arr=des.match(/\|%[a-zA-Z0-9]+\|/g)
                           console.log("arr",arr)
                           for (var i=0;i<arr.length;i++){
                            var repl=arr[i].split("|")[1]
                               console.log("repl",repl)
                               des=des.replace(arr[i],unescape(repl))
                           }

                     }
                       return des;
                         })
        .style("font-weight",d=>d.descriptionWeight=="bold"?700:300)
        .style('font-size', 12)
         .style('font-family','Helvetica')
         .attr('dy', 18)
         .attr('dx', d=>10+paddingLeft*d.descriptionOffset)
         .attr('transform', (d, i) =>`translate( ${discval}, ${rowHeight * i-5})`)



//**********title*************//

    var til=svg.append('g')
      .attr('class','title')

      til.selectAll(".tiltext").data(title)
      .enter()
       .append('text')
       .attr("class", "tiltext")
      .text(d=>d)
      .style('font-size', 12)
      .style('font-weight', 700)
      .style('font-family','Helvetica')
      .style("text-anchor", "middle")
      .attr('dy', -10)
      .attr('transform',(d,i)=> `translate( ${titpos}, ${(-15*i)})`)


    var plot = svg.append('g')
       .attr('id','plot')
       .attr('class','plocontainer')
       .attr('transform', `translate( ${plotval}, 0)`)



//**********xlabel*************//
     var xlab=plot.append('g')
      .attr('class','xlab')

      xlab.selectAll(".xlabtext").data(xlabel)
      .enter()
       .append('text')
       .attr("class", "xlabtext")
      .text(d=>d)
      .style('font-size', 10)
      .style('font-weight', 700)
      .style('font-family','Helvetica')
      .style("text-anchor", "middle")
      .attr('dy', coln*rowHeight+30)
      .attr('transform',(d,i)=> `translate( ${widthA/6.5}, ${(-15*i)})`)



    var xA = d3.scaleLinear()
    .domain([rMin, rMax])
    .range([0, widthA * plotWidth])
    .nice()


console.log("domain", xA.domain())
console.log("ticks",xA.ticks())



   /****vtical background*/
    var vbg = plot.append('g')
    .attr('id','vbg')
    .attr('transform', `translate( 0, 0)`)
    vbg.selectAll('.vbgrow').data([1])
       .enter()
       .append('rect')
       .attr('class','vbgrow')
       .attr('height', lc-60)
       .attr('width', 238)
       .attr('x', 0)
       .attr('y', 0)
       .attr('fill', "grey")
       .style('opacity',vbgopc)



    plot.selectAll('.line').data(data)
       .enter()
       .append('line')
       .attr('class','plotline')
       .attr('x1',d=>xA(d.low))
       .attr('x2',d=>xA(d.high))
       .attr('y1', rowHeight / 2)
       .attr('y2', rowHeight / 2)
       .attr('stroke-width', 1)
       .attr('stroke', 'black')
       .attr('transform', (d, i) =>`translate( 2.5, ${rowHeight * i})`);

 /*small box*/
//    plot.selectAll('.rect').data(data)
//      .enter()
//      .append('rect')
//      .attr('height', 6)
//      .attr('width', 6)
//      .attr('x', d=>xA(d.effect))
//      .attr('y',7)
//      .attr('transform', (d, i) =>`translate( 2.5, ${rowHeight * i})`);

//'M 10 0 20 10 10 20 0 10 Z'
//Diamond:'M 0 -5 10 0 0 5 -10 0 Z'
//Small diamond:'M 0 -5 5 0 0 5 -5 0 Z'
//square:'M 5 -5 5 5 -5 5 -5 -5 Z'
//triangle:`M 0 -4 -4 4 0 4 4 4 Z`


selfMadeSqare=(dsize)=>{return `M ${dsize} -${dsize} ${dsize} ${dsize} -${dsize} ${dsize} -${dsize} -${dsize} Z`}
selfMadeDiamondLong=(dsize)=>{return `M 0 -${dsize} ${dsize*2} 0 0 ${dsize} -${dsize*2} 0 Z`}
selfMadeDiamondshort=(dsize)=>{return `M 0 -${dsize} ${dsize} 0 0 ${dsize} -${dsize} 0 Z`}
selfMadeTriangle=(dsize)=>{return `M 0 -${dsize} -${dsize} ${dsize} 0 ${dsize} ${dsize} ${dsize} Z`}
pathCircle = d3.path()

//var sym = d3.symbol()
//            .type(d3.symbolTriangle).size(50);
    plot.selectAll('.rect').data(data)
      .enter()
      .append("path")
      .attr("d", d=>{
                 if (csr=="No") {return selfMadeSqare(dsize)}
                 if (csr=="Yes") {
                 if ((d.symboltype).toLowerCase()=="s") {return selfMadeSqare(+d.symbolsize)}
                 if ((d.symboltype).toLowerCase()=="t") {return selfMadeTriangle(+d.symbolsize)}
                 if ((d.symboltype).toLowerCase()=="c") {
                     pathCircle.arc(0, 0, +d.symbolsize, 0,360)
                     return pathCircle}
                 if (d.symboltype=="d") {return selfMadeDiamondLong(+d.symbolsize)}
                 }
                 } )
      .attr("fill", d=>csr=="No"? "black" : (d.symbolcolor).toLowerCase())
      .attr('transform', (d, i) =>`translate( ${xA(d.effect)+5}, ${rowHeight * i+10})`);




    var xAxis = d3.axisBottom(xA)
    .ticks(nTicks)
    .tickFormat(x =>logr==="No" ? x.toFixed(1):`${Math.exp(x).toFixed(1)}`)



    xAxidsG=plot.append('g')
      .attr("id", "xAxidsG")
      .attr("class", "xAxidsG")
      .attr('transform', `translate(5,${rowHeight * coln})`)
      .call(xAxis)

/*base line*/
     plot.append('line')
      .attr('x1', xA(refL))
      .attr('x2', xA(refL))
      .attr('y1', 8)
      .attr('y2', data.length * rowHeight)
      .attr('stroke-width', 0.3)
      .attr('stroke', '#444')
      .style("stroke-opacity", .5)
      //.attr('stroke-dasharray', '4')
      .classed('vbar', true)
      .attr('transform', `translate(5.5,0)`)

/*ref line2*/
     plot.append('line')
      .attr('x1', xA(refL2))
      .attr('x2', xA(refL2))
      .attr('y1', 8)
      .attr('y2', data.length * rowHeight)
      .attr('stroke-width', 0.3)
      .attr('stroke', '#444')
      .style("stroke-opacity", .5)
      .attr('stroke-dasharray', '4')
      .classed('vbar', true)
      .attr('transform', `translate(5.5,0)`)

/**********for overrideLabel******************/
    var rr = svg.append('g')
    .attr('id',"rr");

for (var n=0; n<overlab.length;n++){
      overlabdata=[]
      for (var i=0; i < data.length ; ++i){
          var output = {};
          output["overrideLabel"]=data[i][`overrideLabel${n}`];
          output["overrideLabelWeight"]=data[i][`overrideLabel${n}Weight`];
          if (ptr=="Yes"){
          output["pvPos"]=+data[i]["pvPos"];
          }
         overlabdata.push(output)
      }
     //console.log(overlabdata)


    rr.selectAll(`.rrRow${n}`).data(overlabdata)
        .enter()
        .append('text')
        .text(d=> d.overrideLabel)
        .style("font-weight",d=>d.overrideLabelWeight=="bold"?700:300)
        .attr('class',`rrRow${n}`)
        .style('font-size', 12)
        .style("text-anchor", "middle")
         .style('font-family','Helvetica')
         .style('font-style', d=>(n==1 && ptr==="Yes")?'italic':'normal')
         .attr('dy', 18)
         .attr('dx', 10)
         .attr('transform', function(d, i){
                             var ptroff=0;
                           if (n===1 && ptr==="Yes"){
                           ptroff=d.pvPos
                           }
                           return `translate( ${+rrval+115*n}, ${(rowHeight * i-5)+ptroff})`
                           });
}

$('#rmin').val(rMin);
$('#rmax').val(rMax);

const svgS=document.getElementById("svg")
const {x,y,width,height}=svgS.viewBox.baseVal;
var svgData = $("#svg")[0].outerHTML;
var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
var svgUrl = URL.createObjectURL(svgBlob);
const image=document.createElement('img');
image.src=svgUrl
//console.log(image)
image.addEventListener('load', ()=>{
canvas=document.createElement('canvas')
    canvas.width=width;
    canvas.height=height;
context=canvas.getContext('2d')
context.drawImage(image,x,y,width, height)
//console.log('context',context)
    const link=document.getElementById('link');
    link.href=canvas.toDataURL();
//    console.log(link)
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


}



function readfile(e){
    var file = document.getElementById("myfile").files[0];
    const reader = new FileReader();
    reader.addEventListener('load', e => {
        const csvData = e.target.result.toString();
        console.log('CSV Data:', csvData);
        data=csvToJSON(csvData)
        console.log('data',data)
        rHeader = csvData.split('\r').join('').split('\n')
        Dheaders =rHeader[0].split(',');
        coln=data.length
        //console.log(coln)


        eff=[]
        data.forEach(function(item){
           d=+item['effect']
           if (d<99999)
           {eff.push(d)}
        })
        rmin=(+Math.min(...eff))
        rmax=(+Math.max(...eff))
          xoff=(rmax-rmin)/2
          effL=[]
        data.forEach(function(item){
           d=+item['low']
           if (d!=99999)
           {effL.push(d)}
        })
        effL.push(rmin)
        rminL=(+Math.min(...effL)-xoff).toFixed(1)
        console.log("effL",effL)

        effH=[]
        data.forEach(function(item){
           d=+item['high']
           if (d!=99999)
           {effH.push(d)}
        })
        effH.push(rmax)
        num=(+Math.max(...effH)+xoff)
        //rmaxH=(+Math.max(...effH)+xoff)
        rmaxH=(Math.round((num + Number.EPSILON) * 100) / 100).toFixed(1)
        console.log("effH",effH)


        refL=[]
           data.forEach(function(item){
           d=item['refLinePos']
           if (d!="")
           {refL.push(+d)}
        })

          refL2=[]
           data.forEach(function(item){
           d=item['refLinePos2']
           if (d!="")
           {refL2.push(+d)}
        })
//        console.log(eff)
//        console.log(rmin)
//        console.log(rmax)
//        console.log(refL)
        title=[]
           data.forEach(function(item){
           d=item['title']
           if (d!="")
           {title.push(d)}
        })
        title.reverse();

        xlabel=[]
           data.forEach(function(item){
           d=item['xlabel']
           if (d!="")
           {xlabel.push(d)}
        })
        xlabel.reverse();


/*get overidelabel data*/
       overlab=Object.keys(data[0]).filter(function(d){
       return d.includes("overrideLabel")})
       console.log(overlab)



   margin={ left: 20, top: 50,right:20,bottom:50 }
   widthA= 800 - margin.left - margin.right,
   //heightA=700
   rowHeight=20
   plotWidth=0.3
   nTicks=3
   paddingLeft=10
   discval=0
   plotval=150
   rrval=550-40*overlab.length/2;
   rMin=rminL;
   rMax=rmaxH;
   bgc1='#f2f1f1'
   bgc2='#fff'
   offset=60;/*this can adjust bottom margin*/
   lc=(coln+2)*rowHeight+offset;
   logr="No";
   titpos= widthA/2.5;
   vbgopc=0;
   ptr="No"
   dsize=3;
   csr="No"


   $('svg').each(function () { $(this)[0].setAttribute('viewBox', `0 0 850 ${lc}`) });
  svggraph()

  divlist=[".disc",".ratio",".plotid",".titpos"]

for (let i = 0; i < divlist.length; i++) {
   $(divlist[i]).mouseup(function(){
   if (i==0){discval=this.value}
   if (i==1){rrval=this.value}
   if (i==2){plotval=this.value}
   if (i==3){titpos=this.value}
   $("#svg-forestplot").remove();
   svggraph()
  });
}




   $(".disc").keydown(function(e){
   switch (e.which){
    case 37: discval=this.value;break;
    case 39: discval=this.value;break;
   }
   $("#svg-forestplot").remove();
   svggraph()
  });


     $(".plotid").keydown(function(e){
   switch (e.which){
    case 37: plotval=this.value;break;
    case 39: plotval=this.value;break;
   }
   $("#svg-forestplot").remove();
   svggraph()
  });

      $(".ratio").keydown(function(e){
   switch (e.which){
    case 37: rrval=this.value;break;
    case 39: rrval=this.value;break;
   }
   $("#svg-forestplot").remove();
   svggraph()
  });

    $(".titpos").keydown(function(e){
   switch (e.which){
    case 37: titpos=this.value;break;
    case 39: titpos=this.value;break;
   }
   $("#svg-forestplot").remove();
   svggraph()
  });



 $(".rmin").keyup(function(){
   rMin=this.value;
  $("#svg-forestplot").remove();
  svggraph()
  });

   $(".rmax").keyup(function(){
   rMax=this.value;
  $("#svg-forestplot").remove();
  svggraph()
  });

   $(".tickn").keyup(function(){
   nTicks=this.value;
  $("#svg-forestplot").remove();
  svggraph()
  });

$('.bgs').change(function() {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(this).find(':selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
     if (value=="Yes"){bgc1='#f2f1f1';bgc2='#fff' }
     else if (value=="No"){bgc1='white';bgc2='white' }
    $("#svg-forestplot").remove();
  svggraph()
});

$('.vbgs').change(function() {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(this).find(':selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
     if (value==="Yes"){vbgopc=0.1}
     else if (value=="No"){vbgopc=0 }
    $("#svg-forestplot").remove();
  svggraph()
});


$('.logr').change(function() {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(this).find(':selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
    console.log(value)
     if (value=="Yes"){logr="Yes";}
     else if (value=="No"){logr="No"; }
    $("#svg-forestplot").remove();
  svggraph()
});


$('.pt').change(function() {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(this).find(':selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
    console.log(value)
     if (value=="Yes"){ptr="Yes";}
     else if (value=="No"){ptr="No"; }
    $("#svg-forestplot").remove();
  svggraph()
});

$('.cs').change(function() {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(this).find(':selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
    console.log(value)
     if (value=="Yes"){csr="Yes";}
     else if (value=="No"){csr="No"; }
    $("#svg-forestplot").remove();
  svggraph()
});


// $(".vh").keyup(function(){
//   offset=+this.value-10;
//   lc=coln*30+offset;

//  $("#svg-forestplot").remove();
//  $('svg').removeAttr('viewBox');
//  $('svg').each(function () { $(this)[0].setAttribute('viewBox', `0 0 800 ${lc}`) });
//     svggraph()
//  });

    })
    reader.readAsText(file, 'UTF-8')

}


