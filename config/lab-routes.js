module.exports = {
  default: {
    names: {
      userId: 'defaultUserId',
      dependencyId: 'defaultDependencyId',
      requiredField: 'defaultField',
    },
    msg: {
      error: {
        notReceived: {
          userId: 'DEFAULT_USER_ID_NOT_RECEIVED',
          dependencyId: 'DEFAULT_DEPENDENCY_ID_NOT_RECEIVED',
          file: 'DEFAULT_FILE_NOT_RECEIVED',
          id: 'DEFAULT_ID_NOT_RECEIVED',
        },
        notFound: 'DEFAULT_NOT_FOUND',
        unknown: {
          default: 'UNKOWN_ERROR',
          delete: 'DEFAULT_DELETE_UNKOWN',
        },
      },
      success: {
        add: 'DEFAULT_ADDED',
        delete: 'DEFAULT_DELETED',
      },
    },
  },
  labTasks: {
    names: {
      userId: 'teacherId',
      dependencyId: 'courseId',
      requiredField: 'labTask',
    },
    msg: {
      error: {
        notReceived: {
          userId: 'TEACHER_ID_NOT_RECEIVED',
          dependencyId: 'COURSE_ID_NOT_RECEIVED',
          file: 'LAB_TASK_FILE_NOT_RECEIVED',
          id: 'LAB_TASK_ID_NOT_RECEIVED',
        },
        notFound: 'LAB_TASK_NOT_FOUND',
      },
      success: {
        add: 'LAB_TASK_ADDED',
        delete: 'LAB_TASK_DELETED',
      },
    },
  },
  labReports: {
    names: {
      userId: 'studentId',
      dependencyId: 'labTaskId',
      requiredField: 'labReport',
    },
    msg: {
      error: {
        notReceived: {
          userId: 'STUDENT_ID_NOT_RECEIVED',
          dependencyId: 'LAB_TASK_ID_NOT_RECEIVED',
          file: 'LAB_REPORT_FILE_NOT_RECEIVED',
          id: 'LAB_REPORT_ID_NOT_RECEIVED',
        },
        notFound: 'LAB_REPORT_NOT_FOUND',
      },
      success: {
        add: 'LAB_REPORT_ADDED',
        delete: 'LAB_REPORT_DELETED',
      },
    },
  },
};
