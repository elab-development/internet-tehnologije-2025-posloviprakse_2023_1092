



export async function up(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    
    const tableDescription = await queryInterface.describeTable('jobs');
    if (!tableDescription.isArchived) {
      await queryInterface.addColumn('jobs', 'isArchived', {
        type: sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });
      console.log('✅ Added isArchived column to jobs table');
    } else {
      console.log('ℹ️ isArchived column already exists');
    }
  } catch (error) {
    console.error('❌ Error adding isArchived column:', error.message);
    throw error;
  }
}

export async function down(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    await queryInterface.removeColumn('jobs', 'isArchived');
    console.log('✅ Removed isArchived column from jobs table');
  } catch (error) {
    console.error('❌ Error removing isArchived column:', error.message);
    throw error;
  }
}
