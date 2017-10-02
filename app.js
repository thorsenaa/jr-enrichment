const express = require('express');
const app = express();
//or router = express.Router();

//const nunjucks = require('nunjucks');

const db = require('./db').db;
const Student = require('./db').Student;
const Teacher = require('./db').Teacher;


const bodyParser = require('body-parser');

// this you need for body parser to work ie to have a req.body for you 

app.use(bodyParser.urlencoded({extended: false}));


// *** You don't need any of these below bevause it is only for rendering if you use nunjuncks not improtant for the checkpoint  
// app.use(express.static('public'));
// var env = nunjucks.configure('views', {noCache: true});
// app.set('view engine', 'html');
// app.engine('html', nunjucks.render);


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

//**** you need to add the students infront of the studentId so you can get the correct one 
app.get("/students/:studentId", (req, res, next) => {

	const id = req.params.studentId;
	// console.log(id);

	// ** your req.params is the same as what you call it on the URI in the app.get("/:studentsID")
		// so your req.params.studentId is what you want (check it below in the console log i changed)

	console.log("req.params.studentId", req.params.studentId)

	//**  findById takes in just the id as a number not where so it would look like this 
		// var id = req.params.studentId
		//Student.findById(id).then( student => res.json(student))
	// ** You can use findOne which uses the where like this 
		// Student.findOne({where{id:id}}).then(student => res.json(student))
		// with es6 destruct

		Student.findOne({
			where: {id: id}
		})
		.then(student => res.json(student));	
	})

	//** this looks right 

//Adding POST for testing - NOT WORKING

//** This need to be app.post for it to work and if you switch it does work! so YAYA! 
app.get("/", (req, res, next) => {
		console.log(req.body)
		Student.create(req.body)
		.then(students => res.json(students).sendStatus(201))
		.catch(next);
	})

//UPDATE a student's teacher and return a status code of 204 - INC

//** add in the students again 
app.put("/students/:studentId", (req, res, next) => {
	//** same applies for the req.params 
	// so you wanna say the below 
	const id = req.params.studentId

	// first you want to find the find student first 
	Student.findById(id)
	//then you want to update it with the req.body
	// the req.body should be what you want updated usually comes from the specs
	.then(student => student.update(req.body))
	//then you want to send the updated student as a response as such and sometimes with a status code
	.then(updatedStudent => res.json(updatedStudent))
})

//DELETE a student and return a status code of 202

//** just keep them consistent so students/:studentId
app.delete('/students/:studentId', (req, res, next) =>  {
	//*** same for the req. params 
	const id = req.params.studentId;

	//***so you can use either version written below 

	// option 1 use the destroy method to find it and remove it and then send status 
	Student.destroy({
		where: {
			id
		}
	})
	.then(() => {
		res.sendStatus(202)
	})

	//option 2 is find it then delete it 
	Student.findOne( {where:{id:id}} )
	.then( student => student.delete())
	.then( ()=> res.sendStatus(202))
	// you use the anon function because I believe .then only takes a function
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