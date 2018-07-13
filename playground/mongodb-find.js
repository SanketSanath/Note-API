const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, database)=>{
	if(err) return console.log('error occured');
	console.log('connected to database');

	var db = database.db('db1');

	db.collection('coll1').find({
		name: 'keshav agrawal'
	}).toArray().then((docs)=>{
		console.log('todos:');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err)=>{
		console.log(err);
	})

	database.close();

});
