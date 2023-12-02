'use strict';

// Define module
module.exports = (helper) => {

    /**
     * Select
     *
     * @param {String} key - Key from translations.js to translate
     * @param {Array} params - Array of params to pass to translation
     * @param {String} language - Language
     * @param {String} userId - User ID
     * @return {Promise}
     */
    return (key, params, language, userId) => {
        return new Promise(async (resolve, reject) => {

            try {
                if (!language) {
                    if (userId) {
                        const user = await global.modules.v1.users.model.findById(userId).catch(e => console.log(e));
                        if (user) language = user.language;
                        else language = 'es';
                    } else language = 'es';
                }


                if (!global.translations[language][key]) language = 'es';

                return resolve(global.translations[language][key](...params));
            } catch (error) {
                console.error('Helper "translations.translate" response error');
                console.error(error);
                return resolve(`Translation error: ${key} - ${language}`);
            }
        });
    };
};
