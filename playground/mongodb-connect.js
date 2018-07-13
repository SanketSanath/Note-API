const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, database)=>{
	if(err) return console.log('error occured');
	console.log('connected to database');

	var db = database.db('db1');
	
	db.collection('coll1').insertOne({
		name: 'ghi',
		roll: 1607003
	}).then((result)=>{
		console.log('insertedCount:',result.insertedCount);
		console.log('inserted document:',result.ops);
	}, (err)=>{
		console.log(err);
	})
	
	database.close();

});
