import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { initWs } from './ws/wsServer.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.get('/health', (_, res) => {
    res.send('OK');
});

initWs(server);

const PORT = Number(process.env['PORT']) || 8000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
