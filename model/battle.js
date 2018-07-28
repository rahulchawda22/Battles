import battlesDb from '../db/db.js';
import async from 'async'

const getlistOfBattlesLocation = (req, res) => {
	battlesDb.getlistOfBattlesLocation((err, result) => {
		if (err) {
			res.statusCode = 500
			res.send('Failed to get list of location of battles. Try again')
		} else {
			if (result.length === 0) {
				res.statusCode = 404
				res.send('List of location is not available.')
			} else {
				res.statusCode = 200
				let locationList = []
				for(let i = 0; i < result.length; i++) {
					if (result[i].location && result[i].location.length && !locationList.includes(result[i].location)) {
						locationList.push(result[i].location)
					}
				}
				res.send(locationList)
			}
		}
	})
}

const getTotalNumberOfBattleOccured = (req, res) => {
	battlesDb.getTotalNumberOfBattleOccured((err, result) => {
		if (err) {
			res.statusCode = 500
			res.send('Failed to get total count of battles. PLease try again')
		} else {
			res.statusCode = 200
			res.send('Total no. of battle occured: '+result)
		}
	})
}

const getStats = (req, res) => {
	async.parallel({
		active_attacker_king: (cb) => {
			battlesDb.getMostActiveBasedOnKey('attacker_king', (err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		},
		active_defender_king: (cb) => {
			battlesDb.getMostActiveBasedOnKey('defender_king', (err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		},
		active_region: (cb) => {
			battlesDb.getMostActiveBasedOnKey('region', (err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		},
		active_name: (cb) => {
			battlesDb.getMostActiveBasedOnKey('name', (err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		},
		total_attacker_wins: (cb) => {
			battlesDb.getTotalAttackerOutComes('win', (err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		},
		total_attacker_losses: (cb) => {
			battlesDb.getTotalAttackerOutComes('loss', (err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		},
		unique_battle_type: (cb) => {
			battlesDb.getlistOfBattlesType((err, result) => {
				if (err) {
					cb(err, null)
				} else {
					let unique_battle_type_list = []
					if (result.length > 0) {
						for(let i = 0; i < result.length; i++) {
							if (result[i].battle_type && result[i].battle_type.length && !unique_battle_type_list.includes(result[i].battle_type)) {
								unique_battle_type_list.push(result[i].battle_type)
							}
						}
					}
					cb(null, unique_battle_type_list)
				}
			})
		},
		defender_sizes: (cb) => {
			battlesDb.getDefenderSizes((err, result) => {
				if (err) {
					cb(err, null)
				} else {
					cb(null, result)
				}
			})
		}
	}, (err, results) => {
		if (err) {
			res.statusCode = 500
			res.send('Failed to get stats of  battles. Please try again')
		} else {
			const finalResult = {
				'most_active': {
					'attacker_king': results.active_attacker_king,
					'defender_king': results.active_defender_king,
					'region': results.active_region,
					'name': results.active_name
				},
				'attacker_outcome':{
					'win': results.total_attacker_wins,
					'loss': results.total_attacker_losses
				},
				'battle_type': results.unique_battle_type || [],
				'defender_size': {
					'average' :	parseInt(results.defender_sizes.avgDefenderSize) || null,
					'min': results.defender_sizes.minDefenderSize || null,
					'max': results.defender_sizes.maxDefenderSize || null
				}
			}
			res.statusCode = 200
			res.send(finalResult)
		}
	})
}

const searchBattlesDetails = (req, res) => {
	const queryObject = req.query;
	let searchKeys = {}
	for (let key in queryObject) {
		if (key === 'king') {
			searchKeys['$or'] = [
				{'attacker_king': queryObject[key]},
				{'defender_king': queryObject[key]}
			]
		} else if (key === 'type') {
			searchKeys['battle_type'] = queryObject[key]
		} else {
			searchKeys[key] = queryObject[key]
		}
	}

	battlesDb.searchBattlesDetails(searchKeys, (err, result) => {
		if (err) {
			res.statusCode = 500
			res.send('Failed to get details of battles which you are trying to search. Please try again')
		} else {
			if (result.length === 0) {
				res.statusCode = 404
				res.send('Sorry, there is no result found in our database.')
			} else {
				res.statusCode = 200
				res.send(result)
			}
		}
	})
}

module.exports.getlistOfBattlesLocation = getlistOfBattlesLocation
module.exports.getTotalNumberOfBattleOccured = getTotalNumberOfBattleOccured
module.exports.getStats = getStats
module.exports.searchBattlesDetails = searchBattlesDetails
