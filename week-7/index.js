const express = require("express");
const {userModel, todoModel} = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Kaiftammu:SimplyKaif%402004@cluster0.z8kqkky.mongodb.net/week-7-todos")

const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await userModel.create({
        email: email,
        password: password,
        name: name
    });

    res.json({
        message: " you are signed up "
    })

});


app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await userModel.findOne({
        email: email,
        password: password,
    });

    if(response){
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "incorrect credentials"
        })
    }

});


app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await todoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await todoModel.find({
        userId
    });

    res.json({
        todos
    })

});

app.listen(3000);