const NAME = 'prisus';

module.exports = {
    apps: [
        {
            name: NAME,
            script: 'index.js',
            interpreter: 'babel-node',
            // script: 'npm',
            // args: 'run prod',
            // automation: false,
            max_memory_restart: '100M',
            kill_timeout: 60 * 1000,
            log_date_format: 'DD/MM HH:mm:ss',
            watch: true,
            watch_options: { usePolling: true },
            env: {
                NODE_ENV: 'production',
                DEBUG: 'api*'
            },
            // post_update: [
            //     `echo "executing ${NAME} 'post_update' script"`,
            //     `echo "npm install"`,
            //     'npm install',

            // ]
        }
    ],
    // deploy: {
    //     production: {
    //         user: 'root',
    //         host: [
    //             {
    //                 host: '66.97.44.147',
    //                 port: '5648'
    //             }
    //         ],
    //         key: '~/.ssh/id_rsa.pub',
    //         ref: 'origin/master',
    //         repo: `git@bitbucket.org:diproach/${NAME}.git`,
    //         path: `~/diproach/proyectos/${NAME}`,
    //         // 'pre-setup': '',
    //         'post-setup': 'npm install',
    //         // 'pre-deploy-local': '',
    //         // 'pre-deploy': '',
    //         // 'post-deploy': '',
    //     }
    // },
}