import sequelize from '../libs/sequelize';

async function syncDatabase() {
  try {
    console.log('Syncing database with models...');
    await sequelize.sync({ force: false });
    console.log('Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'up') {
  syncDatabase();
} else {
  console.log('Usage: npx ts-node src/db/run-migrations.ts up');
  console.log('This will sync all models with the database');
  process.exit(0);
}
