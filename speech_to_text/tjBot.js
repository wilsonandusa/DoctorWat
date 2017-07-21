var TJBot = require('tjbot')
var config = require('./config.js')

listenToSearch()

function listenToSearch () {
  var credentials = config.credentials
  var hardware = ['microphone']
  var tjConfig = {
    log: {
        level: 'verbose'
    }
}
var tj = new TJBot(hardware, tjConfig, credentials)
tj.listen(function(msg) { 
    
var message = msg.toLowerCase()
console.log(message)
})
}
