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

app.route('/students')
.get(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  
  db.collection('students').get().then(doc => {
    if(doc) {
  	data+='<h3>Students:</h3><ol>'
  	doc.forEach(student => data+='<li>' + student.id + ' - ' + student.data().name + '</li>')
  	data+='</ol>'
    }
    res.write(data + '</body></html>')
    res.end()
  });
})
.post(function (req, res) {
  const name = req.body.name
  db.collection('students').add({
    name: name,
  }).then(() => {
      res.send('Created new student ' + name)
      res.end()
  });
})
.put(function (req, res) {
  const id = req.body.id
  const studentNameAfter = req.body.nameAfter
  db.collection('students').doc(id).set({
    name: studentNameAfter,
  }).then(() => {
     res.send('Edited student ' + studentNameAfter)
     res.end()
  });
})
.delete(function (req, res) {
  const id = req.body.id
  db.collection('students').doc(id).delete().then(() => {
     res.send('Deleted student ' + id)
     res.end()
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
