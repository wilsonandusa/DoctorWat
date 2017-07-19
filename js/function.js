var Crawler = require('crawler')
var shell = require('electron').shell

function google (item) {
  var url = 'https://www.google.com/search?q='
  if (item === undefined) {
    url += document.getElementById('search').value
  } else {
    url += item
  }
   console.log(url)
   var names = []
   var links = []
   var intros = []
   var c = new Crawler({
   maxConnections: 10,
   callback: function (error, res, done) {
     if (error) {
       console.log(error)
     } else {
        var $ = res.$
        $('.g').each(function (i, elem) {

          try {
            var name = $(this).find('h3').text()
            var intro = $(this).find('span').text()
            var link = $(this).find('h3 > a').attr('href')
            link = link.substring(link.indexOf('http'))
            link = link.substring(0, link.indexOf('&sa=U'))
            if (name.length > 0 && intro.length > 0 && link.length > 0) {
              names.push(name)
              intros.push(intro)
              links.push(link)
            }
          } catch (e) {
            console.log(e)
          } finally {

          }

        })
        console.log(links)
        console.log(names)
        console.log(intros)
        var node = document.getElementById('search_result')
       while (node.hasChildNodes()) {
         node.removeChild(node.lastChild)
       }
       var boxList = document.getElementById('search_result')
       for (var i = 0; i < names.length; i++) {
         // set up info rows
         var box = document.createElement('div')
         box.className = 'search_result_box'
        //  var description = document.createElement('div')

         var name = document.createElement('u')
         name.innerHTML =  names[i]
         name.id = i
         name.addEventListener('click', function () {
           console.log(links[this.id])
           shell.openExternal(links[this.id])
         })
         box.appendChild(name)
         boxList.appendChild(box)
       }
      }
     done()
   }
  })
  c.queue([
   url
  ])
}

function database () {

}
