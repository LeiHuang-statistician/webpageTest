color=["rgba(31, 119, 180, 0.8)",
                    "rgba(255, 127, 14, 0.8)",
                    "rgba(44, 160, 44, 0.8)",
                    "rgba(214, 39, 40, 0.8)",
                    "rgba(148, 103, 189, 0.8)",
                    "rgba(140, 86, 75, 0.8)",
                    "rgba(227, 119, 194, 0.8)",
                    "rgba(127, 127, 127, 0.8)",
                    "rgba(188, 189, 34, 0.8)",
                    "rgba(23, 190, 207, 0.8)",
                    "rgba(31, 119, 180, 0.8)",
                    "rgba(255, 127, 14, 0.8)",
                    "rgba(44, 160, 44, 0.8)",
                    "rgba(214, 39, 40, 0.8)",
                    "rgba(148, 103, 189, 0.8)",
                    "rgba(140, 86, 75, 0.8)",
                    "rgba(227, 119, 194, 0.8)",
                    "rgba(127, 127, 127, 0.8)",
                    "rgba(188, 189, 34, 0.8)",
                    "rgba(23, 190, 207, 0.8)",
                    "rgba(31, 119, 180, 0.8)",
                    "rgba(255, 127, 14, 0.8)",
                    "rgba(44, 160, 44, 0.8)",
                    "rgba(214, 39, 40, 0.8)",
                    "rgba(148, 103, 189, 0.8)",
                    "rgba(140, 86, 75, 0.8)",
                    "rgba(227, 119, 194, 0.8)",
                    "rgba(127, 127, 127, 0.8)",
                    "rgba(188, 189, 34, 0.8)",
                    "rgba(23, 190, 207, 0.8)",
                    "rgba(31, 119, 180, 0.8)",
                    "rgba(255, 127, 14, 0.8)",
                    "rgba(44, 160, 44, 0.8)",
                    "rgba(214, 39, 40, 0.8)",
                    "rgba(148, 103, 189, 0.8)",
                    "magenta",
                    "rgba(227, 119, 194, 0.8)",
                    "rgba(127, 127, 127, 0.8)",
                    "rgba(188, 189, 34, 0.8)",
                    "rgba(23, 190, 207, 0.8)",
                    "rgba(31, 119, 180, 0.8)",
                    "rgba(255, 127, 14, 0.8)",
                    "rgba(44, 160, 44, 0.8)",
                    "rgba(214, 39, 40, 0.8)",
                    "rgba(148, 103, 189, 0.8)",
                    "rgba(140, 86, 75, 0.8)",
                    "rgba(227, 119, 194, 0.8)",
                    "rgba(127, 127, 127, 0.8)"]

function appendJsonToTable(jsonArray){
    const headersHtml = Object.keys(jsonArray[0]).map(h => `<th>${h}</th>`).join('')
    const tableHtml = jsonArray.map(row => {
        const columns = Object.values(row);
        const columnsInTable = columns.map(c => `<td>${c}</td>`).join('')
        return `<tr>${columnsInTable}</tr>`;
    }).join('')
    const table = document.getElementById("_table");
    console.log('tableHtml:', tableHtml);
    table.innerHTML = [headersHtml, tableHtml].join('');
}
function csvToJSON(csvDataString){
          const rowsHeader = csvDataString.split('\r').join('').split('\n')
          const headers = rowsHeader[0].split(',');
          const content = rowsHeader.filter((_,i) => i>0);
          console.log('Headers: ',headers);
          const jsonFormatted = content.map(row => {
              const columns = row.split(',');
              return columns.reduce((p,c, i) => {
                  p[headers[i]] = c;
                  return p;
              }, {})
          })
          console.log('jsonFormatted:',jsonFormatted);
          // here you have the JSON formatted
          return jsonFormatted;
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

function pick(obj, name1, name2) {
          var subobj=[];
              for(var i=0;i<obj.length;i++){
                sub={l:obj[i][name1],s:+obj[i][name2]};
                subobj.push(sub)
                  }
          return subobj
}


function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

function unique(arr, keyProps) {
     const kvArray = arr.map(entry => {
      const key = keyProps.map(k => entry[k]).join('|');
      return [key, entry];
     });
     const map = new Map(kvArray);
     return Array.from(map.values());
    }

function makesankeyplot(source,target,vals,label,myColor){
var data = {
  type: "sankey",
  orientation: "h",
  node: {
    pad: 15,
    thickness: 30,
    line: {
      color: "black",
      width: 0.5
    },
   label: label,
   color: myColor
      },

  link: {
    source: source,
    target: target,
    value:  vals
  }
}

var data = [data]


var layout = {
  title: "Example of Sankey Plot",
  width: 1118,
  height: 772,
  font: {
    size: 10
  }
}


Plotly.newPlot('myDiv', data, layout)
}

function readfile(e){
    var file = document.getElementById("myfile").files[0];
    const reader = new FileReader();
    reader.addEventListener('load', e => {
        const csvData = e.target.result.toString();
        console.log('CSV Data:', csvData);
        appendJsonToTable(csvToJSON(csvData))
        test=csvToJSON(csvData)
        source=makestring(test,"link_s")
        target=makestring(test,"link_t")
        vals=makestring(test,"value")

        sub_s = pick(test, 'label_s', 'link_s')
        sub_t = pick(test, 'label_t', 'link_t')

        seen={}
        sub=sub_s.concat(sub_t)
                .filter(entry => {
                     const key = entry.l + "\u0000" + entry.s;
                     const keep = !seen[key];
                      if (keep) {
                        seen[key] = true;
                      }
                      return keep;
                    })
                 .filter(x=>{return x['l'] !== undefined})
                 .filter(x=>{return x['s'] !== NaN})


       suborder=sub.sort(
                    (p1, p2) => (p1.s > p2.s) ? 1 : (p1.s < p2.s) ? -1 : 0);
       label=makestring(suborder,"l")
       console.log('subset',suborder)
         console.log('subset',label)


//       var myColor = d3.scaleSequential()
//       .interpolator(d3.interpolateInferno)
//      .domain([0,label.length])
        myColor=color.slice(0,label.length)

        console.log(source)
        console.log(target)
        console.log(vals)
        console.log(label)
        console.log(myColor)

         makesankeyplot(source,target,vals,label,myColor)
    })
    reader.readAsText(file, 'UTF-8')
}

