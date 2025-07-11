function readfile(e){
    var file = document.getElementById("myfile").files[0];
    const reader = new FileReader();
    reader.addEventListener('load', e => {
            const csvData = e.target.result.toString();
            //console.log('CSV Data:', csvData);
            data=csvToJSON(csvData).filter(d=>d.tpr!=" ")
            //console.log('data',data)
            rHeader = csvData.split('\r').join('').split('\n')
            Dheaders =rHeader[0].split(',');
            coln=data.length
            //console.log(data)
            //console.log('headers',Dheaders)
            title=[]
            data.forEach(function(item){
                d=item['title']
                if (d.includes("|comma|")){d=d.replaceAll("|comma|",",")}
                if (d!=""){title.push(d)}
            })
            title.reverse();
//            console.log("title",title)

            lables=[]
            data.forEach(function(item){
                d=item['xy_labels']
                if (d!=""){lables.push(d)}
            })
            xlab=lables[0]
            ylab=lables[1]
//            console.log( lables)


            AUC_text=[]
            data.forEach(function(item){
                d=item['AUC']
                if (d!="")
                {AUC_text.push(d)}
            })

//            console.log("AUC_text",AUC_text[0])

            const hasMarker = data.some(item => 'marker' in item);
//            console.log("hasMarker",hasMarker)

            const hasAUC = data.some(item => 'AUC' in item);
//            console.log("hasAUC",hasAUC)

            data2=[]
            data.forEach(d=>{
			  d.tpr=+d.tpr
			  d.fpr=+d.fpr
			  d.prob=+d.prob
			  d.specificity=+d.specificity
			  d.youden=+d.youden
			  d.marker=+d.marker
			  if (d.tpr!=" "){data2.push(d)}
			  })
//            console.log(data2)

        // Check if {fpr: 0.0, tpr: 0.0 } exists
        const hasZeroPoint = data.some(item =>
            item.fpr === 0.0 && item.tpr === 0.0
        );

        // Check if {fpr: 1.0, tpr: 1.0 } exists
        const hasOnePoint = data.some(item =>
            item.fpr === 1.0 && item.tpr === 1.0
        );

        // Add missing points
        if (!hasZeroPoint) {
            data.unshift({ fpr: 0.0, tpr: 0.0 });
        }

        if (!hasOnePoint) {
            data.push({ fpr: 1.0, tpr: 1.0 });
        }

        //console.log(data);

        // Calculate AUC (Area Under Curve)
        const auc = data.reduce((sum, point, i) => {
            if (i === 0) return 0;
            const prev = data[i-1];
            return sum + (point.fpr - prev.fpr) * (point.tpr + prev.tpr) / 2;
        }, 0);



        var fontSize=15;
        var point
         var AUC_show
         hasMarker ? point=1 : point=0
         hasAUC && AUC_text[0].toLowerCase()=="yes"  ? AUC_show=1 : AUC_show=0
        var titpos=300


        var color = d3.scaleOrdinal()
          .domain(["Sensitivity", "Specificity", "Youden's Index"])
          .range(["blue", "green", "red"]);
       RocCurve(data,fontSize,auc,AUC_show,point,titpos)
       //SpecCurve(data2,fontSize,titpos,color)
                //console.log(title)



      function drawgraph(value){
          if (value=="ROC") { ydx=0;
                             $("#svg_g").remove();
                             RocCurve(data,fontSize,auc,AUC_show,point,titpos,ydx)
                             }
          if (value=="Spec_vs_sen") { ydx=0;
                                      $("#svg_g").remove();
                                      color = d3.scaleOrdinal()
                                              .domain(["Sensitivity", "Specificity"])
                                              .range(["blue", "green"]);
                                      SpecCurve(data2,fontSize,titpos,color,ydx)
                                      }
          if (value=="Spec_vs_sen_vs_youd") {ydx=1;
                                             $("#svg_g").remove();
                                             color = d3.scaleOrdinal()
                                                      .domain(["Sensitivity", "Specificity", "Youden's Index"])
                                                      .range(["blue", "green", "red"]);
                                             SpecCurve(data2,fontSize,titpos,color,ydx)
                                             }
      }
       $('.lft').change(function() {
                //Use $option (with the "$") to see that the variable is a jQuery object
                var $option = $(this).find(':selected');
                //Added with the EDIT
                var value = $option.val();//to get content of "value" attrib
                console.log(value)
           drawgraph(value);
        });



    })
   
    reader.readAsText(file, 'UTF-8')
}


       document.getElementById('downloadCsv').addEventListener('click', async () => {
        try {
            // URL of the online CSV file
            const csvURL = 'https://raw.githubusercontent.com/LeiHuang-statistician/webpageTest/refs/heads/main/SensitivityPlot/test_roc_data2.csv';

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



