'use strict';

// Define schema
module.exports = (module) => {

	/**
	 * Schema
	 */
	module.schema = new global.database.mongodb.mongoose.Schema({
		id: { type: String },
		discount: { type: Number },
		commission: { type: Number },
		subscriptionPrice: { type: Number },
		iapProducts: { 
			type: Object, 
			default: {
				codeAndroid: 'prisuspro1',
				codeAndroidOffer: 'prisuspro1@prisuspro1a',
				codeAndroidOfferPromo: 'prisuspro1@prisuspro1b',
				codeIos: 'prisuspro1'
			}
		}
	}, { timestamps: true });
};
