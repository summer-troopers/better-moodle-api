'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createCoursesRepository(models) {
  const {
    Course,
    CourseTeacher,
    Teacher,
    CourseSpecialty,
    Specialty,
  } = models;

  const CoursesTeachers = Course.associations.Teachers;
  const CoursesSpecialties = Course.associations.Specialties;
  const SpecialtyGroups = CoursesSpecialties.target.associations.Groups;
  const GroupStudents = SpecialtyGroups.target.associations.Students;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      teacherId,
      specialtyId,
      groupId,
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

    if (specialtyId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: CoursesSpecialties,
          required: true,
          attributes: [],
          where: {
            id: specialtyId,
          },
        }],
      });
    }

    if (groupId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: CoursesSpecialties,
          required: true,
          attributes: [],
          include: [{
            association: SpecialtyGroups,
            required: true,
            attributes: [],
            where: {
              id: groupId,
            },
          }],
        }],
      });
    }

    if (studentId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: CoursesSpecialties,
          required: true,
          attributes: [],
          include: [{
            association: SpecialtyGroups,
            required: true,
            attributes: [],
            include: [{
              association: GroupStudents,
              required: true,
              attributes: [],
              where: {
                id: studentId,
              },
            }],
          }],
        }],
      });
    }

    if (teacherId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: CoursesTeachers,
          required: true,
          attributes: [],
          where: {
            id: teacherId,
          },
        }],
      });
    }

    return Course.findAndCountAll(filter);
  }

  async function view(id) {
    return Course.findById(id);
  }

  function add(form, queryParams) {
    if (queryParams.teacherId) {
      return addTeacher(form.courseId, queryParams.teacherId);
    }
    if (queryParams.specialtyId) {
      return addSpecialty(form.courseId, queryParams.specialtyId);
    }
    return Course.create(form);
  }

  async function addTeacher(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addTeacher(teacher);
  }

  async function addSpecialty(id, specialtyId) {
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addSpecialty(specialty);
  }

  async function exists(id) {
    const result = await Course.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Course.update(form, {
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.teacherId) {
      return CourseTeacher.destroy({
        where: {
          teacherId: {
            [Op.eq]: queryParams.teacherId,
          },
          courseId: {
            [Op.eq]: id,
          },
        },
      });
    }
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: {
            [Op.eq]: queryParams.specialtyId,
          },
          courseId: {
            [Op.eq]: id,
          },
        },
      });
    }
    return Course.destroy({
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
