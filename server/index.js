import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import formsRouter from './routes/forms.js';
import adminRouter from './routes/admin.js';
import leadsRouter from './routes/leads.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' })); // higher than the default 100kb to fit bulk CSV lead imports

app.use('/api/forms', formsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/leads', leadsRouter);

app.get('/api/health', async (_req, res) => {
  try {
    await testConnection();
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, db: 'disconnected', error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await testConnection();
    console.log('MySQL connected');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
});
