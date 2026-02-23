// eslint-disable-next-line no-unused-vars
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('companies', 'isVerified');
  await queryInterface.addColumn('companies', 'rating', {
    type: Sequelize.DECIMAL(3, 2),
    defaultValue: 0
  });
  await queryInterface.addColumn('companies', 'activeJobsCount', {
    type: Sequelize.INTEGER,
    defaultValue: 0
  });
}

// eslint-disable-next-line no-unused-vars
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('companies', 'rating');
  await queryInterface.removeColumn('companies', 'activeJobsCount');
  await queryInterface.addColumn('companies', 'isVerified', {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  });
}
