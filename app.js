import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import battleModel from './model/battle.js'
import userModel from './model/user.js'
import config from './config.js'


const app = express()

app.use(bodyParser.json());

//Endpoint signup
app.post('/signup', (req, res) => {
	let data = req.body;
	if(data && data.name) {
		userModel.addNewUser(data, res);
	} else {
		res.send("Please provide all required * details")
	}
});

//Endpoint for sign in
app.post('/signin', function(req, res) {
	let data = req.body;
	if (data) {
		userModel.validateUser(data, res);
	} else {
		res.send('Please enter correct emailId or password');
	}
});

app.use('*', (req, res, next) => {
	if (req && req.headers && req.headers.authorization) {
		//check for authorization token
		jwt.verify(req.headers.authorization, config.secretCode, (err, result) => {
			if (err) {
				let errObj = {
					"msg" : "Unauthorized user. Please login again.",
					"status" : 401
				}
				res.send(errObj);
			} else {
				next()
			}
		})
	} else {
		let errObj = {
			"msg" : "Token Missing in header",
			"status" : 400
		}
		res.send(errObj);
	}
})

//Endpoint for list of all the places where battle has taken place.
app.get('/list', (req, res) => {
	battleModel.getlistOfBattlesLocation(req, res)
});

//Endpoint for total number of battle occurred.
app.get('/count', (req, res) => {
	battleModel.getTotalNumberOfBattleOccured(req, res)
});

//Endpoint for total number of battle occurred.
app.get('/stats', (req, res) => {
	battleModel.getStats(req, res)
});

//Endpoint for publish book
app.get('/search', (req, res) => {
	battleModel.searchBattlesDetails(req, res)
})



//Serve 404 for all other request except above.
app.all('*', (req, res) => {
	res.statusCode = 404
	const errMsg = {
		'msg' : 'Not Found',
		'status' : 404
	}
	res.send(errMsg)
})


app.listen(3000, () => {
	console.log("Listening on port 3000");
})