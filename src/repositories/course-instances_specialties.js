'use strict';

const errors = require('@feathersjs/errors');

const { handleId, appendParentData, appendParentDataDeep } = require('../helpers/util');

module.exports = function createCourseInstancesRepository(sqlConnection) {
  const { models } = sqlConnection;

  const { CourseInstanceSpecialty, CourseInstance, Specialty } = models;

  const queryParamsBindings = {
    specialtyId: [Specialty],
    courseInstanceId: [CourseInstance],
    groupId: [Specialty, models.Group],
    courseId: [CourseInstance, models.Course],
    teacherId: [CourseInstance, models.Teacher],
    labReportId: [CourseInstance, models.LabReport],
    studentId: [Specialty, models.Group, models.Student],
  };

  const projector = (row) => {
    return {
      id: row.id,
      specialtyId: row.specialtyId,
      specialty: {
        id: row.specialty.id,
        name: row.specialty.name,
        description: row.specialty.description,
      },
      courseInstanceId: row.courseInstanceId,
      courseInstance: {
        id: row.courseInstance.id,
        teacherId: row.courseInstance.teacherId,
        teacher: {
          id: row.courseInstance.teacher.id,
          firstName: row.courseInstance.teacher.firstName,
          lastName: row.courseInstance.teacher.lastName,
          email: row.courseInstance.teacher.email,
          phoneNumber: row.courseInstance.teacher.phoneNumber,
        },
        courseId: row.courseInstance.courseId,
        course: {
          id: row.courseInstance.course.id,
          name: row.courseInstance.course.name,
          description: row.courseInstance.course.description,
        },
        fileExists: row.courseInstance.labTasksFileId !== null,
      },
    };
  };

  async function list(queryParams) {
    const { limit, offset } = queryParams;

    const filter = {
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    };

    let results = await handleId(queryParams, CourseInstanceSpecialty, filter, queryParamsBindings);

    if (!results) results = await CourseInstanceSpecialty.findAndCountAll(filter);

    await appendParentData(results.rows, Specialty);
    await appendParentDataDeep(results.rows, [CourseInstance, models.Course]);
    await appendParentDataDeep(results.rows, [CourseInstance, models.Teacher]);

    results.rows = results.rows.map(projector);

    return results;
  }

  async function view(id) {
    const row = await CourseInstanceSpecialty.findById(id);

    await appendParentData([row], Specialty);
    await appendParentDataDeep([row], [CourseInstance, models.Course]);
    await appendParentDataDeep([row], [CourseInstance, models.Teacher]);

    return projector(row);
  }

  async function exists(id) {
    const result = await CourseInstanceSpecialty.findById(id);
    if (!result) return false;
    return true;
  }

  async function add({ courseInstanceId, specialtyId }) {
    const courseInstance = await CourseInstance.findById(courseInstanceId);
    if (!courseInstance) throw new errors.NotFound('COURSE_INSTANCE_NOT_FOUND');
    const specialty = Teacher.findById(specialtyId);
    if (!specialty) throw new error.NotFound('TEACHER_NOT_FOUND');
    const row = await CourseInstanceSpecialty.findOne({
      where: {
        courseInstanceId,
        specialtyId,
      },
    });
    if (row) {
      throw new errors.Conflict('RESOURCE_ALREADY_EXISTS', {
        reason: 'There is a already a combination of these 2 resources and there can only be one',
      });
    }

    return CourseInstanceSpecialty.create({
      courseInstanceId,
      specialtyId,
    });
  }

  async function remove(id) {
    return CourseInstanceSpecialty.destroy({
      where: { id },
    });
  }

  return {
    list,
    view,
    exists,
    add,
    remove,
  };
};
