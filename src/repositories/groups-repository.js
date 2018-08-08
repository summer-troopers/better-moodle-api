'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createGroupsRepository(models) {
  const {
    Group,
    Specialty,
  } = models;

  const GroupsSpecialty = Group.associations.Specialty;
  const SpecialtiesCourses = GroupsSpecialty.target.associations.Courses;
  const CoursesTeachers = SpecialtiesCourses.target.associations.Teachers;
  const GroupStudents = Group.associations.Students;
  const StudentsLaboratory = GroupStudents.target.associations.Laboratory;

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

    // not working until fixed models   !!!!verify!!!!!!!!!!!!!   -> remove
    if (specialtyId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: GroupsSpecialty,
          // required: true,
          // attributes: [],
          where: {
            id: specialtyId,
          },
        }],
      });
    }

    /*
        // not working until fixed models
        if (courseId) {
          return Group.findAndCountAll({
            ...filter,
            raw: true,
            include: [{
              association: GroupsSpecialty,
              required: true,
              attributes: [],
              include: [{
                association: SpecialtiesCourses,
                required: true,
                attributes: [],
                where: {
                  id: courseId,
                },
              }],
            }],
          });
        } */

    // not working until fixed models
    if (teacherId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: GroupsSpecialty,
          required: true,
          attributes: [],
          include: [{
            association: SpecialtiesCourses,
            required: true,
            attributes: [],
            include: [{
              association: CoursesTeachers,
              required: true,
              attributes: [],
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
          association: GroupStudents,
          required: true,
          attributes: [],
          where: {
            id: studentId,
          },
        }],
      });
    }

    // not working because of labs-model
    if (laboratoryId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: GroupStudents,
          required: true,
          attributes: [],
          include: [{
            association: StudentsLaboratory,
            required: true,
            attributes: [],
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
