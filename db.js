const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/juniorenrichment', {
  logging: false
});

/* STUDENT MODEL CODE HERE */
const Student = db.define('student', {
	name: {
		type: Sequelize.STRING,
		unique: false
	},
	gpa: {
		type: Sequelize.DECIMAL(2,1)
	}
},
	{
		getterMethods: {
			grade: function (){
				return ['F', 'D', 'C', 'B', 'A']
				[Math.floor(this.gpa)]
			}
		}
	}
)

/*
Class Method
*/
Student.perfect = function() {
	return Student.findAll({
		where: { gpa:4.0 },
	})
}

/* TEACHER MODEL CODE HERE */
const Teacher = db.define('teacher', {
	name: Sequelize.STRING,
	subject: Sequelize.STRING
});

Student.belongsTo(Teacher)
Teacher.hasMany(Student)

module.exports = {db, Student, Teacher}
