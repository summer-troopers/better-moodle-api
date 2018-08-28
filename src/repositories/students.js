'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId, appendParentDataDeep, appendDependentData } = require('../helpers/util');
const { assert } = require('../helpers/db');

module.exports = function createStudentsRepository(connection) {
  const { models } = connection;

  const {
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
    LabReport,
    CourseInstance,
  } = models;

  const projector = (row) => {
    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      phoneNumber: row.phoneNumber,
      email: row.email,
      groupId: row.groupId,
      group: {
        id: row.group.id,
        name: row.group.name,
        specialtyId: row.group.specialtyId,
        specialty: {
          id: row.group.specialty.id,
          name: row.group.specialty.name,
          description: row.group.specialty.description,
        },
      },
      labReports: row.labReports.map((labReport) => {
        return {
          id: labReport.id,
          review: labReport.review,
          mark: labReport.mark,
          studentId: labReport.studentId,
          courseInstanceId: labReport.courseInstanceId,
          courseInstance: {
            id: labReport.courseInstance.id,
            teacherId: labReport.courseInstance.teacherId,
            teacher: {
              id: labReport.courseInstance.teacher.id,
              firstName: labReport.courseInstance.teacher.firstName,
              lastName: labReport.courseInstance.teacher.lastName,
              phoneNumber: labReport.courseInstance.teacher.phoneNumber,
              email: labReport.courseInstance.teacher.email,
            },
            courseId: labReport.courseInstance.courseId,
            course: {
              id: labReport.courseInstance.course.id,
              name: labReport.courseInstance.course.name,
              description: labReport.courseInstance.course.description,
            },
          },
        };
      }),
    };
  };

  const queryParamsBindings = {
    labReportId: [LabReport],
    groupId: [Group],
    specialtyId: [Group, Specialty],
    courseInstanceId: [Group, Specialty, CourseInstance],
    courseId: [Group, Specialty, CourseInstance, Course],
    teacherId: [Group, Specialty, CourseInstance, Teacher],
  };

  // eslint-disable-next-line complexity
  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
    } = queryParams;

    const filter = {
      limit,
      offset,
      where: {
        firstName: {
          [Op.like]: [`%${contains}%`],
        },
      },
      order: [
        ['updatedAt', 'DESC'],
      ],
    };

    let students = await handleId(queryParams, Student, filter, queryParamsBindings);

    if (!students) students = await Student.findAndCountAll(filter);

    await appendParentDataDeep(students.rows, [Group, Specialty]);
    await appendDependentData(students.rows, { parent: Student, dependent: LabReport });
    await Promise.all(students.rows.map(student => appendParentDataDeep(student.labReports, [CourseInstance, Course])));
    await Promise.all(students.rows.map(student => appendParentDataDeep(student.labReports, [CourseInstance, Teacher])));

    students.rows = students.rows.map(projector);

    return students;
  }


  async function view(id) {
    const student = await Student.findById(id);

    await appendParentDataDeep([student], [Group, Specialty]);
    await appendDependentData([student], { parent: Student, dependent: LabReport });
    await appendParentDataDeep(student.labReports, [CourseInstance, Course]);
    await appendParentDataDeep(student.labReports, [CourseInstance, Teacher]);

    return projector(student);
  }

  async function add(data) {
    assert.notTaken.email(data.email, [models.Admin, models.Teacher, Student]);

    const group = await Group.findById(data.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.create(data);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    assert.notTaken.email(data.email, [models.Admin, models.Teacher, Student]);

    const group = await Group.findById(data.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.update(data, {
      where: { id },
    });
  }

  async function remove(id) {
    try {
      return await Student.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_STUDENT');
      }
      throw error;
    }
  }

  return {
    list,
    view,
    add,
    update,
    remove,
    exists,
  };
};
