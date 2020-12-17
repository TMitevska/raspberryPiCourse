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

app.get( "/courses", (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  
  db.collection('courses').get().then(doc => {
    if(doc) {
  	data+='<h3>Courses:</h3><ol>'
  	doc.forEach(course => data+='<li>' + course.id + ' - ' + course.data().name + '</li>')
  	data+='</ol>'
    }
    res.write(data + '</body></html>')
    res.end()
  });
})
app.post( "/courses", (req, res) => {
  const course = {name: req.body.name, startDate: req.body.startDate, endDate: req.body.endDate}
  db.collection('courses').add(course).then(() => {
      res.send('Created new course ' + course.name)
      res.end()
  });
})
app.put("/courses/:id", (req, res) => {
  const course = {name: req.body.name, startDate: req.body.startDate, endDate: req.body.endDate}
  const id = req.body.id
  db.collection('courses').doc(req.params.id).set(course).then(() => {
     res.send('Edited course ' + course.name)
     res.end()
  });
})
app.delete("/courses/:id", (req, res) => {
  const id = req.params.id
  db.collection('courses').doc(id).delete().then(() => {
     res.send('Deleted course ' + id)
     res.end()
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
