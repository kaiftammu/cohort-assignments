import express from "express";
const app = express();

let numberOfRequestsForUser = {};

// reset counts every second
setInterval(() => {
  numberOfRequestsForUser = {};
}, 1000);

app.use(function (req, res, next) {
  const userId = req.headers["user-id"]; // lowercase header name

  if (!userId) {
    return res.status(400).json({ error: "Missing user-id header" });
  }

  if (numberOfRequestsForUser[userId]) {
    numberOfRequestsForUser[userId] = numberOfRequestsForUser[userId] + 1;

    // check against limit
    if (numberOfRequestsForUser[userId] > 5) {
      return res.status(429).json({ error: "Too many requests, slow down!" });
    } else {
      next();
    }
  } else {
    numberOfRequestsForUser[userId] = 1;
    next();
  }
});


app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

app.post("/user", function (req, res) {
  res.status(200).json({ msg: "created dummy user" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
