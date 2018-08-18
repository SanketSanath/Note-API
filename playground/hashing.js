const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
	id : 10
}

var token = jwt.sign(data, 'somesecret');

var decoded = jwt.verify(token, 'somesecret');

console.log(decoded);

// var msg = "this is msg";
// var hash = SHA256(msg).toString();

// console.log(hash);

// var data = {
// 	id : 4
// };

// var token = {
// 	data,
// 	hash : SHA256(JSON.stringify(data) + "somesecret").toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();

// if(resultHash === token.hash){
// 	console.log('its okay');
// } else {
// 	console.log('something is fishy');
// }