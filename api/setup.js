const trae = require('trae');
const fs = require('fs');
const crypto = require('crypto');
const prompt = require("prompt-sync")({ sigint: true });

(async () => {
    const config = {
        PROJECT_NAME: prompt('Nombre del proyecto: '),
        DATABASE_NAME: prompt('Nombre de la base de datos: '),
    };

    const port = prompt('Puerto: ');

    config.PORT = 3 + port;
    config.PORT_HTTPS = 4 + port;
    config.PORT_PEER = 9 + port;

    const firebaseApiKey = prompt('Notificaciones - Firebase API Key: ');

    if (firebaseApiKey) {
        // const { data } = await trae.post('http://vps-1060583-x.dattaweb.com:3050/api/apps', {
        const { data } = await trae.post('http://localhost:3143/api/v1/modelv1v2', {
            name: config.PROJECT_NAME,
            apiKey: firebaseApiKey
        }).catch(e => console.log(e));

        if (data.data) config.PUSH_APP_ID = data.data.id;

    } else config.PUSH_APP_ID = prompt('Notificaciones - APP ID: ')


    config.HOST = 'https://diproach.com';

    config.NODEMAILER_USER = 'diproachlabs@gmail.com';
    config.NODEMAILER_PASSWORD = 'quzglnmhgsonqkgp';

    config.HTTPS_CERTIFICATE = '../../https_certs/certificate.crt';
    config.HTTPS_CA_BUNDLE = '../../https_certs/ca_bundle.crt';
    config.HTTPS_PRIVATE_KEY = '../../https_certs/private.key';

    config.CRYPTO_KEY_BASE = crypto.randomBytes(4).toString('hex');
    config.CRYPTO_KEY_EXAMPLE = crypto.randomBytes(16).toString('hex');
    config.TOKEN_REFRESH_KEY = crypto.randomBytes(128).toString('base64');
    config.TOKEN_ACCESS_KEY = crypto.randomBytes(128).toString('base64');

    let text = '';

    for (const [key, value] of Object.entries(config)) {
        text += `${key}='${value}'\n`;
    }

    fs.writeFileSync('./.env.test', text);

    console.log(config);
})();