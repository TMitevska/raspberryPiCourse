const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let courses = []
let students = []

app.route('/courses')
.get(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  if(courses) {
  	data+='<h3>Courses:</h3><ol>'
  	courses.forEach(course => data+='<li>' + course + '</li>')
  	data+='</ol>'
  }
  res.write(data + '</body></html>')
  res.end()
})
.post(function (req, res) {
  const course = req.body.name
  courses.push(course)
  res.send('Created new course ' + course)
  res.end()
})
.put(function (req, res) {
  const name = req.body.name
  const courseNameAfter = req.body.nameAfter
  courses.forEach(function(item, i) { if (item === name) courses[i] = courseNameAfter })
  res.send('Edited course ' + name)
  res.end()
})
.delete(function (req, res) {
  const course = req.body.name
  courses = courses.filter(v => v !== course); 
  res.send('Deleted course ' + course)
  res.end()
})

app.route('/students')
.get(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  if(courses) {
  	data+='<h3>Students:</h3><ol>'
  	students.forEach(student => data+='<li>' + student.name + " - " + student.courseName + '</li>')
  	data+='</ol>'
  }
  res.write(data + '</body></html>')
  res.end()
})
.post(function (req, res) {
  const student = { name: req.body.name, courseName: req.body.courseName}
  if ( courses.filter(v => v === student.courseName).length) {
    students.push(student)
    res.send('Created new student ' + JSON.stringify(student))
  } else {
    res.send('Course does not exist')
  }
  res.end()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
