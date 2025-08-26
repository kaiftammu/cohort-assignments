import express from 'express';

const app = express();
let requestCount=0;

app.use(function(req, res, next){
    requestCount = requestCount + 1;
    next();
});

app.get('/user', function(req, res){
    res.status(200).json({name: 'kaif'});
});

app.post('/user', function(req, res){
    res.status(200).json({msg: "created dummy user"});
});

app.get('/requestCount', function(req, res){
    res.status(200).json({requestCount});
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


export default app;