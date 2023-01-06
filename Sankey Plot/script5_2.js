var units = " ";

var margin = {
        top:100,
        right: 30,
        bottom: 10,
        left: 30
    },
    width = 960 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
        return formatNumber(d) + " " + units;
    }//,
    //color = d3.scale.category20();


function sankeygraph(){

// append the svg canvas to the page
var svg = d3.select("body").append("svg")
    .attr("id","sankeysvg")
    .style("background", "white")
    .attr('xmlns',"http://www.w3.org/2000/svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
var defs = svg.append("defs");

// Set the sankey diagram properties
var sankey = d3sankey()
    .nodeWidth(17)
    .nodePadding(27)
    .size([width, height]);

var path = sankey.link();

// load the data
var graph = getData();

sankey.nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

// define utility functions
function getGradID(d){
    return "linkGrad-" + d.source.name + "-" + d.target.name;
}
function nodeColor(d) {
        //return d.color = color(d.name.replace(/ .*/, ""));
    return d.color
}

// create gradients for the links

var grads = defs.selectAll("linearGradient")
        .data(graph.links, getGradID);

grads.enter().append("linearGradient")
        .attr("id", getGradID)
        .attr("gradientUnits", "userSpaceOnUse");

function positionGrads() {
    grads.attr("x1", function(d){return d.source.x;})
        .attr("y1", function(d){return d.source.y;})
        .attr("x2", function(d){return d.target.x;})
        .attr("y2", function(d){return d.target.y;});
}
positionGrads();

grads.html("") //erase any existing <stop> elements on update
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", function(d){
        return nodeColor( (+d.source.x <= +d.target.x)?
                         d.source: d.target) ;
    });

grads.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", function(d){
        return nodeColor( (+d.source.x > +d.target.x)?
                         d.source: d.target)
    });

// add in the links
var link = svg.append("g").selectAll(".link")
    .data(graph.links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", function(d){
        return "url(#" + getGradID(d) + ")";
    })
    .style("stroke-opacity", "0.4")
    .on("mouseover", function() { d3.select(this).style("stroke-opacity", "0.7") } )
    .on("mouseout", function() { d3.select(this).style("stroke-opacity", "0.4") } )
    .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
        return b.dy - a.dy;
    });

// add the link titles
link.append("title")
    .text(function (d) {
        return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

// add in the nodes
var node = svg.append("g").selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    })
    .call(d3.behavior.drag()
    .origin(function (d) {
        return d;
    })
    .on("dragstart", function () {
        this.parentNode.appendChild(this);
    })
    .on("drag", dragmove));

// add the rectangles for the nodes
node.append("rect")
    .attr("height", function (d) {
        return d.dy;
    })
    .attr("width", sankey.nodeWidth())
    .style("fill", function (d) {
            //return d.color = color(d.name.replace(/ .*/, ""));
    return d.color
    })
    .style("fill-opacity", ".9")
    .style("shape-rendering", "crispEdges")
    .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
    })
    .append("title")
    .text(function (d) {
        //return d.name + "\n" + format(d.value);
        return d.label + "\n" + format(d.value);

    });

// add in the title for the nodes

node.append("rect")
    .attr("class",'txtbg')
    .attr("x", -15)
    .attr("y", function (d) {
        return d.dy / 2-10;
    })
       .attr("width", 40)
      .attr("height", 20)
      .style("fill", "white")
      .style("opacity", "0.3")

