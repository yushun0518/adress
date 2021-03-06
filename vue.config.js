const webpack = require('webpack')
const path = require('path')

// 去console插件
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // 用于嵌套生成的静态资产（js，css，img，fonts）的目录。
  // assetsDir: '',
  // 以多页模式构建应用程序。
  pages: undefined,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 是否使用包含运行时编译器的Vue核心的构建。
  runtimeCompiler: false,
  // 默认情况下babel-loader忽略其中的所有文件node_modules。
  transpileDependencies: [],
  // 生产环境sourceMap
  productionSourceMap: false,
  // webpack配置
  configureWebpack: config => {
    let plugins = [
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       warnings: false,
      //       drop_debugger: true,
      //       drop_console: true,
      //     },
      //   },
      //   sourceMap: false,
      //   parallel: true,
      // }),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|') +
          ')$',
        ),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ]
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('api', resolve('src/api'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('utils', resolve('src/utils'))
      .set('pages', resolve('src/pages'))
    // 处理moment加载多个语言文件问题
    config.plugin('context').use(webpack.ContextReplacementPlugin,
      [/moment[/\\]locale$/, /zh-cn/])
  },
  // css相关配置
  css: {
    modules: false,
    sourceMap: false,
    loaderOptions: {
      stylus: {
        'resolve url': true
      },
    },
  },
  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 打开浏览器
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/ejoy': {
        target: 'http://test-api.skxny.bjoil.com',
        changeOrigin: true,
        pathRewrite: {
          '^/ejoy': '/' //这里理解成用‘/test’代替target里面的地址，组件中我们调接口时直接用/api代替
        }
      }
    }, // 设置代理
  },
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  pwa: {},
  // 第三方插件配置
  pluginOptions: {
    /*'cube-ui': {
      postCompile: true,
      theme: true,
    },*/
  },
}
