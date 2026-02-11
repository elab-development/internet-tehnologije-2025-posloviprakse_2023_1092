export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('applications', 'cvUrl', {
    type: Sequelize.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('applications', 'cvFilename', {
    type: Sequelize.STRING,
    allowNull: true
  });
}


export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('applications', 'cvFilename');
  await queryInterface.removeColumn('applications', 'cvUrl');
}
