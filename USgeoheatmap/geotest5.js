var idarray = $("#sidebar") //get sidebar ids.
             .find("img") //Find the spans
             .map(function() { return this.id; }) //Project Ids
             .get(); //ToArray
console.log(idarray)

function readfile(e){
d3.json("https://unpkg.com/us-atlas@2.1.0/us/10m.json").then(function(us) {

  //console.log(us.objects.states)

file = document.getElementById("myfile").files[0];
console.log(file)
reader = new FileReader();
reader.addEventListener('load', e => {
    const csvData = e.target.result.toString();
    //console.log('CSV Data:', csvData);
    data=csvToJSON(csvData)
    //console.log(data)
    //console.log('data',data)
    rHeader = csvData.split('\r').join('').split('\n')
    Dheaders =rHeader[0].split(',');
    coln=data.length
    console.log('headers',Dheaders)
    // console.log('data',data)
    // x=data.filter(d=>+d.value===0)
    // console.log('x',x)




    title=[]
    data.forEach(function(item){
        d=item['title']
        if (d!="")
        {title.push(d)}
    })
    title.reverse();
    //console.log(title)


    eff=[]
    data.forEach(function(item){
    d=+item['value']
    if (d<99999)
    {eff.push(d)}
    })

    rmin=(+Math.min(...eff))
    rmax=(+Math.max(...eff))
    console.log('rmin',rmin)
    console.log('rmax',rmax)
   
  
   
    crmin=rmin;
    crmax=rmax;
    //data.map(d=>(d.value>=crmin & d.value<=crmax) ? d.rcolor=1 : d.rcolor=0)
    //console.log("rcolor",data)

    const stateData=data.filter(d=>d.type==='state')
    const countyData=data.filter(d=>d.type==='county')
    //console.log(stateData)
    //console.log(countyData)
    countiesborder=topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; })
    statesborder=topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })
    states=topojson.feature(us, us.objects.states)
                  states.features.forEach((d,i)=>{
                    var datafilter=stateData.filter(ditem=>+ditem.FIPS==+d.id)
                    //console.log(datafilter)
                    Object.assign(d.properties,datafilter[0]);
                    });
    counties=topojson.feature(us, us.objects.counties)
                  counties.features.forEach((d,i)=>{
                    var datafilter=countyData.filter(ditem=>+ditem.FIPS==+d.id)
                    //console.log(datafilter)
                    Object.assign(d.properties,datafilter[0]);
                    });

    margin = {top: -30, right: 20, bottom: 50, left: 150};
    widthA = 1000;
    heightA = 700;
    fontsize=18;
    colortheme=d3.interpolateReds;

    vls=1;
    ctl=1;
    function alerfs() {
      alert("Do not find county data. Will show state map instead!");
    }
    function alerfc() {
      alert("Do not find state data. Will show county map instead!");
    }
    if (countyData.length===0) {
      ctl=0;
      alerfs()
    }


    titpos=100;

    geohtmp()

    $('.vls').change(function() {
      //Use $option (with the "$") to see that the variable is a jQuery object
      var $option = $(this).find(':selected');
      //Added with the EDIT
      var value = $option.val();//to get content of "value" attrib
      if (value==="Yes"){vls=1}
      else if (value==="No"){vls=0 }
      $("#svg-forestplot").remove();
      geohtmp()
    })

    divlist=[".titpos"]

    for (let i = 0; i < divlist.length; i++) {
      $(divlist[i]).mouseup(function(){
      //    if (i==0){discval=this.value}
      //    if (i==1){rrval=this.value}
      //    if (i==2){plotval=this.value}
      if (i==0){titpos=this.value}
      $("#svg-forestplot").remove();
      geohtmp()
      });
    }

    $(".titpos").keydown(function(e){
      switch (e.which){
       case 37: titpos=this.value;break;
       case 39: titpos=this.value;break;
      }
      $("#svg-forestplot").remove();
      geohtmp()
     });

    $('.level').change(function() {
      //Use $option (with the "$") to see that the variable is a jQuery object
      var $option = $(this).find(':selected');
      //Added with the EDIT
      var value = $option.val();//to get content of "value" attrib
      if (value==="Yes"){ctl=1}
      else if (value==="No"){ctl=0 }
      $("#svg-forestplot").remove();
      if (stateData.length===0) {
      ctl=1;
      alerfc()
          }
      geohtmp()
    })

    
    $(".rmin").keyup(function(){
      rmin=this.value;
      $("#svg-forestplot").remove();
    geohtmp()
    });

    $(".rmax").keyup(function(){
      rmax=this.value;
      $("#svg-forestplot").remove();
    geohtmp()
    });


    $(".crmin").keyup(function(){
      crmin=this.value;
      if (crmin===""){crmin=rmin}
      $("#svg-forestplot").remove();
    geohtmp()
    });

    $(".crmax").keyup(function(){
      crmax=this.value;
      if (crmax===""){crmax=rmax}
      $("#svg-forestplot").remove();
    geohtmp()
    });

    for (let i=0; i<idarray.length;i++){
      $('#'+idarray[i]).click(function(){
          if (i===0) {colortheme=d3.interpolateBlues}
          if (i===1) {colortheme=d3.interpolateGreens}
          if (i===2) {colortheme=d3.interpolateOranges}
          if (i===3) {colortheme=d3.interpolatePurples}
          if (i===4) {colortheme=d3.interpolateReds}
          if (i===5) {colortheme=d3.interpolateBrBG}
          if (i===6) {colortheme=d3.interpolatePiYG}
          if (i===7) {colortheme=d3.interpolateRdBu}
          if (i===8) {colortheme=d3.interpolateRdYlGn}
          
          $("#svg-forestplot").remove();
          geohtmp()
      })
    }

  })
 reader.readAsText(file, 'UTF-8')
})
}

