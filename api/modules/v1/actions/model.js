'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String },
		type: { type: String, enum: ['push', 'socket', 'deep-link'] },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users' },
		performed: { type: Boolean, default: false },
		performRequired: { type: Boolean, default: false },
		payload: {
			id: { type: String },
			action: { type: String },
			view: { type: String },
		},
		additionalData: { type: Object }
	}, {
		timestamps: true
	});
};
