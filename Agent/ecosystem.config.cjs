module.exports = {
    apps: [
        {
            name: 'app',
            // script: './GameLearning/run.js',
            script: './index/index.js',
            instances: 18,
            // instances: 3,
            exec_mode: 'cluster',
            node_args: "--expose-gc"
        },
    ],
    "autorestart": false
}