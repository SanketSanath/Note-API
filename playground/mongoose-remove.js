const {ObjectID} = require('mongodb');
const {mongoose, Todo, User} = require('./../server/db/model');

Todo.remove({})
Todo.findOneAndRemove({})
Todo.findByIdAndRemove({})

Todo.remove({}).then((docs)=>{
	console.log(docs);
}, (e)=>{
	console.log(e);
});

Todo.findOneAndRemove({_id: "5b769d6709f68f019801039c"}).then((todo)=>{
	console.log(todo);
}, (e)=>{
	console.log(e);
});

Todo.findByIdAndRemove("5b769d5409f68f019801039b").then((todo)=>{
	console.log(todo);
}, (e)=>{
	console.log(e);
});