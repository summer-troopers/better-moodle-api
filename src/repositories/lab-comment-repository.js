'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId, appendDependentData, projectDatabaseResponse } = require('../helpers/util');

module.exports = function createCommentRepository(connection) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabComment,
    LabTask,
    LabReport,
  } = connection.models;

  const projector = (item) => {
    return {
      id: item.id,
      labReportId: item.labReportId,
      teacherComment: item.teacherComment,
      mark: item.mark,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      labReport: {
        id: item.labReport.id,
        studentId: item.labReport.studentId,
        labTaskId: item.labReport.labTaskId,
        createdAt: item.labReport.createdAt,
        updatedAt: item.labReport.updatedAt,
      },
    };
  };

  const queryParamsBindings = {
    labReportId: [LabReport],
    studentId: [LabReport, Student],
    groupId: [LabReport, Student, Group],
    specialtyId: [LabReport, Student, Group, Specialty],
    courseId: [LabReport, LabTask, Course],
    teacherId: [LabReport, LabTask, Teacher],
    taskId: [LabReport, LabTask],
  };

  async function list(queryParams) {
    const {
      limit,
      offset,
    } = queryParams;

    const filter = {
      limit,
      offset,
    };

    let labComments = await handleId(queryParams, LabComment, filter, queryParamsBindings);

    if (!labComments) labComments = await LabComment.findAndCountAll(filter);

    await appendDependentData(labComments, LabReport);

    return projectDatabaseResponse(labComments, projector);
  }

  async function view(id) {
    const labComments = await LabComment.findAndCountAll({
      where: { id },
    });

    await appendDependentData(labComments, LabReport);

    const projectedLabComments = await projectDatabaseResponse(labComments, projector);

    return projectedLabComments.rows[0];
  }

  async function add(form) {
    const labReport = await LabReport.findById(form.labReportId);
    if (!labReport) throw new errors.NotFound('LAB_REPORT_NOT_FOUND');

    return LabComment.create(form);
  }

  async function exists(id) {
    const result = await LabComment.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const labReport = await LabReport.findById(form.labReportId);
    if (!labReport) throw new errors.NotFound('LAB_REPORT_NOT_FOUND');

    return LabComment.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return LabComment.destroy({
      where: { id },
    });
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
