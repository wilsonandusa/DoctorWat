var Crawler = require('crawler')
var shell = require('electron').shell
var terminal = require('shelljs')
var data = require('./data.json')

function patientID () {
  var patientID = document.getElementById('data').value
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === patientID) {
      var node = document.getElementById('search_result')
     while (node.hasChildNodes()) {
       node.removeChild(node.lastChild)
     }
     var box = document.createElement('div')
     box.className = 'search_result_box'
     var name = document.createElement('div')
     name.innerHTML = 'Name: ' + data[i].firstName + ' ' + data[i].lastName
     var age = document.createElement('div')
     age.innerHTML = 'Age:' + data[i].age
     var description = document.createElement('div')
     description.innerHTML = 'Health History: ' + data[i].heathHistory
     var phone = document.createElement('div')
     phone.innerHTML = 'Phone: ' + data[i].phone
     box.appendChild(name)
     box.appendChild(age)
     box.appendChild(description)
     box.appendChild(phone)
     node.appendChild(box)
    }
  }
}
function listen (link) {
  document.getElementById('msg-center').innerHTML = 'Please speak to the microphone...'
  var child = terminal.exec('node tjBot.js', {async:true});
  child.stdout.on('data', function(data) {

})
}
function see (link) {
  document.getElementById('msg-center').innerHTML = 'Taking photo...'
  var child = terminal.exec('node see.js', {async:true});
  child.stdout.on('data', function(data) {
  })
}
function analysis (link) {
  document.getElementById('msg-center').innerHTML = 'Taking photo...'
  var child = terminal.exec('node analysis.js', {async:true});
  child.stdout.on('data', function(data) {
  })
}
function google (item) {
  document.getElementById('msg-center').innerHTML = 'Searching...'
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
         var description = document.createElement('div')
         description.innerHTML = intros[i]
         var name = document.createElement('u')
         name.innerHTML = names[i]
         name.id = i
         name.addEventListener('click', function () {
           console.log(links[this.id])
           shell.openExternal(links[this.id])
         })
         box.appendChild(name)
         box.appendChild(description)
         boxList.appendChild(box)
       }
       document.getElementById('msg-center').innerHTML = 'Searching Finished'
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
