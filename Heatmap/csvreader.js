
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


     
function percentRank(array, n) {
    var L = 0;
    var S = 0;
    var N = array.length

    for (var i = 0; i < array.length; i++) {
        if (array[i] < n) {
            L += 1
        } else if (array[i] === n) {
            S += 1
        } else {

        }
    }

    var pct = (L + (0.5 * S)) / N

    return pct
}