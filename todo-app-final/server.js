const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=> console.log ('MongoDB connected'))
.catch(err => console.error ('MongoDB connection eror:',err.message));

app.use('/api/auth',authRoutes);
app.use('api/todos',auth,todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));