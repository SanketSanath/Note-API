const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: `{VALUE} is not valid`
		}
	},
	password: {
		type : String,
		required : true,
		minlength : 6
	},
	tokens : [{
		access : {
			type : String,
			required : true
		},
		token : {
			type : String,
			required : true
		}
	}]
});

//overriding toJSON method
UserSchema.methods.toJSON = function(){
	var user = this;
	//converting mongoose object to simple object
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

//methods is used to make instance method
UserSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id : user._id, access}, 'abc123').toString();

	user.tokens.push({access, token});

	return user.save().then(()=>{
		return token;
	})
};


//statics made a function model function
UserSchema.statics.findByToken = function(token){
	var User = this;
	var decoded;
	try{
		decoded = jwt.verify(token, 'abc123');
	} catch(e){
		return Promise.reject();
	}

	return User.findOne({
		'_id' : decoded._id,
		'tokens.token' : token,
		'tokens.access' : 'auth'
	});
}

var User = mongoose.model('User', UserSchema);

module.exports = {
	mongoose,
	Todo,
	User
};
