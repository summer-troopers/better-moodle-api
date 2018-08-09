'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createGroupsRepository(sequelize) {
  const {
    Group,
    Specialty,
    CourseSpecialty,
    Course,
    Teacher,
    Student,
    LabReport,
    LabTask,
  } = sequelize.models;

  function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      courseId,
      specialtyId,
      teacherId,
      studentId,
      laboratoryId,
    } = queryParams;

    const filter = {
      limit,
      offset,
      where: {
        name: {
          [Op.like]: [`%${contains}%`],
        },
      },
    };

    if (specialtyId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          model: Specialty,
          where: {
            id: specialtyId,
          },
        }],
      });
    }

    if (courseId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Specialty,
          required: true,
          // include: [{
          //   model: CourseSpecialty,
          //   required: true,
          include: [{
            model: Course,
            required: true,
            where: {
              id: courseId,
            },
          }],
          // }],
        }],
      });
    }

    // if (courseId) {
    //   const sql = `select * from (((groups inner join specialties on groups.specialty_id = specialties.id) inner join courses_specialties on specialties.id = courses_specialties.specialty_id) inner join courses on courses_specialties.course_id = courses.id) WHERE courses.id = ${courseId} order by groups.id`;
    //   return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    //     .then((result) => {
    //       return new Promise((resolve) => {
    //         resolve({
    //           rows: result,
    //           count: result.length,
    //         });
    //       });
    //     });
    // }

    if (teacherId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
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
      });
    }

    if (studentId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          model: Student,
          where: {
            id: studentId,
          },
        }],
      });
    }

    if (laboratoryId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          model: Student,
          include: [{
            model: LabReport,
            where: {
              id: laboratoryId,
            },
          }],
        }],
      });
    }

    return Group.findAndCountAll(filter);
  }

  async function view(id) {
    return Group.findById(id);
  }

  async function add(form) {
    const result = await Specialty.findById(form.specialtyId);
    if (!result) throw new errors.NotFound();

    return Group.create(form);
  }

  async function exists(id) {
    const result = await Group.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const result = await Specialty.findById(form.specialtyId);
    if (!result) throw new errors.NotFound('');

    return Group.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.studentId) {
      return GroupStudents.destroy({
        where: {
          studentId: {
            [Op.eq]: queryParams.studentId,
          },
          id: {
            [Op.eq]: id,
          },
        },
      });
    }
    if (queryParams.specialityId) {
      return GroupsSpecialities.destroy({
        where: {
          id: {
            [Op.eq]: id,
          },
          specialityId: {
            [Op.eq]: queryParams.specialityId,
          },
        },
      });
    }
    return Group.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
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
