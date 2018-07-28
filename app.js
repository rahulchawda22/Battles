import express from 'express'
import battleModel from './model/battle.js'

const app = express()

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