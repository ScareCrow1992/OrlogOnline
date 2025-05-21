module.exports = {
    apps: [{
        name: 'app',
        script: './src/index.js',
        instances: 2,
        exec_mode: 'cluster'
    }]
}