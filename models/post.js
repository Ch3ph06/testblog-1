'use strict';

module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
  });

  return Post;
};