node.append("text")
    .attr("x", 25)
    .attr("y", function (d) {
        return d.dy / 2;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("text-shadow", "0 1px 0 #fff")
    .attr("transform", null)
    .text(function (d) {
        //return d.name;
        return d.p;
    })
    .attr("font-weight", 700)
    .style('font-size',psize)

//    .filter(function (d) {
//        return d.x < width / 2;
//    })
//    .attr("x", 6 + sankey.nodeWidth())
//    .attr("text-anchor", "start");



textgdata=[{"name":"Visit 1", "x":-5,"y":350},
            {"name":"Visit 2", "x":120,"y":350},
             {"name":"Visit 3", "x":245,"y":350},
              {"name":"Visit 4", "x":370,"y":350},
               {"name":"Visit 5", "x":870,"y":350},
           ]

var drag=d3.behavior.drag()
    .origin(Object)
    .on("dragstart",dragtextstart)
    .on("dragend",dragtextend)
    .on("drag",dragtextmove)


textg=svg.selectAll('.textg').data(textgdata)
      .enter()
      .append("text")
      .attr("class",'visit' )
      .attr("x", d=>d.x)
      .attr("y", d=>d.y)
      .attr("dy", ".35em")
      .text(d=>d.name)
      .attr("font-weight", 700)
      .style('font-size',lgsize)
      .style('cursor', 'pointer')
      .call(drag)


 legendata=[{"label":"Normal", "color":"green", "x":300},
            {"label":"Above Normal", "color":"red","x":450},
            {"label":"Missing", "color":"blue", "x":650},
           ]
 svg.append('g').selectAll('.legendg')
  .data(legendata)
  .enter()
  .append("rect")
    .attr("height", 20)
    .attr("width", 20)
    .style("fill", d=>d.color)
    .attr("x", d=>d.x)
    .attr("y", 400)


  svg.selectAll("mylabels")
  .data(legendata)
  .enter()
  .append("text")
    .attr("x", d=>d.x+30)
    .attr("y", 410)
    .text(d=>d.label)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("font-weight", 700)
    .style('font-size',lgsize)

    function dragmove(d) {
    d3.select(this).attr("transform",
        "translate(" + (
    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))) + "," + (
    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
    positionGrads();
};


function dragtextstart(d) {
    text=d3.select(this)
};

function dragtextend(d) {
    d3.select(this)
};
function dragtextmove(d) {
    text=d3.select(this)
   text.attr("x",  Math.max(0, Math.min(width,d3.event.x)))
       .attr("y",  Math.max(0, Math.min(height+100,d3.event.y)))
};

}
psize=16
lgsize=20
plist=["100%","80.5%","19.2%","0.4%","61.7%","36.4%","2.0%","47.1%","52.2%","0.7%","15.0%","85.0%"]
sankeygraph()

 $(".rleg").keyup(function(){
   lgsize=this.value;
  $("#sankeysvg").remove();
  sankeygraph()
  });

   $(".rpct").keyup(function(){
   psize=this.value;
  $("#sankeysvg").remove();
  sankeygraph()
  });

function Geeks() {
            plist=[]
            var input = document.getElementsByName('array[]');

            for (var i = 0; i < input.length; i++) {
                var a = input[i];
                plist.push(a.value) ;
            }
             $("#sankeysvg").remove();
            sankeygraph()
        }

// the function for moving the nodes





function getData() {
    return {
        "nodes": [{
        "node": 0,
        "name": "NormalV1",
        "color":"green",
        "label": "Normal V1",
        "p":plist[0]
    }, {
        "node": 1,
        "name": "NormalV2",
        "color":"green",
        "label": "Normal V2",
        "p":plist[1]

    }, {
        "node": 2,
        "name": "AbovenormalV2",
        "color":"red",
        "label": "Abovenormal V2",
        "p":plist[2]
    }, {
        "node": 3,
        "name": "MissingV2",
        "color":"blue",
        "label": "Missing V2",
        "p":plist[3]

    }, {
        "node": 4,
        "name": "NormalV3",
        "color":"green",
        "label": "Normal V3",
        "p":plist[4]

    }, {
        "node": 5,
        "name": "AbovenormalV3",
        "color":"red",
        "label": "Abovenormal V3",
        "p":plist[5]


    }, {
        "node": 6,
        "name": "MissingV3",
        "color":"blue",
        "label": "Missing V3",
        "p":plist[6]

    }, {
        "node": 7,
        "name": "NormalV4",
        "color":"green",
        "label": "Normal V4",
        "p":plist[7]

    },{
        "node": 8,
        "name": "AbovenormalV4",
        "color":"red",
        "label": "Abovenormal V4",
        "p":plist[8]

    },{
        "node": 9,
        "name": "MissingV4",
        "color":"blue",
         "label": "Missing V4",
         "p":plist[9]

    },{
        "node": 10,
        "name": "NormalV5",
        "color":"green",
        "label": "Normal V5",
        "p":plist[10]

    },{
        "node": 11,
        "name": "AbovenormalV5",
        "color":"red",
        "label": "Abovenormal V5",
        "p":plist[11]

    },
    ],
        "links": [{
        "source": 0,
        "target": 1,
        "value": 2172
    }, {
        "source": 0,
        "target": 2,
        "value": 517
    }, {
        "source": 0,
        "target": 3,
        "value": 10
    }, {
        "source": 1,
        "target": 4,
        "value": 1660
    }, {
        "source": 1,
        "target": 5,
        "value": 470
    },{
        "source": 1,
        "target": 6,
        "value": 42
    }, {
        "source": 2,
        "target": 5,
        "value": 507
    }, {
        "source": 2,
        "target": 6,
        "value": 10
    }, {
        "source": 3,
        "target": 4,
        "value": 4
    }, {
        "source": 3,
        "target": 5,
        "value": 5
    },{
        "source": 3,
        "target": 6,
        "value": 1
    },{
        "source": 4,
        "target": 7,
        "value": 1248
    },{
        "source": 4,
        "target": 8,
        "value": 407
    },{
        "source": 4,
        "target": 9,
        "value": 9
    },{
        "source": 5,
        "target": 8,
        "value": 979
    },{
        "source": 5,
        "target": 9,
        "value": 3
    },{
        "source": 6,
        "target": 7,
        "value": 22
    },{
        "source": 6,
        "target": 8,
        "value": 24
    },{
        "source": 6,
        "target": 9,
        "value": 7
    },{
        "source": 7,
        "target": 10,
        "value": 403
    },{
        "source": 7,
        "target": 11,
        "value": 867
    },{
        "source": 8,
        "target": 11,
        "value": 1410
    },{
        "source": 9,
        "target": 10,
        "value": 1
    },{
        "source": 9,
        "target": 11,
        "value": 17
    }

    ]};
}

function d3sankey() {
    var sankey = {},
        nodeWidth = 20,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function (_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };

    sankey.nodePadding = function (_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
    };

    sankey.nodes = function (_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
    };

    sankey.links = function (_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
    };

    sankey.size = function (_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
    };

    sankey.layout = function (iterations) {

        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeAbsolutePositions()
        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
    };

    sankey.link = function () {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.sy + d.dy / 2,
                y1 = d.target.y + d.ty + d.dy / 2;
            return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
        }

        link.curvature = function (_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
        };

        return link;
    };

   function computeAbsolutePositions() {
    nodes[0].x = 5;
    nodes[0].y = 10.48;
    nodes[2].x = 133;
    nodes[2].y = 2.842;
    nodes[1].x = 133;
    nodes[1].y = 75.20;
    nodes[3].x = 133;
    nodes[3].y = -10;
    nodes[5].x = 256.5;
    nodes[5].y = 3.55;
    nodes[4].x = 256.5;
    nodes[4].y = 130.491;
    nodes[6].x = 256.5;
    nodes[6].y = -14;
    nodes[8].x = 380;
    nodes[8].y = 5;
    nodes[7].x = 380;
    nodes[7].y = 175.635;
    nodes[9].x = 380;
    nodes[9].y = -12;
    nodes[10].x = 883.5;
    nodes[10].y = 270.69;
     nodes[11].x = 883;
    nodes[11].y = 10.11;
   };




    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function (node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function (link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(
            d3.sum(node.sourceLinks, value),
            d3.sum(node.targetLinks, value));
        });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes,
            nextNodes,
            x = 0;

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
                node.x = x;
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function (link) {
                    nextNodes.push(link.target);
                });
            });
            remainingNodes = nextNodes;
            ++x;
        }

        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
        nodes.forEach(function (node) {
            if (!node.targetLinks.length) {
                node.x = d3.min(node.sourceLinks, function (d) {
                    return d.target.x;
                }) - 1;
            }
        });
    }

    function moveSinksRight(x) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.x = x - 1;
            }
        });
    }

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.x *= kx;
        });
    }

    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function (d) {
            return d.x;
        })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function (d) {
            return d.values;
        });

        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
            relaxRightToLeft(alpha *= 0.99);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
        }

        function initializeNodeDepth() {
            var ky = d3.min(nodesByBreadth, function (nodes) {
                return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
            });

            nodesByBreadth.forEach(function (nodes) {
                nodes.forEach(function (node, i) {
                    node.y = i;
                    node.dy = node.value * ky;
                });
            });

            links.forEach(function (link) {
                link.dy = link.value * ky;
            });
        }

        function relaxLeftToRight(alpha) {
            nodesByBreadth.forEach(function (nodes, breadth) {
                nodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedSource(link) {
                return center(link.source) * link.value;
            }
        }

        function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedTarget(link) {
                return center(link.target) * link.value;
            }
        }

        function resolveCollisions() {
            nodesByBreadth.forEach(function (nodes) {
                var node,
                dy,
                y0 = 0,
                    n = nodes.length,
                    i;

                // Push any overlapping nodes down.
                nodes.sort(ascendingDepth);
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) node.y += dy;
                    y0 = node.y + node.dy + nodePadding;
                }

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];
                if (dy > 0) {
                    y0 = node.y -= dy;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0) node.y -= dy;
                        y0 = node.y;
                    }
                }
            });
        }

        function ascendingDepth(a, b) {
            return a.y - b.y;
        }
    }

    function computeLinkDepths() {
        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
            var sy = 0,
                ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }
    }

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    return sankey;
};

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