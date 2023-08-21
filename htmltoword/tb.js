d3.csv('data2.csv').
    then(data=>{
        data.forEach(d=>{
      d.variable=d.variable.split(",")
      d.aror=+d.aror
      d.asd=+d.asd
      d.maxdd=+d.maxdd
      d.variable_nt=d.variable_nt
      d.aror_nt=d.aror_nt.split(",")
      d.asd_nt=d.asd_nt.split(",")
      d.maxdd_nt=d.maxdd_nt.split(",")
      //console.log(data)
      })
    // the columns you'd like to display
    console.log(data)
    function formatN(n) {
             return parseFloat(n).toFixed(2);
            };
    //var columns = ['variable','aror','asd','maxdd', ]
    var columns = ['variable','aror_nt','asd_nt','maxdd_nt']




var table = d3.select('.WordSection1')
              .append('table')
                  .attr('id','customers')
var thead = table.append('thead')
var tbody = table.append('tbody')


thead.append('tr')
.selectAll('th')
.data(columns)
.enter()
.append('th')
.text(d=>d)


var rows = tbody.selectAll('tr')
.data(data)
.enter()
.append('tr')
.attr('id',(d,i)=>i%2===0 ? "even-row" : "odd-row")


var cells = rows.selectAll('td')
.data(function(row) {
    return columns.map(function (column) {
        return { column: column,
                    value: row[column][0].match((/\d+/g))!=null ? +row[column][0]:row[column][0],
                    note: row[column][1]}
    })
})
.enter()
.append('td')
.attr('id',(d,i)=>i===0 ? "first-column" : "")
.html(d=>d.value)
});