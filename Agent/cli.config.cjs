module.exports = {
    apps: [
        {
            name: 'cli',
            // script: './GameLearning/run.js',
            script: './index/cli/CLI.js',
            instances: 1,
            exec_mode: 'cluster'
        }
    ],
    "autorestart": false
}