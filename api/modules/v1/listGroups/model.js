'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String },
		songs: [{ type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'songs' }]
	}, { timestamps: true });
};