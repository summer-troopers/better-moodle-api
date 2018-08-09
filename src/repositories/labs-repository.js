const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

module.exports = function createLabsRepository(connection) {
  const gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('fs');

  async function list(queryParams) {
    const {
      LabReport,
      LabTask,
      Student,
      Group,
      Specialty,
      Course,
      Teacher,
    } = connection.models;

    const {
      limit,
      offset,
      contains,
      groupId,
      specialtyId,
      courseId,
      teacherId,
      taskId,
    } = queryParams;

    const filter = {
      limit,
      offset,
      where: {
        firstName: {
          [Op.like]: [`%${contains}%`],
        },
      },
      attributes: {
        exclude: ['password'],
      },
    };

    if (groupId) {
      return LabReport.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Student,
          required: true,
          include: [{
            model: Group,
            required: true,
            where: {
              id: groupId,
            },
          }],
        }],
      });
    }

    if (specialtyId) {
      return LabReport.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Student,
          required: true,
          include: [{
            model: Group,
            required: true,
            include: [{
              model: Specialty,
              required: true,
              where: {
                id: specialtyId,
              },
            }],
          }],
        }],
      });
    }

    if (courseId) {
      return LabReport.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Student,
          required: true,
          include: [{
            model: Group,
            required: true,
            include: [{
              model: Specialty,
              required: true,
              include: [{
                model: Course,
                required: true,
                where: {
                  id: courseId,
                },
              }],
            }],
          }],
        }],
      });
    }

    if (teacherId) {
      return LabReport.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Student,
          required: true,
          include: [{
            model: Group,
            required: true,
            include: [{
              model: Specialty,
              required: true,
              include: [{
                model: Course,
                required: true,
                include: [{
                  model: Teacher,
                  required: true,
                  where: {
                    id: teacherId,
                  },
                }],
              }],
            }],
          }],
        }],
      });
    }

    if (taskId) {
      return LabReport.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: LabTask,
          required: true,
          where: {
            id: taskId,
          },
        }],
      });
    }

    const result = await gfs.files.findAndCountAll(filter).toArray();
    return result;
  }
}

async function view(fileName) {
  const result = await gfs.files.findOne({ filename: fileName });
  return result;
}

function add() {
}

async function remove(fileId) {
  await gfs.remove({ _id: fileId, root: 'fs' });
}

return {
  list,
  view,
  add,
  remove,
};
};
