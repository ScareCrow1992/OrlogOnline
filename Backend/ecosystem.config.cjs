module.exports = {
    apps: [{
        name: 'app',
        script: './index/index.js',
        instances: 1,
        exec_mode: 'cluster'
    }]
}