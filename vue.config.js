module.exports = {
    configureWebpack: {
        // 写对象
        resolve: {
            extensions: [],
            alias: { // 开始配置别名
                // '@':'src' 这是默认已经存在的别名
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                // 'router': '@/router', 因为router只会在main.js当中引用，可以不配置别名
                // 'store': '@/store', 因为store引用较少，也可以不配置别名
                'views': '@/views'
            }
        }
    }
}