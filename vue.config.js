module.exports = {
    //基本路徑
    publicPath: '/',

    //輸出文件目錄
    outputDir: 'dist',

    // webpack-dev-server 相關配置
    devServer: {
        open: process.platform === 'chrome',
        host: '127.0.0.1',
        port: 8087,
        open: true,
        https: false,
        hotOnly: false,
        proxy: null, // 設置代理
        before: app => {}
    },
}