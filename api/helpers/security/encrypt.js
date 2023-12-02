'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} id - ID - 24 char Hex string - Variable
   * @param {Object} key - Key - 32 char Hex string - Constante (según tipo) definida en el settings
   * @param {Object} text - Text to encrypt
   * @return {Promise}
   */
  return (id, key, text) => {
    
    const KEY = helper.settings.crypto[key] + helper.settings.crypto.key + id;
    const IV = helper.lib.crypto.randomBytes(16);

    const cipher = helper.lib.crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY, 'hex'), IV);

    return IV.toString('hex') + ':' + (cipher.update(text, 'utf-8', 'hex') + cipher.final('hex'));
  };
};