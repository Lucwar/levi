const translations = {
    es: {
        welcomeMagicLink: () => `Bienvenido a ${process.env.PROJECT_NAME}!`,
        useMagicLink: () => `Haz click en el enlace para entrar a la app! Expira en 15 minutos.`,
        magicLinkOpenApp: () => `Ir a la App`,
        recoverPassword: () => `Restablecer contraseña`,
        recoverPasswordLink: link => `Ingresa a este link para crear una nueva contraseña: ${link}`,
        support: () => `Soporte`,
        picture: () => `Imágen`,
    },
};

module.exports = translations;
