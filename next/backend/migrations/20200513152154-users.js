const tableName = 'users';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      posts: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },

      comments: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable(tableName)
};
