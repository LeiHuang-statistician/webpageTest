
  function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("customers");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([1,100])

var div = d3.select("body")
	.append("div")  // declare the tooltip div
	.style("position", "absolute")
	.style("padding","150px")
	//.style("background-color", "lightblue")
	.style("border-radius","30px")
	.style("border","1px solid #4CAF50")
	.style("left", "600px")
	.style("top", "100px")
	.attr("class", "tooltip")              // apply the 'tooltip' class
	.style("opacity", 0);
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




      var table = d3.select('body').append('table')
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
      .text(d=>d.value)
      .style("background-color", d=>myColor(d.value))
      .style("color",d=>($.isNumeric(d.value) & d.value<=10) ? 'red':'black')
      	// Tooltip stuff after this
	    .on("mouseover", function(event,d,i) {
            div.transition()
				.duration(500)
				.style("opacity", 0);
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div	.html('<br>'+
				'<a href= "http://google.com">' + // The first <a> tag
				formatN(d.value) +
				"</a>" +                          // closing </a> tag
				"<br><br>"  + d.note)

			})
		 .on("mouseout", (event, d) => {
           div.style("opacity", 0)
           })
       .html(d=>$.isNumeric(d.value) ? formatN(d.value):d.value)






//$('td:nth-child(2)').css('color','red')
//$(function() {
//  $("td:nth-child(2)").each(function() {
//        if ($(this).text() <"10") {
//      $(this).css('color', 'red');
//    }
//  });
//});

});