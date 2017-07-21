var TJBot = require('tjbot')
var config = require('./config-analysis.js')
var logPath = '/home/pi/Desktop/log/'
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

var fileName = mm + '-' + dd + '-' + yyyy + '.log.md'
var fs = require('fs')
var txt = fs.readFileSync(logPath + fileName)
var credentials = config.credentials
var hardware = []
var tjConfig = {
    log: {
        level: 'verbose'
    }
}
var tj = new TJBot(hardware, tjConfig, credentials)

tj.analyzeTone(txt).then(function(tone){

	console.log('Analyzing...') 
	tone.document_tone.tone_categories.forEach(function(category){
	console.log(category)
	})
})