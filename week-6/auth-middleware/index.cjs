const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "ilovesanju";

const app = express();
app.use(express.json());
app.use(express.static("."));

const users = [];

// Simple logger middleware
function logger(req, res, next) {
    console.log(req.method + " request came");
    next();
}

// Serve HTML page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Signup route
app.post("/signup", logger, function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({ username, password });

    res.json({
        message: "You are signed up successfully"
    });
});

// Signin route
app.post("/signin", logger, function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        res.json({ message: "Credentials incorrect" });
        return;
    }

    // ✅ sign token using foundUser.username
    const token = jwt.sign({ username: foundUser.username }, JWT_SECRET);

    res.json({ token: token });
});

// Auth middleware
function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.username = decodedData.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Me route
app.get("/me", logger, auth, function (req, res) {
    const currentUser = req.username;
    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === currentUser) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
