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
  var terms = ['diabetes','hiv','stroke','heart problem', 'lung cancer', 'cancer',
    'fever', 'get cold']
    var tj = new TJBot(hardware, tjConfig, credentials)
tj.listen(function(msg) {
    var message = msg.toLowerCase()
    if (terms.includes(message)) {
      document.getElementById('msg-center').innerHTML = 'Searching for ' + message + '...'
      google(message)
    }
    msg.indexOf("turn") >= 0

    if ((containsTurn || containsChange || containsSet) && containsLight) {
        // was there a color uttered?
        var words = msg.split(" ");
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (colors[word] != undefined || word == "on" || word == "off") {
                // yes!
                tj.shine(word);
                break;
            }
        }
    }
})
}
