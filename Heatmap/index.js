var idarray = $("#sidebar") //get sidebar ids.
             .find("img") //Find the spans
             .map(function() { return this.id; }) //Project Ids
             .get(); //ToArray
//console.log(idarray)

function readfile(e){
    var file = document.getElementById("myfile").files[0];
    const reader = new FileReader();
    reader.addEventListener('load', e => {
            const csvData = e.target.result.toString();
            //console.log('CSV Data:', csvData);
            data=csvToJSON(csvData)
            //console.log('data',data)
            rHeader = csvData.split('\r').join('').split('\n')
            Dheaders =rHeader[0].split(',');
            coln=data.length
            //console.log(data)
            //console.log('headers',Dheaders)
        
            
            yrow=[]
            data.forEach(function(item){
            d=item['ylabel']
            {yrow.push(d)}
            })

            yheader=[...new Set(yrow)]

            xrow=[]
            data.forEach(function(item){
            d=item['xlabel']
            {xrow.push(d)}
            })

            yheader=[...new Set(yrow)]
            xheader=[...new Set(xrow)]
        
            varn=yheader.length
            grpn=xheader.length
            //console.log('xheader', varn)
            //console.log('yheader', grpn)
            eff=[]
            data.forEach(function(item){
            d=+item['value']
            if (d<99999)
            {eff.push(d)}
            })
        
            rmin=(+Math.min(...eff))
            rmax=(+Math.max(...eff))
            //console.log(eff)
            //console.log('rmin',rmin)
            //console.log('rmin',rmax)

            title=[]
            data.forEach(function(item){
                d=item['title']
                if (d!="")
                {title.push(d)}
            })
            title.reverse();
        
            
            // pct=percentRank(eff,100)
            // console.log('pct',pct)


        margin = {top: 50, right: 90, bottom: 100, left: 200};
        widthA = 510;
        heightA = 500;
        paneltr=530;

        titpos=(widthA)/2;
        labfontsize=13;
        titlefontsize=14;

        colortheme=d3.interpolateBlues
        vls=1
        logr="None"
        $('titpos').val(titpos)

        htmplot()
        $('.vls').change(function() {
            //Use $option (with the "$") to see that the variable is a jQuery object
            var $option = $(this).find(':selected');
            //Added with the EDIT
            var value = $option.val();//to get content of "value" attrib
            if (value==="Yes"){vls=1}
            else if (value==="No"){vls=0 }
            $("#svg-forestplot").remove();
            htmplot()
        })


        divlist=[".titpos"]

        for (let i = 0; i < divlist.length; i++) {
        $(divlist[i]).mouseup(function(){
        //    if (i==0){discval=this.value}
        //    if (i==1){rrval=this.value}
        //    if (i==2){plotval=this.value}
        if (i==0){titpos=this.value}
        $("#svg-forestplot").remove();
        htmplot()
        });
        }

        $(".titpos").keydown(function(e){
          switch (e.which){
           case 37: titpos=this.value;break;
           case 39: titpos=this.value;break;
          }
          $("#svg-forestplot").remove();
          htmplot()
        });

        $(".ylab").keyup(function(){
            yrt=this.value;
            $("#yband .tick text").css("transform", `rotate(${yrt}deg)`);
        });

        $(".xlab").keyup(function(){
            xrt=this.value;
            if (xrt<0){
                $("#xband .tick text").css({"transform": `rotate(${xrt}deg)`,"text-anchor": "end"} );
            } 
            if (xrt==0 ) {
                $("#xband .tick text").css({"transform": `rotate(${xrt}deg)`,"text-anchor": "middle"} );
            }

            if (xrt>0) {
                $("#xband .tick text").css({"transform": `rotate(${xrt}deg)`,"text-anchor": "start"} );
            }

        });

        $(".rmin").keyup(function(){
          rmin=this.value;
          $("#svg-forestplot").remove();
        htmplot()
        });

        $(".rmax").keyup(function(){
          rmax=this.value;
          $("#svg-forestplot").remove();
        htmplot()
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
                htmplot()
            })


            $('.lft').change(function() {
                //Use $option (with the "$") to see that the variable is a jQuery object
                var $option = $(this).find(':selected');
                //Added with the EDIT
                var value = $option.val();//to get content of "value" attrib
                console.log(value)
                 if (value=="None"){logr="None";}
                 else if (value=="TD"){logr="TD"; }
                 else if (value=="OD"){logr="OD"; }
                $("#svg-forestplot").remove();
              htmplot()
            });
        }
    
    })
   
    reader.readAsText(file, 'UTF-8')
}


    document.getElementById('downloadCsv').addEventListener('click', async () => {
        try {
            // URL of the online CSV file
            const csvURL = 'https://raw.githubusercontent.com/LeiHuang-statistician/webpageTest/refs/heads/main/Heatmap/heatmap_s.csv';

            // Fetch the CSV file from the URL
            const response = await fetch(csvURL);

            if (response.ok) {
                const csvData = await response.text();

                // Create a Blob containing the CSV file content
                const blob = new Blob([csvData], { type: 'text/csv' });

                // Create an anchor element
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'downloaded_file.csv';

                // Simulate click on the anchor element to initiate the download
                link.click();

                // Clean up
                URL.revokeObjectURL(link.href);
            } else {
                console.error('Failed to fetch the file');
            }
        } catch (error) {
            console.error('Error:', error);
    }
});




