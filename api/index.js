// Utilitarios
import express from 'express';
import cors from 'cors';

// Import de Rotas (lembre-se de adicionar a extensão .js)
import usersRoutes from './routes/users.js';
import attendantsRoutes from './routes/attendants.js';
import agentsRoutes from './routes/agents.js';
import connectionsRoutes from './routes/connections.js';
import chatsRoutes from './routes/chats.js';
import messagesRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import { router as eventsRoutes } from './routes/events.js';

// Inicia Servidor Express
const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Middlewares do Express
app.use(cors());
// app.use(express.json()); // Esta linha é redundante, você já tem uma acima com o 'limit'

// Middleware das ROTAS REST
app.use('/users', usersRoutes);
app.use('/attendants', attendantsRoutes);
app.use('/agents', agentsRoutes);
app.use('/connections', connectionsRoutes);
app.use('/chats', chatsRoutes);
app.use('/messages', messagesRoutes);
app.use('/events', eventsRoutes);
app.use('/upload', uploadRoutes);

// Exporte o 'app' para a Vercel
export default app;