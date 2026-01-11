import express from 'express';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-users' });
});

app.listen(PORT, () => {
  console.log(`ms-users running on port ${PORT}`);
});
