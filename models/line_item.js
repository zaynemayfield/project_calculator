const model = function (sequelize, DataTypes) {
  return sequelize.define('line_item', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    project_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'project',
        key: 'id'
      }
    },
    material_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'material',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'line_item',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'project_id on line_item',
        using: 'BTREE',
        fields: [
          { name: 'project_id' }
        ]
      },
      {
        name: 'material_id on line_item',
        using: 'BTREE',
        fields: [
          { name: 'material_id' }
        ]
      }
    ]
  })
}
model.associate = (db) => {
  db.line_item.belongsTo(db.material, { as: 'material', foreignKey: 'material_id' })
  db.line_item.belongsTo(db.project, { as: 'project', foreignKey: 'project_id' })
}
module.exports = model
