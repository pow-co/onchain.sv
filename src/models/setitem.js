'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SetItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SetItem.init({
    set_name: DataTypes.STRING,
    author: DataTypes.STRING,
    txid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SetItem',
  });
  return SetItem;
};