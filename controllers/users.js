var userModel = require('../models/users');
var userController = {}

userController.getAll = async function(req, res) {
	userModel.getAll((err, data) => {
		res.status(200).send({
			success: true,
			message: 'users found successfully.',
			data: data
		});
	});
}

module.exports = userController;