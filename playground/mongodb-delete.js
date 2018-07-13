const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, database)=>{
	if(err) return console.log('error occured');
	console.log('connected to database');

	var db = database.db('db1');

	//deleteOne
	db.collection('coll1').deleteOne({
		name: 'abc'
	}).then((result)=>{
		console.log('abc deleted');
	}, (err)=>{
		console.log(err);
	});

	db.collection('coll1').deleteOne({
		name: 'def'
	}, (err, result)=>{
		if(err) return console.log(err);

		console.log('def deleted');
	})

	//deleteMany
	db.collection('coll1').deleteMany({
		name: 'keshav agrawal'
	}).then((count)=>{
		console.log(`document deleted`);
	},(err)=>{
		console.log(err);
	})

	//findOneAndDelete
	db.collection('coll1').findOneAndDelete({
		name: 'ghi'
	}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log(err);
	});

	database.close();

});
