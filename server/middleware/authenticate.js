const {User} = require('./../db/model');

var authenticate = (req, res, next)=>{
	var token = req.header('x-auth');
	User.findByToken(token).then((user)=>{
		if(!user){
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((e)=>{
		res.status(401).send('error occured');
	});
};

module.exports = {authenticate};