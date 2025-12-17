import express from 'express';
import db from './config/Database.js';
import { User } from 'lucide-react';
import router from './routes/index.js';
const app = express();

try {
    await db.authenticate();
    console.log('Database connected...');
} catch (error){
    console.error('Connection failed:', error);
}

app.use(router); 
app.use(express.json());
app.listen(3000, ()=> console.log('Server running on port 3000'));
