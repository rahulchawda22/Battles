import validatorCheck from 'validator'
import signUpDB from '../db/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config'
const saltRound = 10 

const addNewUser = (data, res) => {
	let isEmailIdValid = false;

	//validation of email Id.
	if (data.emailId) {
		isEmailIdValid = validatorCheck.isEmail(data.emailId);
		if(!isEmailIdValid) {
			res.send('Please provide valid email id');
		}
	}

	if (isEmailIdValid) {
		// if name, password, and email Id is presend then save to DB.
		signUpDB.checkExistenceOfUser(data, (isExist) => {
			if (!isExist) {
				if (data.name && data.password) {
					bcrypt.hash(data.password, saltRound, (err, hash) => {
						if (!err && hash) {
							data.password = hash;
							signUpDB.saveNewUser(data, (err, result) => {
								if (err) {
									res.send("Problem occurred :( Please try again");
								} else {
									res.send("User registered successfuly.");
								}
							});
						} else {
							res.send("Problem occurred :( Please try again");
						}
					});
				} else {
					res.send('Please provide all required * details');
				}
			} else {
				res.send('User Already Exist. Please login');
			}
		})
	}
}

const validateUser = (data, res) => {
	if (data.emailId && data.password) {
		let isEmailIdValid = validatorCheck.isEmail(data.emailId);
		if (isEmailIdValid) {
			let errorObject = null;
			signUpDB.checkUser(data, (err, result) => {
				if (err) {
					errorObject = {
						"message" : "Internal 500 error",
						"status" : 500
					}
					res.send(errorObject);
				} else if(!result){
					errorObject = {
						"message" : "Unauthenticated user. Please login again.",
						"status" : 401
					}
					res.send(errorObject);
				} else {
					let token = jwt.sign({emaiId : result.emailId, password : result.password}, config.secretCode, {expiresIn : 86400});
					let successResponse = {
						"token" : token,
						"status" : 200
					}
					res.send(successResponse)
				}
			});
		} else {
			res.send('Please provide valid email Id');
		}
	} else {
		res.send('Email Id or Password is missing')
	}
}

module.exports.addNewUser = addNewUser;
module.exports.validateUser = validateUser;