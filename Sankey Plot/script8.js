
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
        title=[]
        data.forEach(function(item){
            d={}
            if (item['title']!="") {
                 d['title']=item['title']
                 d['title_size']=+item['title_size']
                 title.push(d)}
            })
        title.reverse()

        psize=12
        if (data[0].label_size) {psize=+(data[0].label_size)}

        plot_width=800
        if (data[0].plot_width) {plot_width=+(data[0].plot_width)}

        plot_height=600
        if (data[0].plot_height) {plot_height=+(data[0].plot_height)}

        textgdata=[]
        data.forEach(function(item){
            d={}
            if (item['text_add'] !==''){
                 d['name']=item['text_add']
                 d['x']=+item['text_x']
                 d['y']=+item['text_y']
                 textgdata.push(d)}
            })
        //console.log(textgdata)
        talertY=0
        for (i=0;i<textgdata.length;i++)
              if (textgdata[i]['name'] && (!textgdata[i]['x'] || !textgdata[i]['y'])){talertY=1}
        if (talertY==1) (alert ("text x or text y are empty "))

        legendata=[]
        data.forEach(function(item){
            d={}
            if (item['legend_text'] !==''){
                 d['labe1']=item['legend_text']
                 d['color']=item['legend_color']
                 d['x']=+item['legend_x']
                 d['y']=+item['legend_y']
                 legendata.push(d)}
            })
        //console.log(legendata)
        lalertY=0
        for (i=0;i<legendata.length;i++)
              if (!legendata[i]['labe1']) {lalertY=2}
              else if (legendata[i]['labe1'] && (!legendata[i]['x'] || !legendata[i]['y'])){lalertY=1}


        if (lalertY==1) (alert ("lengend x or lengend y are empty "))


            //********************get nodes**********************
        lab1=[]
        data.forEach(function(item){
            d={}
            if (item['name_s']!==''){
                d['node']=+item['link_s']
                d['name']=item['name_s'].split(" ").join("")
                d['label']=item['label_s']
                d['color']=item['color_s']
                lab1.push(d)
                }
            })
        lab2=[]
        data.forEach(function(item){
            d={}
            if (item['name_t']!==''){
                d['node']=+item['link_t']
                d['name']=item['name_t'].split(" ").join("")
                d['label']=item['label_t']
                d['color']=item['color_t']
                lab2.push(d)
                }
            })

        labs=[...lab1,...lab2]
           //identify unique node objects
        var map = new Map();
        let nodes = labs.filter((web) => {
           if (map.get(web.node)) {
              return false;
           }
           map.set(web.node, web);
           return true;
        })
        nodes.sort((a, b) => a.node - b.node);
        //console.log(nodes)
        //***node x,y***
        nodexy=[]
        data.forEach(function(item){
            t={}
            if (item['node_id']!==''){
                t['node']=+item['node_id'];
                item['node_x']==''? t['node_x']=null:t['node_x']=+item['node_x'];
                item['node_y']==''? t['node_y']=null:t['node_y']=+item['node_y'];
                nodexy.push(t)
                }
            })

        //console.log(nodexy)


function leftJoinArrays(array1, array2, key) {
    return array1.map(item1 => {
        const matchingItem = array2.find(item2 => item2[key] === item1[key]);
        if (matchingItem) {
            return { ...item1, ...matchingItem };
        } else {
            return { ...item1,"node_x": null, "node_y": null };
        }
    });
}

let nodes2 = leftJoinArrays(nodes, nodexy, 'node');
//console.log(nodes2)
        //**********************get links***********************
        links=[]
        i=0
        data.forEach(function(item){
        d={}
        d['source']=+item['link_s']
        d['target']=+item['link_t']
        d['value']=+item['value']
        i++
        links.push(d)
        })
        //console.log(links)
        var graph={
         'nodes': nodes2,
         'links':links
        }
        //console.log(graph)

        sankeygraph(graph)
        $(".hidden").css("visibility", "visible")
            })
     reader.readAsText(file, 'UTF-8')
 }

document.getElementById('downloadCsv').addEventListener('click', async () => {
    try {
        // URL of the online CSV file
        const csvURL = 'https://raw.githubusercontent.com/LeiHuang-statistician/Projects/main/SankeyPlot/test_All.csv';

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

