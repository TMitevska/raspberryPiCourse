const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let students = []

app.route('/students')
.get(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  if(students) {
  	data+='<h3>Students:</h3><ol>'
  	students.forEach(student => data+='<li>' + student + '</li>')
  	data+='</ol>'
  }
  res.write(data + '</body></html>')
  res.end()
})
.post(function (req, res) {
  const student = req.body.name
  students.push(student)
  res.send('Created new student ' + student)
  res.end()
})
.put(function (req, res) {
  const name = req.body.name
  const studentNameAfter = req.body.nameAfter
  students.forEach(function(item, i) { if (item === name) students[i] = studentNameAfter })
  res.send('Edited student ' + name)
  res.end()
})
.delete(function (req, res) {
  const student = req.body.name
  students = students.filter(v => v !== student); 
  res.send('Deleted student ' + student)
  res.end()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
