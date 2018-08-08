'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createStudentsRepository(models) {
  const {
    Student,
    Group,
  } = models;

  const StudentsGroup = Student.associations.Group;
  const GroupsSpecialty = StudentsGroup.target.associations.Specialty;
  const SpecialtyCourses = GroupsSpecialty.target.associations.Courses;
  const CoursesTeachers = SpecialtyCourses.target.associations.Teachers;
  const StudentsLaboratories = Student.associations.Laboratory;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      groupId,
      specialtyId,
      courseId,
      teacherId,
      laboratoryId,
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
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: StudentsGroup,
          required: true,
          attributes: [],
          where: {
            id: groupId,
          },
        }],
      });
    }

    // not working until fixed models
    if (specialtyId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: StudentsGroup,
          // required: true,
          // attributes: [],
          include: [{
            association: GroupsSpecialty,
            // required: true,
            // attributes: [],
            where: {
              id: specialtyId,
            },
          }],
        }],
      });
    }

    // not working until fixed models
    if (courseId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: StudentsGroup,
          required: true,
          attributes: [],
          include: [{
            association: GroupsSpecialty,
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
        }],
      });
    }

    // not working until fixed models
    if (teacherId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: StudentsGroup,
          required: true,
          attributes: [],
          include: [{
            association: GroupsSpecialty,
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
        }],
      });
    }

    // not working until fixed models
    if (laboratoryId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: StudentsLaboratories,
          required: true,
          attributes: [],
          where: {
            id: laboratoryId,
          },
        }],
      });
    }

    return Student.findAndCountAll(filter);
  }

  async function view(id) {
    return Student.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      return addGroup(form.studentId, queryParams.groupId);
    }
    if (queryParams.studentId) {
      return addTeacher(form.studentId, queryParams.groupId);
    }
    return Student.create(form);
  }

  async function addGroup(id, studentId) {
    const student = await Student.findById(studentId);
    if (!student) throw new errors.NotFound();
    const group = await Group.findById(id);
    if (!group) throw new errors.NotFound();
    return group.addStudent(student);
  }

  async function addTeacher(id, studentId) {
    const student = await Student.findById(studentId);
    if (!student) throw new errors.NotFound();
    const teacher = await Teacher.findById(id);
    if (!teacher) throw new errors.NotFound();
    return course.addStudent(student);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const result = await Group.findById(form.groupId);
    if (!result) throw new errors.NotFound();

    return Student.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.studentId) {
      return GroupStudents.destroy({
        where: {
          id: {
            [Op.eq]: id,
          },
          groupId: {
            [Op.eq]: queryParams.groupId,
          },
        },
      });
    }
    if (queryParams.specialtyId) {
      return GroupsSpecialty.destroy({
        where: {
          specialityId: {
            [Op.eq]: queryParams.specialtyId,
          },
          groupId: {
            [Op.eq]: queryParams.groupId,
          },
        },
      });
    }
    return Student.destroy({
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
