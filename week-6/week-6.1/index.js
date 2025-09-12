import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const users = [];
const JWT_SECRET = "ilovesanju"; // fixed typo

// POST /signup
app.post("/signup", function (req, res) {
  const { username, password } = req.body;

  // already signed up or not
  if (users.find((user) => user.username === username)) {
    return res.json({
      message: "You have already signed up",
    });
  }

  // check username length
  if (username.length < 5) {
    return res.json({
      message: "Username should contain at least 5 characters",
    });
  }

  users.push({ username, password });

  return res.json({
    message: "Signup successful!",
  });
});

// POST /signin
app.post("/signin", function (req, res) {
  const { username, password } = req.body;

  // find user in users array
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const token = jwt.sign({ username: user.username }, JWT_SECRET);
    return res.json({
      message: "You have signed in successfully!",
      token,
    });
  } else {
    return res.json({
      message: "User not found / invalid username or password",
    });
  }
});

// Middleware to check if user is logged in
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ message: "Token is missing!" });
  }

  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.json({ message: "Unauthorized access!" });
    }
    req.user = decoded;
    next();
  });
}

// Protected GET /me route
app.get("/me", auth, function (req, res) {
  res.json({ username: req.user.username });
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
