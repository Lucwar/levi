import path from 'path';
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

const settings = {
	docker: process.env.DOCKER_ON || false,
	production: process.env.NODE_ENV === 'production',
	token: {
		refresh: process.env.TOKEN_REFRESH_KEY,
		access: process.env.TOKEN_ACCESS_KEY,
		expiresIn: { access: '45m' },
		roles: [
			{ model: 'users', values: ['user'] }
		]
	},
	recoverPassword: {
		host: process.env.HOST,
		linkExpirationDays: 2,
	},
	cors: {
		origin: [
			process.env.HOST, // dominio
			'https://localhost', // android
			'app://localhost', // ios
			'ionic://localhost', // ios
			'http://localhost:4200', // adm development
			'http://localhost:8100', // app development
			'http://localhost:8101', // app development
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'x-access-token', 'x-refresh-token', 'x-accepted-format'],
		credentials: true,
		preflightContinue: true
	},
	baseUrl: process.env.BASE_URL || 'http://localhost',
	uploadDir: process.env.UPLOAD_DIR || '/tmp/',
	rootBuildPath: '../adm/www',
	admBuildPath: '../adm/www',
	files: {
		path: '../files',
		sizes: [
			{ code: 'sm', width: 300 },
			{ code: 'md', width: 600 },
			{ code: 'lg', width: 900 }
		]
	},
	push: {
		url: 'http://vps-1060583-x.dattaweb.com:3050/api/notifications/v2',
		appId: process.env.PUSH_APP_ID
	},
	path: path.normalize(path.join(__dirname, '..')),
	port: process.env.PORT,
	portHTTPS: process.env.PORT_HTTPS,
	portPeer: process.env.PORT_PEER,
	database: {
		uri: 'mongodb+srv://alexislevi777:cmjuHu0ZdbKLI6Fg @leviapp.b94ht.mongodb.net/',
		logging: process.env.LOGGER || process.env.NODE_ENV,
		timezone: '-03:00',
		host: 'localhost',
		name: process.env.DATABASE_NAME,
		itemsPerPage: 20,
		validators: {
			required: () => ({ required: [true, 'Campo obligatorio'] }),
			min: min => ({ min: [min, `El valor no puede ser menor a ${min}`] }),
			max: max => ({ max: [max, `El valor no puede ser mayor a ${max}`] }),
			minLength: min => ({ minLength: [min, 'Minimo de caracteres no alcanzado'] }),
			maxLength: max => ({ maxLength: [max, 'Limite de caracteres superado'] }),
			enum: values => ({ enum: { values, message: 'Valor no permitido' } }),
			email: () => ({ match: [/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i, 'Formato de email incorrecto'] }),
			customs: {

			}
		}
	},
	nodemailer: {
		transporter: {
			service: 'Gmail',
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_PASSWORD
			}
		},
		mailOptions: {
			from: process.env.PROJECT_NAME,
			subject: process.env.PROJECT_NAME + ' - Recuperacion de contraseña',
		}
	},
	initialData: {
		admin: {
			emailAddress: 'leviadmin@gmail.com',
			password: 'levi',
			username: 'leviadmin@gmail.com',
			firstName: 'levi',
			lastName: 'levi',
			fullName: 'levi levi'
		}
	},
	businessRules: {
		statusGuards: {
			accepted: 'accepted',
			pending: 'pending'
		},
	},
	crypto: {
		saltRounds: 12,
		key: process.env.CRYPTO_KEY_BASE, 		// 8 char Hex string
		example: process.env.CRYPTO_KEY_EXAMPLE, 	// 32 char Hex string
		refreshToken: process.env.CRYPTO_KEY_REFRESH_TOKEN,
		phoneNumberValidation: process.env.CRYPTO_KEY_PHONE_NUMBER_VALIDATION,
	},
};

if (settings.docker) settings.database.uri = process.env.DB_URI + settings.database.name;
else settings.database.uri = `mongodb://${settings.database.host}/${settings.database.name}`;

settings.checkEnvironmentVariables = () => {
	if ([
		!process.env.DATABASE_NAME,
		!process.env.TOKEN_REFRESH_KEY,
		!process.env.TOKEN_ACCESS_KEY,
		!process.env.PORT,
		!process.env.PORT_HTTPS,
	].some(Boolean)) throw new Error('Variables de entorno mal configuradas')
}

module.exports = settings;
