'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		level: { type: String },
		timestamp: { type: Date },
		message: { type: String },
		meta: {
			name: { type: String },
			message: { type: String },
			stack: { type: String },
			status: { type: Number },
			description: { type: String },
			request: {
				method: { type: String },
				endPoint: { type: String },
				url: { type: String },
				params: { type: Object },
				query: { type: Object },
				body: { type: Object },
				headers: {
				  'user-agent': { type: String }
				}
			},
			error: {
				name: { type: String },
				message: { type: String },
				stack: { type: String },
				status: { type: Number },
			},
			user: {
				id: { type: String },
				roles: [{ type: String }]
			},
			additionalData: { type: Object }
		},
	}, {
		timestamps: true
	});
};
