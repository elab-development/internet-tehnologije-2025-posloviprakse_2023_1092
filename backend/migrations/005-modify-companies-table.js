export async function up(queryInterface, Sequelize) {
  // Delete isVerified column from companies and add new field
  await queryInterface.removeColumn('companies', 'isVerified');

  // Add rating and activeJobsCount columns to companies
  await queryInterface.addColumn('companies', 'rating', {
    type: Sequelize.DECIMAL(3, 2),
    defaultValue: 0
  });

  await queryInterface.addColumn('companies', 'activeJobsCount', {
    type: Sequelize.INTEGER,
    defaultValue: 0
  });
}

export async function down(queryInterface, Sequelize) {
  // Undo: remove rating and activeJobsCount columns
  await queryInterface.removeColumn('companies', 'rating');
  await queryInterface.removeColumn('companies', 'activeJobsCount');

  // Add back isVerified
  await queryInterface.addColumn('companies', 'isVerified', {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  });
}
