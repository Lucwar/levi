'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} id - ID - 24 char Hex string - Variable
   * @param {Object} key - Key - 32 char Hex string - Constante (según tipo) definida en el settings
   * @param {Object} text - Text to decrypt
   * @return {Promise}
   */
  return (id, key, text) => {
    
    const KEY = helper.settings.crypto[key] + helper.settings.crypto.key + id;
    
    const textParts = text.split(':');

    const IV = Buffer.from(textParts.shift(), 'hex');

    const encryptedText = textParts.shift();

    const decipher = helper.lib.crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY, 'hex'), IV);

    return decipher.update(encryptedText, 'hex', 'utf-8') + decipher.final('utf-8').toString('utf-8');
  };
};