'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		name: { type: String },
		segments: [
			{
				label: String,
				notes: [
					{
						note: Number,
						extension: String
					}
				]
			}
		],
	}, { timestamps: true });
};
