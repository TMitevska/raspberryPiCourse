const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let courses = []

app.get( "/courses", (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  if(courses) {
  	data+='<h3>Courses:</h3><ol>'
  	courses.forEach(course => data+='<li>' + JSON.stringify(course) + '</li>')
  	data+='</ol>'
  }
  res.write(data + '</body></html>')
  res.end()
});

app.get( "/courses/:id", (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  var data = '<html><body>'
  if(courses.filter(v => v.id === req.params.id).length) {
  	data+='<h3>JSON.stringify(courses[0])</h3><ol>'
  }
  res.write(data + '</body></html>')
  res.end()
});

app.post( "/courses", (req, res) => {
  const course = {id: req.body.id, name: req.body.name, startDate: req.body.startDate, endDate: req.body.endDate}
  courses.push(course)
  res.send('Created new course ' + course)
  res.end()
});

app.put("/courses/:id", (req, res) => {
  const course = {id: req.params.id, name: req.body.name, startDate: req.body.startDate, endDate: req.body.endDate}
  courses.forEach(function(item, i) { if (item.id === req.params.id) courses[i] = course })
  res.send('Edited course ' + course.name)
  res.end()
})

app.delete("/courses/:id", (req, res) => {
  courses = courses.filter(v => v.id !== req.params.id); 
  res.send('Deleted course with id ' + req.params.id)
  res.end()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
