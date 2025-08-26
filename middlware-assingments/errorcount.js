import express from "express";

const app = express();
let errorCount = 0;

app.get('/user', function(req, res) {
  throw new Error("User not found");
});

app.post('/user', function(req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});

app.get('/errorCount', function(req, res) {
  res.status(200).json({ errorCount });
});

// Error handling middleware
app.use((err, req, res, next) => {
  errorCount = errorCount + 1;   // increment first
  res.status(404).send('Something went wrong!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
