const express = require('express');
const app = express();
//or router = express.Router();

//const nunjucks = require('nunjucks');

const db = require('./db').db;
const Student = require('./db').Student;
const Teacher = require('./db').Teacher;

const bodyParser = require('body-parser');
// app.use(express.static('public'));
// var env = nunjucks.configure('views', {noCache: true});
// app.set('view engine', 'html');
// app.engine('html', nunjucks.render);
// app.use(bodyParser.urlencoded({extended: false}));
let PORT = 8080;

app.get("/test", (req, res, next) => {
	// Visit http://localhost:8080/test to see the message!
	res.send("Hello GET Route!")
})
/* 
 Your Route Code Here
*/

//GET all students and return them in json - PASSING
app.get("/students", (req, res, next) => {

	Student.findAll()
	.then(students => res.json(students));

})

//GET student by ID # and return a json of that student - NOT WORKING
app.get("/:studentsId", (req, res, next) => {
	const id = req.params.student;
	console.log(id);
	//console.log("req.params.student", req.params.id)
		Student.findById({
			where : id
		})
		.then(student => res.json(student));	
	})

//Adding POST for testing - NOT WORKING
app.get("/", (req, res, next) => {
		console.log(req.body)
		Student.create(req.body)
		.then(students => res.json(students).sendStatus(201))
		.catch(next);
	})

//UPDATE a student's teacher and return a status code of 204 - INC
app.put("/:studentId", (req, res, next) => {
	const id = req.params.student
	Student.findById(id)
	//?
})

//DELETE a student and return a status code of 202
app.delete('/:studentId', (req, res, next) =>  {
	const id = req.params.student;
	Student.destroy({
		where: {
			id
		}
	})
	Student.findById({
		where: {
			id
		}
	})
	.then(() => {
		res.sendStatus(202)
	})
})

db.sync({force: true})
.then(() => {
	console.log('db synced')
	app.listen(PORT, () => console.log(`server listening on port ${PORT}`))

	const students = Promise.all([
		{name: 'ashi', gpa: 2.7},
		{name: 'emily', gpa: 4.0},
		{name: 'bob', gpa: 3.7},
		{name: 'donnie', gpa: 0},
	].map(data => Student.create(data)))

	const teachers = Promise.all([
		{name: 'dan'},
		{name: 'david'}
	].map(data => Teacher.create(data)))

	Promise.all([students, teachers])
		.then(([
			[ashi, emily, bob, donnie],
			[dan, david],
		]) => Promise.all([
			ashi.setTeacher(dan),
			bob.setTeacher(david),
			emily.setTeacher(david),
			dan.addStudent(donnie),
		]))
		.then(() => {
			console.log('database seeded.')
		})
});