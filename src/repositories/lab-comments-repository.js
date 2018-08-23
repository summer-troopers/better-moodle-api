'use strict';

const errors = require('@feathersjs/errors');
const { handleId, appendParentData } = require('../helpers/util');

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
      content: item.content,
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
      order: [
        ['updatedAt', 'DESC'],
      ],
    };

    let labComments = await handleId(queryParams, LabComment, filter, queryParamsBindings);

    if (!labComments) labComments = await LabComment.findAndCountAll(filter);

    await appendParentData(labComments.rows, LabReport);

    labComments.rows = labComments.rows.map(projector);

    return labComments;
  }

  async function view(id) {
    const labComment = await LabComment.findById(id);

    await appendParentData([labComment], LabReport);

    return projector(labComment);
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
        throw new errors.Conflict('CANNOT_DELETE_LAB_COMMENT');
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
