const mongoose = require ("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String
});

const Todo = new Schema({
    userId: ObjectId,
    title: String,
    done: Boolean
});

const userModel = mongoose.model('users',User);
const todoModel = mongoose.model('todos',Todo);

module.exports = {
    userModel,
    todoModel
}