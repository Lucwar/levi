'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		emailAddress: { type: String, required: true, unique: true },
		username: { type: String, required: true, unique: true },
		fullName: { type: String },
		enabled: { type: Boolean, default: true },
		password: { type: String, required: true },
		firstName: { type: String },
		lastName: { type: String },
		recoverPasswordDateTime: { type: String },
		recoverPasswordID: { type: String },
		refreshToken: { type: String },
		roles: [{
			type: String,
			allowNull: false,
			enum: ['administrator']
		}],
		language: { type: String, enum: ['es', 'en'], default: 'es' },
		superAdmin: { type: Boolean, default: false }
	}, {
		timestamps: true
	});

	module.schema.post('validate', function (doc) {

		const role = 'administrator';
		if (!doc.roles.includes(role)) doc.roles.push(role);

		const token = module.lib.jsonwebtoken.sign({ roles: doc.roles, id: doc._id }, module.settings.token.refresh);

		doc.refreshToken = global.helpers.security.encrypt(doc._id, 'refreshToken', token);
	});
};
