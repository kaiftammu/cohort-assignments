import express from 'express';
const app = express();

function IsOldEnoughMiddleware(req, res, next) {
    const age = req.query.age;
    if (age >= 15) {
        next();
    } else {
        res.json({
            msg: "sorry you are underage"
        });
    }
}

app.use(IsOldEnoughMiddleware);

app.get('/ride1', function(req, res) {
    res.json({
        msg: "you have successfully rode Ride1"
    });
});

app.get('/ride2', function(req, res) {
    res.json({
        msg: "you have successfully rode Ride2"
    });
});

app.listen(3000);