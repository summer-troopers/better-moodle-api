module.exports = {
  default: {
    names: {
      userId: 'defaultUserId',
      dependencyId: 'defaultDependencyId',
      requiredField: 'defaultField',
    },
    msg: {
      err: {
        missing: {
          userId: 'DEFAULT_USER_ID_NOT_RECEIVED',
          dependencyId: 'DEFAULT_DEPENDENCY_ID_NOT_RECEIVED',
          field: 'DEFAULT_FIELD_NOT_RECEIVED',
        },
        notFound: 'DEFAULT_SINGULAR_NOT_FOUND',
        notReceived: 'DEFAULT_ID_NOT_RECEIVED',
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
      err: {
        missing: {
          userId: 'TEACHER_ID_NOT_RECEIVED',
          dependencyId: 'COURSE_ID_NOT_RECEIVED',
          field: 'LAB_TASK_NOT_RECEIVED',
        },
        notFound: 'LAB_TASK_NOT_FOUND',
        notReceived: 'LAB_TASK_ID_NOT_RECEIVED',
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
      err: {
        missing: {
          userId: 'STUDENT_ID_NOT_RECEIVED',
          dependencyId: 'LAB_TASK_ID_NOT_RECEIVED',
          field: 'LAB_REPORT_NOT_RECEIVED',
        },
        notFound: 'LAB_REPORT_NOT_FOUND',
        notReceived: 'LAB_REPORT_ID_NOT_RECEIVED',
      },
      success: {
        add: 'LAB_REPORT_ADDED',
        delete: 'LAB_REPORT_DELETED',
      },
    },
  },
};
