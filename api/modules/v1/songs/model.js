'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String },
		tone: { type: String },
		author: { type: String },
		tag: { type: String },
		lyrics: { type: String },
		annotations: { type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'annotations' },
		singers: [
			{
				singer: String,
				note: Number
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
