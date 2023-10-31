
var units = " ";

var margin = {
        top:100,
        right: 30,
        bottom: 10,
        left: 30
    },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
        return formatNumber(d) + " " + units;
    }//,
    //color = d3.scale.category20();

//
//psize=16
//lgsize=20
//plist=["100%","80.5%","19.2%","0.4%","61.7%","36.4%","2.0%","47.1%","52.2%","0.7%","15.0%","85.0%"]
//sankeygraph()
//
// $(".rleg").keyup(function(){
//   lgsize=this.value;
//  $("#sankeysvg").remove();
//  sankeygraph()
//  });
//
//   $(".rpct").keyup(function(){
//   psize=this.value;
//  $("#sankeysvg").remove();
//  sankeygraph()
//  });
//
//function Geeks() {
//            plist=[]
//            var input = document.getElementsByName('array[]');
//
//            for (var i = 0; i < input.length; i++) {
//                var a = input[i];
//                plist.push(a.value) ;
//            }
//             $("#sankeysvg").remove();
//            sankeygraph()
//        }
//
//// the function for moving the nodes
//
function getData() {
    return {
        "nodes": [{
        "node": 0,
        "name": "ALL",
        "color":"blue",
        "label": "ALL",
        "p":"ALL"
    }, {
        "node": 1,
        "name": "NormalV2",
        "color":"red",
        "label": "Normal V2",
        "p":"Death 182"

    }, {
        "node": 2,
        "name": "AbovenormalV2",
        "color":"orange",
        "label": "Abovenormal V2",
        "p":"Alive SNF 182"
    }, {
        "node": 3,
        "name": "MissingV2",
        "color":"green",
        "label": "Missing V2",
        "p":"Alive No SNF 182"

    }, {
        "node": 4,
        "name": "NormalV3",
        "color":"red",
        "label": "Normal V3",
        "p":"Death 365"

    }, {
        "node": 5,
        "name": "AbovenormalV3",
        "color":"orange",
        "label": "Abovenormal V3",
        "p":"Abovenormal V3"


    }, {
        "node": 6,
        "name": "MissingV3",
        "color":"green",
        "label": "Missing V3",
        "p":"Missing V3"

    },
    ],
        "links": [{
        "source": 0,
        "target": 1,
        "value": 247
    }, {
        "source": 0,
        "target": 2,
        "value": 223
    }, {
        "source": 0,
        "target": 3,
        "value": 1002
    }, {
        "source": 1,
        "target": 4,
        "value": 247
    }, {
        "source": 1,
        "target": 5,
        "value": 0
    },{
        "source": 1,
        "target": 6,
        "value": 0
    }, {
        "source": 2,
        "target": 4,
        "value": 35
    }, {
        "source": 2,
        "target": 5,
        "value": 55
    }, {
        "source": 2,
        "target": 6,
        "value": 133
    },
    {
        "source": 3,
        "target": 4,
        "value": 48
    }, {
        "source": 3,
        "target": 5,
        "value": 48
    },{
        "source": 3,
        "target": 6,
        "value": 906
    },

    ]};
}


//document.getElementById("dl-png").onclick=function(){
//  const screeshotTarget=document.getElementById('sankeysvg')
//  html2canvas(screeshotTarget).then((canvas)=>{
//   const base64image=canvas.toDataURL("image/png");
//   var anchor=document.creatElement('a')
//   anchor.setAttribute("href",base64image)
//   anchor.setAttribute("download","sankey.png")
//   anchor.click();
//   anchor.remove();
//   });
//}
const download = () => {
  // fetch SVG-rendered image as a blob object
  const svg = document.querySelector('svg');
  const data = (new XMLSerializer()).serializeToString(svg);
  const svgBlob = new Blob([data], {
    type: 'image/svg+xml;charset=utf-8'
  });


  // convert the blob object to a dedicated URL
  const url = URL.createObjectURL(svgBlob);

  // load the SVG blob to a flesh image object
  const img = new Image();
  img.addEventListener('load', () => {
    // draw the image on an ad-hoc canvas
    const bbox = svg.getBBox();

    const canvas = document.createElement('canvas');
    canvas.width = bbox.width;
    canvas.height = bbox.height;

    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, bbox.width, bbox.height);

    URL.revokeObjectURL(url);

    // trigger a synthetic download operation with a temporary link
    const a = document.createElement('a');
    a.download = 'image.png';
    document.body.appendChild(a);
    a.href = canvas.toDataURL();
    a.click();
    a.remove();
  });
  img.src = url;
};


d3.csv(
     "test_all.csv",
    (data) => {
    //********************get nodes**********************
    lab1=[]
    data.forEach(function(item){
        d={}
        d['node']=item['link_s']
        d['name']=item['name_s'].split(" ").join("")
        d['label']=item['label_s']
        lab1.push(d)
        })

    lab2=[]
    data.forEach(function(item){
        d={}
        d['node']=item['link_t']
        d['name']=item['name_t'].split(" ").join("")
        d['label']=item['label_t']
        lab2.push(d)
        })

    labs=[...lab1,...lab2]
    let mymap = new Map();

    //identify unique node objects
    var map = new Map();
    let nodes = labs.filter((web) => {
       if (map.get(web.node)) {
          return false;
       }
       map.set(web.node, web);
       return true;
    });

    nodescolor=['blue','red','yellow','green','red','yellow','green']
    i=0;
    nodes.forEach(function(item){
       item['color']=nodescolor[i]
       i++
       })
    console.log(nodes)
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
     'nodes': nodes,
     'links':links
    }
    console.log(graph)
    psize=15

    sankeygraph(graph)
})




//
//function csvToJSON(csvDataString){
//    const rowsHeader = csvDataString.split('\r').join('').split('\n')
//    const headers = rowsHeader[0].split(',');
//    const content = rowsHeader.filter((_,i) => i>0);
//    //console.log('Headers: ',headers);
//    const jsonFormatted = content.map(row => {
//        const columns = row.split(',');
//        return columns.reduce((p,c, i) => {
//            p[headers[i]] = c;
//            return p;
//        }, {})
//    })
//    console.log('jsonFormatted:',jsonFormatted);
//    // here you have the JSON formatted
//    return jsonFormatted.filter(function(x) {
//            return x[headers[0]] !== "" ;
//                });
//}
//function makestring(arr,name){
//   var vals=[];
//        for(var i=0;i<arr.length;i++){
//           vals.push(arr[i][name]);
//                }
//
//     var valsfilter = vals.filter(function(x) {
//            return x !== undefined ;
//                })
//     var valsfilter2 = valsfilter.filter(function(x) {
//            return x !== "" ;
//                })
//         return valsfilter2;
//}


