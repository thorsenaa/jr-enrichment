const Sequelize = require('sequelize');


const db = new Sequelize('postgres://localhost/juniorenrichment', {
  logging: false
});


const Student = {
	/* STUDENT MODEL CODE HERE */
}

const Teacher = {
	/* TEACHER MODEL CODE HERE */
}

module.exports = {db, Student, Teacher}