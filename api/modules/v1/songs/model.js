'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String },
		tone: {},
		author: { type: String },
		tag: { type: String },
		lyrics: { type: String },
		// annotations: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'annotations' },
		annotations: {},
		singers: [
			{
				singer: String,
				note: {}
			}
		],
		links: [
			{
				name: String,
				link: String
			}
		],
	}, { timestamps: true });
};
