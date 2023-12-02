const setInitialData = async ({ admin }) => {

    admin.password = require('bcrypt').hashSync(admin.password, global.modules.v1.administrators.settings.crypto.saltRounds);

    await global.modules.v1.administrators.model.create(admin).catch(e => console.error('"Administrador" ya existe'));

}

module.exports = { setInitialData };