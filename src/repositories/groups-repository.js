'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createGroupsRepository(models) {
  const {
    Group,
    Specialty,
  } = models;

  const GroupsStudents = Group.associations.Students;
  const StudentsLaboratories = GroupsStudents.target.associations.Laboratory;
  const GroupSpecialty = Group.associations.Specialty;
  const SpecialtyCourses = GroupSpecialty.target.associations.Courses;
  const CoursesTeachers = SpecialtyCourses.target.associations.Teachers;

  function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      courseId,
      teacherId,
      studentId,
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

    // not working
    if (courseId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: GroupSpecialty,
          required: true,
          attributes: [],
          include: [{
            association: SpecialtyCourses,
            required: true,
            attributes: [],
            where: {
              id: courseId,
            },
          }],
        }],
      });
    }

    // not working
    if (teacherId) {
      return Group.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: GroupSpecialty,
          required: true,
          attributes: [],
          include: [{
            association: SpecialtyCourses,
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
          association: GroupsStudents,
          attributes: [],
          where: {
            id: studentId,
          },
        }],
      });
    }

    return Group.findAndCountAll(filter);
  }

  async function view(id) {
    return Group.findById(id);
  }

  async function add(form) {
    const result = await Specialty.findById(form.idSpecialty);
    if (!result) throw new errors.NotFound();

    return Group.create(form);
  }

  async function exists(id) {
    const result = await Group.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const result = await Specialty.findById(form.idSpecialty);
    if (!result) throw new errors.NotFound('');

    return Group.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Group.destroy({ where: { id: { [Op.eq]: id } } });
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
