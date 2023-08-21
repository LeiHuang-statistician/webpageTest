
svgdiv()


// var urlx=$('#jpg-export')[0].currentSrc

// $('#jpg-export').attr("src",  urlx)

function Export2Doc2(element, filename = '') {
  $("#svgdiv").remove(); /*delete svg*/
  url=Export2Doc(element)
    filename = filename ? filename + '.doc' : 'document.doc';

    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {

        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
    
}


