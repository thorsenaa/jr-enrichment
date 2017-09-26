const Sequelize = require('sequelize');


const db = new Sequelize('postgres://localhost/juniorenrichment', {
  logging: false
});


const Student = db.define("student" , {
	/* STUDENT MODEL CODE HERE */
})
	

const Teacher = db.define('teacher', {
	/* TEACHER MODEL CODE HERE */
});

module.exports = {db, Student, Teacher}