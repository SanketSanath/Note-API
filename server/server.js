const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose, Todo, User} = require('./db/model');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
	var todo = new Todo({
		text : req.body.text
	});

	todo.save().then((doc)=>{
		res.send(doc);
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res)=>{
	Todo.find().then((todos)=>{
		res.send({todos});
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(400).send('ObjectID is not valid');
	}

	Todo.findById(id).then((todo)=>{
		if(!todo){
			res.status(404).send('Not found any Todo');
		} else{
			res.send(todo);
		}
	}, (e)=>{
		res.status(400).send('Error occured');
	});
});

app.listen(3000, ()=>{
	console.log('connected to port 3000');
})
