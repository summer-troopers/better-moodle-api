'use strict';

function createMessage(to, from, subject, text) {
  const message = {
    to,
    from,
    subject,
    text,
  };
  return message;
}

function createPermissions(adminsRead, teachersRead, studentsRead, adminsWrite, teachersWrite, studentsWrite) {
  return {
    admin: {
      read: adminsRead,
      write: adminsWrite,
    },
    teacher: {
      read: teachersRead,
      write: teachersWrite,
    },
    student: {
      read: studentsRead,
      write: studentsWrite,
    },
  };
}

module.exports = {
  createMessage,
  createPermissions,
};
