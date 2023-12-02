'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String },
		dateTo: { type: Date, required: true },
		user: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'users' },
		groups: [{ type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'groups' }]

	}, { timestamps: true });
};
