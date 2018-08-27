'use strict';

const errors = require('@feathersjs/errors');

const { handleId, appendParentData } = require('../helpers/util');

module.exports = function createCourseInstancesRepository(sqlConnection) {
  const { models } = sqlConnection;

  const { CourseInstanceSpecialty } = models;

  const queryParamsBindings = {
    specialtyId: [models.Specialty],
    courseInstanceId: [models.CourseInstance],
    groupId: [models.Specialty, models.Group],
    courseId: [models.CourseInstance, models.Course],
    teacherId: [models.CourseInstance, models.Teacher],
    labReportId: [models.CourseInstance, models.LabReport],
    studentId: [models.Specialty, models.Group, models.Student],
  };

  const projector = (row) => {
    return {
      id: row.id,
      courseInstanceId: row.courseInstanceId,
      specialtyId: row.specialtyId,
      courseInstance: {
        id: row.courseInstance.id,
        teacherId: row.courseInstance.teacherId,
        courseId: row.courseInstance.courseId,
        fileExists: row.courseInstance.labTasksFileId !== null,
      },
      specialty: {
        id: row.specialty.id,
        name: row.specialty.name,
        description: row.specialty.description,
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

    let results = await handleId(queryParams, CourseInstance, filter, queryParamsBindings);

    if (!results) results = await CourseInstanceSpecialty.findAndCountAll(filter);

    await appendParentData(results.rows, models.CourseInstance);
    await appendParentData(results.rows, models.Specialty);

    results.rows = results.rows.map(projector);

    return results;
  }

  async function view(id) {
    const row = await CourseInstanceSpecialty.findById(id);

    await appendParentData([row], models.CourseInstance);
    await appendParentData([row], models.Specialty);

    return row;
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
