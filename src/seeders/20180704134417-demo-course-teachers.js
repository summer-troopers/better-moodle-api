const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const CourseTeacher = sequelize.import('../models/course_teacher.js');
    const Course = sequelize.import('../models/course.js');
    const Teacher = sequelize.import('../models/teacher.js');
    return CourseTeacher.bulkCreate(await generate10Connections(Course, Teacher), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses_teachers', null, {}); },
};

async function generate10Connections(Course, Teacher) {
  const courses = await Course.findAll({ attributes: ['id'] });
  const teachers = await Teacher.findAll({ attributes: ['id'] });
  const connections = [];
  connections.push({
    teacherId: '1',
    courseId: '1',
  });
  for (let i = 0; i < 10; i += 1) {
    const courseIndex = faker.random.number(courses.length - 1);
    const teacherIndex = faker.random.number(teachers.length - 1);
    connections.push({
      teacherId: teachers[teacherIndex].id,
      courseId: courses[courseIndex].id,
    });
  }
  return connections;
}
