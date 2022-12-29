'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bmap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bmap.init({
    txid: DataTypes.STRING,
    vout: DataTypes.NUMBER,
    app: DataTypes.STRING,
    type: DataTypes.STRING,
    attributes: DataTypes.JSON,
    content: DataTypes.TEXT,
    contentType: DataTypes.STRING,
    encoding: DataTypes.STRING,
    author: DataTypes.STRING,
    signature: DataTypes.TEXT,
    filename: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bmap',
  });
  return Bmap;
};