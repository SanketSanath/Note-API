const {mongoose, Todo, User} = require('./../server/db/model.js');

var id = "5b4b121777e25b13d4216789";

// Todo.find({
// 	_id : id
// }).then((todos)=>{
// 	console.log(todos);
// }, (e)=>{
// 	console.log(e);
// });

// Todo.findOne({
// 	_id : id
// }).then((todo)=>{
// 	console.log(todo);
// }, (e)=>{
// 	console.log(e);
// });

// Todo.findById(id).then((todo)=>{
// 	console.log(todo);
// }, (e)=>{
// 	console.log(e);
// });

User.findById(id).then((user)=>{
	console.log(user);
}, (e)=>{
	console.log(e);
});