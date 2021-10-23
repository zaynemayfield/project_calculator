const model = function (sequelize, DataTypes) {
  return sequelize.define('material', {
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
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'material',
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
        name: 'user_id on material',
        using: 'BTREE',
        fields: [
          { name: 'user_id' }
        ]
      }
    ]
  })
}
model.associate = (db) => {
  db.material.belongsTo(db.user, { as: 'user', foreignKey: 'user_id' })
  db.material.hasMany(db.line_item, { as: 'line_items', foreignKey: 'material_id' })
}
module.exports = model
