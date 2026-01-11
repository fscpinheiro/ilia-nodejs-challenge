import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-wallet' });
});

app.listen(PORT, () => {
  console.log(`ms-wallet running on port ${PORT}`);
});
