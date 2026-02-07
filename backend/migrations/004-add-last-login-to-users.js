export async function up(queryInterface, Sequelize) {
  // Add new column to users table
  await queryInterface.addColumn('users', 'lastLogin', {
    type: Sequelize.DATE,
    allowNull: true
  });

  // Add constraint to email column
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  });
}

export async function down(queryInterface, Sequelize) {
  // Remove the lastLogin column
  await queryInterface.removeColumn('users', 'lastLogin');
}
