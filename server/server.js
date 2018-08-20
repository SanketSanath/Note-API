const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose, Todo, User} = require('./db/model');
const {authenticate} = require('./middleware/authenticate');
var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc)=>{
		res.send(doc);
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos', authenticate, (req, res)=>{
	Todo.find({
		_creator: req.user._id
	}).then((todos)=>{
		res.send({todos});
	}, (e)=>{
		res.status(400).send(e);
	});
});

app.get('/todos/:id', authenticate, (req, res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(400).send('ObjectID is not valid');
	}

	Todo.findOne({
		_id : id,
		_creator : req.user._id
	}).then((todo)=>{
		if(!todo){
			res.status(404).send('Not found any Todo');
		} else{
			res.send(todo);
		}
	}, (e)=>{
		res.status(400).send('Error occured');
	});
});

app.delete('/todos/:id', authenticate, (req, res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(400).send('ObjectID is not valid');
	}

	Todo.findOneAndRemove({
		_id : id,
		_creator : req.user._id
	}).then((todo)=>{
		if(!todo){
			return res.status(404).send('Not found any Todo');
		} else {
			res.send(todo);
		}
	}, (e)=>{
		res.status(400).send('Error occured');
	});
});

app.patch('/todos/:id', authenticate, (req, res)=>{
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

	Todo.findOneAndUpdate({
		_id : id,
		_creator : req.user._id 
	}, {$set : body}, {new : true}).then((todo)=>{
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

app.post('/users/login', (req, res)=>{
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			res.header('x-auth', token).send(user);
		});
	}).catch((e)=>{
		res.status(400).send('some error occured');
	})
});

app.delete('/users/me/token', authenticate, (req, res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send('successfully loged out');
	}, (e)=>{
		res.status(400).send('error');
	});
});

app.listen(3000, ()=>{
	console.log('connected to port 3000');
});
