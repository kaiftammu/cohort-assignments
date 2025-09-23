const express = require("express");
const {userModel, todoModel} = require("./db");

mongoose.connect("")

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


app.post("/todo", function(req, res) {

});


app.get("/todos", function(req, res) {

});

app.listen(3000);