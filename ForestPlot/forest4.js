


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
       .attr('fill', (d, i) => { return (i % 2 === 0)? bgc1: bgc2 })
       .attr('transform', (d, i) =>`translate( 0, ${rowHeight * i})`);

    var disc = svg.append('g')
    .attr('id','disc')



    disc.selectAll('.discrow').data(data)
        .enter()
        .append('text')
        .attr('class','discrow')
        .text(d=> d.description)
        .style('font-size', 12)
         .style('font-family','Helvetica')
         .attr('dy', 18)
         .attr('dx', d=>10+paddingLeft*d.descriptionOffset)
         .attr('transform', (d, i) =>`translate( ${discval}, ${rowHeight * i})`)


    var plot = svg.append('g')
        .attr('id','plot')
       .attr('class','container')
       .attr('transform', `translate( ${plotval}, 0)`);

    var xA = d3.scaleLinear()
    //.domain([lowX - Math.abs(0.1 * lowX), highX + Math.abs(0.1 * highX)])
    .domain([rMin, rMax])
    .range([0, widthA * plotWidth])

    plot.selectAll('.rect').data(data)
      .enter()
      .append('rect')
      .attr('height', 10)
      .attr('width', 10)
      .attr('x', d=>xA(d.effect))
      .attr('y', 8)
      .attr('transform', (d, i) =>`translate( 0, ${rowHeight * i})`);

    plot.selectAll('.line').data(data)
       .enter()
       .append('line')
       .attr('x1',d=>xA(d.low))
       .attr('x2',d=>xA(d.high))
       .attr('y1', rowHeight / 2)
       .attr('y2', rowHeight / 2)
       .attr('stroke-width', 1)
       .attr('stroke', 'black')
       .attr('transform', (d, i) =>`translate( 0, ${rowHeight * i})`);

    var xAxis = d3.axisBottom(xA)
    .ticks(nTicks)

    xAxidsG=plot.append('g')
      .attr("id", "xAxidsG")
      .attr("class", "xAxidsG")
      .attr('transform', `translate(5,${rowHeight * coln})`)
      .call(xAxis)

     plot.append('line')
      .attr('x1', xA(1))
      .attr('x2', xA(1))
      .attr('y1', 0)
      .attr('y2', data.length * rowHeight)
      .attr('stroke-width', 1)
      .attr('stroke', '#444')
      .attr('stroke-dasharray', '5, 5')
      .classed('vbar', true)
      .attr('transform', `translate(5,0)`)

    var rr = svg.append('g')
    .attr('id','rr')

    rr.selectAll('.rrRow').data(data)
        .enter()
        .append('text')
        .text(d=> d.overrideLabel)
        .attr('class','rrRow')
        .style('font-size', 12)
         .style('font-family','Helvetica')
         .attr('dy', 18)
         .attr('dx', 10)
         .attr('transform', (d, i) =>`translate( ${rrval}, ${rowHeight * i})`);

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
        console.log(coln)



   widthA=800
   heightA=600
   margin={ left: 20, top: 20 }
   rowHeight=26
   plotWidth=0.3
   nTicks=7
   paddingLeft=10
   discval=0
   plotval=200
   rrval=550
   rMin=0.8
   rMax=1.1
   bgc1='#f2f1f1'
   bgc2='#fff'
   lc=5
  svggraph()

  divlist=[".disc",".ratio",".plot"]
valist=[discval,rrval,plotval]
for (let i = 0; i < divlist.length; i++) {
   $(divlist[i]).mouseup(function(){
   if (i==0){discval=this.value}
   if (i==1){rrval=this.value}
   if (i==2){plotval=this.value}
   $("#svg-forestplot").remove();
   svggraph()
  });
}
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

$('.bgs').change(function() {
    //Use $option (with the "$") to see that the variable is a jQuery object
    var $option = $(this).find(':selected');
    //Added with the EDIT
    var value = $option.val();//to get content of "value" attrib
    console.log(value)
     if (value=="Yes"){bgc1='#f2f1f1';bgc2='#fff' }
     else if (value=="No"){bgc1='white';bgc2='white' }
    $("#svg-forestplot").remove();
  svggraph()
});

 $(".vh").keyup(function(){
   lc=+this.value*50;

  $("#svg-forestplot").remove();
  $('svg').removeAttr('viewBox');
  $('svg').each(function () { $(this)[0].setAttribute('viewBox', `0 0 800 ${lc}`) });
     svggraph()
  });

    })
    reader.readAsText(file, 'UTF-8')

}


// $(".vh").keyup(function(){
//   lc=+this.value*50;
//
//  $("#svg-forestplot").remove();
//  $('svg').removeAttr('viewBox');
//  $('svg').each(function () { $(this)[0].setAttribute('viewBox', `0 0 800 ${lc}`) });
//  });
//
//  $(".rmax").keyup(function(){
//   lc=this.value;
//   $('svg').removeAttr('viewBox');
//   $('svg').each(function () { $(this)[0].setAttribute('viewBox', '0 0 800 lc') });
//  $("#svg-forestplot").remove();
//  svggraph()
//  });

//
//divlist=[".disc",".ratio",".plot"]
//valist=[discval,rrval,plotval]
//for (let i = 0; i < divlist.length; i++) {
//   $(divlist[i]).mouseup(function(){
//   if (i==0){discval=this.value}
//   if (i==1){rrval=this.value}
//   if (i==2){plotval=this.value}
//   $("#svg-forestplot").remove();
//   svggraph()
//  });
//}
// $(".rmin").keyup(function(){
//   rMin=this.value;
//  $("#svg-forestplot").remove();
//  svggraph()
//  });
//
//   $(".rmax").keyup(function(){
//   rMax=this.value;
//  $("#svg-forestplot").remove();
//  svggraph()
//  });
//
