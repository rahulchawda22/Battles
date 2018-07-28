var mongoose = require('mongoose')
const Schema = mongoose.Schema

const battleSchema = new Schema({
	name : {type : String},
	year: {type: Number},
	battle_number: {type: Number},
	attacker_king: {type : String},
	defender_king: {type : String},
	attacker_1: {type : String},
	attacker_2: {type : String},
	attacker_3: {type : String},
	attacker_4: {type : String},
	defender_1: {type : String},
	defender_2: {type : String},
	defender_3: {type : String},
	defender_4: {type : String},
	attacker_outcome: {type : String},
	battle_type: {type : String},
	major_death: {type: Number},
	major_capture: {type: Number},
	attacker_size: {type: Number},
	defender_size: {type: Number},
	attacker_commander: {type : String},
	defender_commander: {type : String},
	summer: {type: Number},
	location: {type : String},
	region: {type : String},
	note: {type : String}
})

var conn = mongoose.createConnection('mongodb://battleuser:battle1234@ds243041.mlab.com:43041/battledb')
const battles = conn.model('battles', battleSchema)

const getlistOfBattlesLocation = (cb) => {
	battles.find({}, {location: 1, _id:0}, (err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result)
		}
	})
}

const getTotalNumberOfBattleOccured = (cb) => {
	battles.count((err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result)
		}
	})
}

const getMostActiveBasedOnKey = (searchKey, cb) => {
	battles.aggregate([{"$sortByCount": "$"+searchKey }], (err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result[0]._id)
		}
	})
}

const getTotalAttackerOutComes = (searchKey, cb) => {
	battles.count({"attacker_outcome": searchKey}, (err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result)
		}
	})
}

const getlistOfBattlesType = (cb) => {
	battles.find({}, {battle_type: 1, _id:0}, (err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result)
		}
	})
}

const getDefenderSizes = (cb) => {
	battles.aggregate(
		[{
			$group: {
				_id: {},
           		avgDefenderSize: { "$avg": "$defender_size" },
           		maxDefenderSize: { "$max": "$defender_size" },
           		minDefenderSize: { "$min": "$defender_size" }
         	}
     	}], (err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result[0])
		}
	})
}

const searchBattlesDetails = (searchObject, cb) => {
	battles.find(searchObject, (err, result) => {
		if (err) {
			cb(err, null)
		} else {
			cb(null, result)
		}
	})
}

module.exports.getlistOfBattlesLocation = getlistOfBattlesLocation
module.exports.getTotalNumberOfBattleOccured = getTotalNumberOfBattleOccured
module.exports.getMostActiveBasedOnKey = getMostActiveBasedOnKey
module.exports.getTotalAttackerOutComes = getTotalAttackerOutComes
module.exports.getlistOfBattlesType = getlistOfBattlesType
module.exports.getDefenderSizes = getDefenderSizes
module.exports.searchBattlesDetails = searchBattlesDetails


