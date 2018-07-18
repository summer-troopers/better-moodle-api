'use strict';

module.exports = function defineChatUser(sequelize, DataTypes) {
  const ChatUser = sequelize.define('ChatUser', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    idUser: {
      type: DataTypes.INTEGER,
      field: 'id_user',
      //allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      field: 'time',
      validate: {
        len: [1, 50],
      },
      //allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      field: 'message',
      //allowNull: false,
    },
  }, {
    tableName: 'chat_users',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  ChatUser.associate = function associateChatUser(models) {
    // associations can be defined here
  };
  return ChatUser;
};
