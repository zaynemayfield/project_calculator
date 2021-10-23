const model = function (sequelize, DataTypes) {
  return sequelize.define('project', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'project',
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
        name: 'user_id on project',
        using: 'BTREE',
        fields: [
          { name: 'user_id' }
        ]
      }
    ]
  })
}

model.associate = (db) => {
  db.project.hasMany(db.line_item, { as: 'line_items', foreignKey: 'project_id' })
  db.project.belongsTo(db.user, { as: 'user', foreignKey: 'user_id' })
}
module.exports = model
