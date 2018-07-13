const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, database)=>{
	if(err) return console.log('error occured');
	console.log('connected to database');

	var db = database.db('db1');
	
	//syntax for update
	//findOneAndUpdate(filter, update, option)
	db.collection('coll1').findOneAndUpdate({
		_id : new ObjectID('5b3b968300e9f62084209bda')
	}, {
		$set: {
			name: 'vishwas kumar'
		}, $inc: {
			roll: 1
		}
	}, {
		returnOriginal: false
	}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('this is error');
		console.log(err);
	});
	database.close();

});
