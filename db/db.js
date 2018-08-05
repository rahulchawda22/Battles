import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
	name : {type : String},
	emailId : {type : String},
	password : {type : String},
	publisher : {type : Boolean}
})

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
const user = conn.model('user', userSchema);
const battles = conn.model('battles', battleSchema)

const saveNewUser = (data, cb) => {
	//Saving new user in DB.
	const addNewUser = new user(data);
	addNewUser.save((err, result) => {
		if(err) {
			cb(err, null)
		} else {
			cb(null, result);
		}
	})
}

const checkUser = (data, cb) => {
	user.findOne({emailId : data.emailId}, (err, result) => {
		if (result) {
			bcrypt.compare(data.password, result.password, (err, passwordMatching) => {
				if (passwordMatching) {
					cb(null, result)
				} else {
					cb(null, passwordMatching)
				}	
			})
		} else {
			cb(err, null)
		}
	})
}

const checkExistenceOfUser = (data, cb) => {
	user.findOne({emailId : data.emailId}, (err, result) => {
		if (err) {
			cb(false)
		} else if (result) {
			cb(true);
		} else {
			cb(false)
		}
	})
}

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

module.exports.saveNewUser = saveNewUser
module.exports.checkUser = checkUser
module.exports.checkExistenceOfUser = checkExistenceOfUser
module.exports.getlistOfBattlesLocation = getlistOfBattlesLocation
module.exports.getTotalNumberOfBattleOccured = getTotalNumberOfBattleOccured
module.exports.getMostActiveBasedOnKey = getMostActiveBasedOnKey
module.exports.getTotalAttackerOutComes = getTotalAttackerOutComes
module.exports.getlistOfBattlesType = getlistOfBattlesType
module.exports.getDefenderSizes = getDefenderSizes
module.exports.searchBattlesDetails = searchBattlesDetails


