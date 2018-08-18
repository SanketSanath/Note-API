const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose, Todo, User} = require('./db/model');
const {authenticate} = require('./middleware/authenticate');
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

app.delete('/todos/:id', (req, res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(400).send('ObjectID is not valid');
	}

	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo){
			return res.status(404).send('Not found any Todo');
		} else {
			res.send(todo);
		}
	}, (e)=>{
		res.status(400).send('Error occured');
	});
});

app.patch('/todos/:id', (req, res)=>{
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)){
		return res.status(400).send('ObjectID is not valid');
	}

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	} else{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((todo)=>{
		if(!todo){
			res.status(404).send('Not found any Todo');
		} else {
			res.send(todo);
		}
	}, (e)=>{
		res.status(400).send('Error occured');
	});

});

app.post('/users', (req, res)=>{
	var body = _.pick(req.body, ['email', 'password']);

	var user = new User(body);
	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth', token).send(user);
	}).catch((e)=>{
		res.status(400).send(e);
	});

});

app.get('/users/me', authenticate, (req, res)=>{
	res.send(req.user);
});

app.listen(3000, ()=>{
	console.log('connected to port 3000');
});
