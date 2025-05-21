const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true,
        // open: !isCodeSandbox, // Open if it's not a CodeSandbox
        // hmr: {
        //     host: "localhost",
        //     port: 433,
        //     protocol: "wss",
        // },
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
}