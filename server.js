import express from 'express';
import 'dotenv/config';
import pagesRouter from './src/routes/page.js';
import photoRouter from './src/routes/photo.js';
import frameRouter from './src/routes/frame.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use('/', pagesRouter);
app.use('/api/photo', photoRouter);
app.use('/api/frame', frameRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/ ...`);
});