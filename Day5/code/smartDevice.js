const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

const admin = require('firebase-admin')
const serviceAccount = require('./firebaseKey.json')

//initialize admin SDK using serciceAcountKey
admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

let historyList = [];

const observer = db.collection('devices')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        historyList.push('New device: ' + change.doc.data().device + " is " + change.doc.data().status + " ( created by " + change.doc.data().user + " at " + change.doc.data().date + " )");
      }
      if (change.type === 'modified') {
        historyList.push('Modified device: ' + change.doc.data().device + " is " + change.doc.data().status + " ( modified by " + change.doc.data().user + " at " + change.doc.data().date + " )");
      }
      if (change.type === 'removed') {
        historyList.push('Removed device: ' + change.doc.data().device + " is " + change.doc.data().status + " ( removed by " + change.doc.data().user + " at " + change.doc.data().date + " )");
      }
    });
});

app.get( "/home", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    var data = '<html><body>'
    
    data += '<head><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script>function getDeviceInfo() {const device = prompt("Please enter device name:", "Living room light1"); const user = prompt("Please enter user name:", "Tamara Mitevska"); const status = "on"; const date = new Date().toDateString(); const deviceInfo = {device, user, status, date};$.post("http://localhost:3000/devices", deviceInfo, function(result){alert("Device is registered!");});}; function preview(){window.location="http://localhost:3000/devices";}</script></head>'
  
    data += '<button onclick="getDeviceInfo()">Register device</button><br><br>'
    
    data += '<button onclick="preview()">Preview device status (real time)</button>'

    res.write(data + '</body></html>')
    res.end()
})

app.get( "/devices", (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  
  db.collection('devices').get().then(doc => {
    if(doc) {
  	data+='<h3>Registeres Devices:</h3><ol>'
  	doc.forEach(device => data+='<li>' + device.id + ' --> ' + device.data().device + " is " + device.data().status + '</li>')
  	data+='</ol>'
    }
    data += '<h3>History:</h3><ol>'
    historyList.forEach(item => data += '<li>' + item +'</li>')
    res.write(data + '</ol></body></html>')
    res.end()
  });
})

app.post( "/devices", (req, res) => {
  const deviceInfo = {device: req.body.device, user: req.body.user, status: req.body.status, date: req.body.date}
  db.collection('devices').add(deviceInfo).then(() => {
      res.send('Created new device ' + deviceInfo.device)
      res.end()
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
