// Utilitários
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

// Middlewares
app.use(cors());

// Detecta se está rodando no Vercel (ou outro ambiente de produção que usa /api)
const apiPrefix = process.env.VERCEL ? '/api' : '';

// Middleware das ROTAS REST com prefixo dinâmico
app.use(`${apiPrefix}/users`, usersRoutes);
app.use(`${apiPrefix}/attendants`, attendantsRoutes);
app.use(`${apiPrefix}/agents`, agentsRoutes);
app.use(`${apiPrefix}/connections`, connectionsRoutes);
app.use(`${apiPrefix}/chats`, chatsRoutes);
app.use(`${apiPrefix}/messages`, messagesRoutes);
app.use(`${apiPrefix}/events`, eventsRoutes);
app.use(`${apiPrefix}/upload`, uploadRoutes);

// Exporte o 'app' para a Vercel
export default app;
