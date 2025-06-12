
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

            data.forEach(d=>{
			  d.axis=d.axis
			  d.value=d.value
			  d.type=d.type
			  })
            var groupTypes = [...new Set(data.map(item => item.type))];
            var colorRange=["red", "blue", "orange", "green", "purple", "yellow","brown", "black", "cyan", "magenta","teal", "lavender", "maroon", "turquoise"]
            //console.log(groupTypes)
            const transformedData = data.reduce((acc, item) => {
			  const value = parseFloat(item.value) / 100;
			  const type=item.type
			  const groupIndex = groupTypes.indexOf(item.type);
			  const color=colorRange[groupIndex]

			  if (groupIndex === -1) return acc; // Skip unknown types

			  if (!acc[groupIndex]) acc[groupIndex] = [];
			  acc[groupIndex].push({axis: item.axis, value,type,color});
			  return acc;
			}, Array(groupTypes.length).fill().map(() => []));

           console.log(transformedData)

           var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(700, window.innerHeight) - margin.top - margin.bottom - 10;

			//////////////////////////////////////////////////////////////
			//////////////////// Draw the Chart //////////////////////////
			//////////////////////////////////////////////////////////////
//            colorRange=["red", "blue", "orange", "green", "purple", "yellow","brown", "black", "cyan", "magenta","teal", "lavender", "maroon", "turquoise"]
//			var color = d3.scaleOrdinal(10)
//				.range(colorRange);
            var opacityArea=0.35
            var formatChoice="float"
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 0.5,
			  levels: 5,
			  roundStrokes: true,
			};


			title=[]
            data.forEach(function(item){
                d=item['title']
                if (d!="")
                {title.push(d)}
            })
            title.reverse();

			//Call function to draw the Radar chart
			var titpos=300
			RadarChart(".radarChart", transformedData, radarChartOptions,titpos,opacityArea,formatChoice);

            //console.log(title)

        $('.vls').change(function() {
            //Use $option (with the "$") to see that the variable is a jQuery object
            var $option = $(this).find(':selected');
            //Added with the EDIT
            var value = $option.val();//to get content of "value" attrib
            if (value==="Yes"){opacityArea=0.35}
            else if (value==="No"){opacityArea=0 }
            $("#svg_g").remove();
            RadarChart(".radarChart", transformedData, radarChartOptions,titpos,opacityArea,formatChoice);
        })


        divlist=[".titpos"]

        for (let i = 0; i < divlist.length; i++) {
        $(divlist[i]).mouseup(function(){

         titpos=this.value
         console.log()
        $("#svg_g").remove();
        RadarChart(".radarChart", transformedData, radarChartOptions,titpos,opacityArea,formatChoice);
        });
        }

        $(".titpos").keydown(function(e){
          switch (e.which){
           case 37: titpos=this.value;break;
           case 39: titpos=this.value;break;
          }
           $("#svg_g").remove();
          RadarChart(".radarChart", transformedData, radarChartOptions,titpos,opacityArea,formatChoice);
        });

        $('.lft').change(function() {
                //Use $option (with the "$") to see that the variable is a jQuery object
                var $option = $(this).find(':selected');
                //Added with the EDIT
                var value = $option.val();//to get content of "value" attrib
                console.log(value)
                 if (value=="percent"){formatChoice="percent";}
                 else if (value=="float"){formatChoice="float"; }
                 else if (value=="float2"){formatChoice="float2"; }
                 else if (value=="int"){formatChoice="int"; }
           $("#svg_g").remove();
          RadarChart(".radarChart", transformedData, radarChartOptions,titpos,opacityArea,formatChoice);
        });


    })
   
    reader.readAsText(file, 'UTF-8')
}


       document.getElementById('downloadCsv').addEventListener('click', async () => {
        try {
            // URL of the online CSV file
            const csvURL = 'https://raw.githubusercontent.com/LeiHuang-statistician/webpageTest/refs/heads/main/spiderPlot/spider_example_data.csv';

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
    })



