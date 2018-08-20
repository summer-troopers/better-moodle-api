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
    labTaskId: [LabReport, LabTask],
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

  async function add(data) {
    const labReport = await LabReport.findById(data.labReportId);
    if (!labReport) throw new errors.NotFound('LAB_REPORT_NOT_FOUND');

    return LabComment.create(data);
  }

  async function exists(labCommentId) {
    const result = await LabComment.findById(labCommentId);
    if (result) return true;
    return false;
  }

  async function update(labCommentId, data) {
    const labReport = await LabReport.findById(data.labReportId);
    if (!labReport) throw new errors.NotFound('LAB_REPORT_NOT_FOUND');

    return LabComment.update(data, {
      where: { id: labCommentId },
    });
  }

  async function remove(labCommentId) {
    try {
      return await LabComment.destroy({
        where: { id: labCommentId },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Forbidden('CANNOT_DELETE_COMMENT');
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
