// eslint-disable-next-line no-unused-vars
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'lastLogin', {
    type: Sequelize.DATE,
    allowNull: true
  });

  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  });
}

// eslint-disable-next-line no-unused-vars
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'lastLogin');
}
