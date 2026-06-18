import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

const PORT = 3000;

async function main() {
  await sequelize.authenticate();   // verifica conexión
  await sequelize.sync();           // crea tabla si no existe
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main().catch(err => console.error('Error starting server:', err));