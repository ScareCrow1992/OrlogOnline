module.exports = {
    apps: [{
        name: 'app',
        script: './src/index.js',
        instances: 4,
        exec_mode: 'cluster'
    }]
}