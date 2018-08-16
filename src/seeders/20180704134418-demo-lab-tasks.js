const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const LabTask = sequelize.import('../models/lab_task.js');
    const Teacher = sequelize.import('../models/teacher.js');
    const Course = sequelize.import('../models/course.js');
    return LabTask.bulkCreate(await generate10LabTasks(Teacher, Course), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_tasks', null, {}); },
};

async function generate10LabTasks(Teacher, Course) {
  const teachers = await Teacher.findAll({ attributes: ['id'] });
  const courses = await Course.findAll({ attributes: ['id'] });
  const labTasks = [];
  labTasks.push({
    id: 1,
    teacherId: '1',
    courseId: '1',
    mongoFileId: '1',
  });
  for (let i = 0; i < 10; i += 1) {
    const teacherIndex = faker.random.number(teachers.length - 1);
    const courseIndex = faker.random.number(courses.length - 1);
    labTasks.push({
      teacherId: teachers[teacherIndex].id,
      courseId: courses[courseIndex].id,
      mongoFileId: faker.random.number(10) + 1,
    });
  }
  return labTasks;
}
