import express from 'express';
import { jobs } from './routes/jobs.js';

const app = express();
app.use(express.json({ limit: '300kb' }));
app.use('/v1/jobs', jobs);

app.listen(process.env.PORT ?? 3000);
