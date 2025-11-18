import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: console.log, // ✅ SQL queries dikhayega
  define: {
    freezeTableName: true, // ✅ Table names change na ho
    timestamps: true // ✅ createdAt, updatedAt automatically
  }
});

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite3 Database connected successfully!');
    
    // ✅ Force sync to recreate tables with new columns
    await sequelize.sync({ force: true });
    console.log('✅ All models synchronized with force!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};
export default sequelize;