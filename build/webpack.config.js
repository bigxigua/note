const webpack = require('webpack');
const path = require('path');
// 压缩代码，用于替换uglifyjs-webpack-plugin
const TerserPlugin = require('terser-webpack-plugin');
// 它将在Webpack构建期间搜索CSS资产，并将优化、最小化CSS（默认情况下，它使用cssnano，但可以指定自定义CSS处理器）。解决了extract-text-webpack-plugin CSS重复问题
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// PostCSS的容错CSS解析器，可以找到并修复语法错误，能够解析任何输入
const safePostCssParser = require('postcss-safe-parser');
// 此插件将CSS提取到单独的文件中。它为每个包含CSS的JS文件创建一个CSS文件。它支持CSS和SourceMaps的按需加载
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 生成一份资源清单的json文件
const ManifestPlugin = require('webpack-manifest-plugin');
// 路径区分大小写
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
// 检测当前环境是否运行在 Windows Subsystem for Linux上
const isWsl = require('is-wsl');
// css Loader
const getStyleLoaders = require('./getStyleLoaders');
const getCSSModuleLocalIdent = require('./getCSSModuleLocalIdent');
const getCacheIdentifier = require('./getCacheIdentifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('./InlineChunkHtmlPlugin');
// 给html模版注入变量
const InterpolateHtmlPlugin = require('./InterpolateHtmlPlugin');
const ModuleNotFoundPlugin = require('./ModuleNotFoundPlugin');
// 可视化分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
  shouldUseSourceMap,
  isEnvProduction,
  isEnvDevelopment,
  devtool,
  appIndexJs,
  publicPath,
  publicUrl,
  appBuildPath,
  appNodeModules,
  appSrc,
  appHtml,
  appPath,
  stringified,
  contentBase
} = require('./config');
const webpackConfig = {
  devtool,
  entry: [appIndexJs],
  output: {
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].bundle.js'
      : 'static/js/bundle.js',
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name]/bundle.js',
    publicPath,
    path: isEnvProduction ? appBuildPath : undefined
  },
  optimization: {
    minimize: isEnvProduction, // 开启优化
    minimizer: [
      // 仅isEnvProduction===true生效，自定义优化选项
      // 压缩js
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        parallel: !isWsl, // 在 Windows Subsystem for Linux时禁用多进程并行运行，默认并发运行数：os.cpus().length - 1
        cache: true,
        sourceMap: shouldUseSourceMap
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
              // `inline: false` forces the sourcemap to be output into a
              // separate file
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true
            }
            : false
        }
      })
    ],
    // Automatically split vendor and commons
    splitChunks: {
      chunks: 'all',
      name: false
    },
    // Keep the runtime chunk separated to enable long term caching
    runtimeChunk: true
  },
  resolve: {
    // 添加别名
    alias: {
      '@components': path.resolve(__dirname, '../app/components/'),
      '@common': path.resolve(__dirname, '../app/common/'),
      '@hooks': path.resolve(__dirname, '../app/hooks/'),
      '@context': path.resolve(__dirname, '../app/context/'),
      '@config': path.resolve(__dirname, '../app/config/'),
      '@public': path.resolve(__dirname, '../app/public/'),
      '@util': path.resolve(__dirname, '../app/util/'),
      '@page': path.resolve(__dirname, '../app/page/'),
      '@layout': path.resolve(__dirname, '../app/layout/')
    },
    // 告诉webpack在解析模块时应该搜索哪些目录。
    modules: ['node_modules', appNodeModules],
    plugins: [
      // Adds support for installing with Plug'n'Play, leading to faster installs and adding
      // guards against forgotten dependencies and such.
      PnpWebpackPlugin
    ]
  },
  resolveLoader: {
    plugins: [
      // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
      // from the current package.
      PnpWebpackPlugin.moduleLoader(module)
    ]
  },
  module: {
    // 使丢失的导出错误而不是警告
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      // {
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       options: {
      //         formatter: require.resolve('./eslintFormatter'),
      //         eslintPath: require.resolve('eslint'),
      //         // @remove-on-eject-begin
      //         baseConfig: {
      //           extends: [require.resolve('eslint-config-react-app')]
      //         },
      //         ignore: false,
      //         useEslintrc: false
      //         // @remove-on-eject-end
      //       },
      //       loader: require.resolve('eslint-loader')
      //     }
      //   ],
      //   include: appSrc
      // },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, TypeScript, and some ESnext features.
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              // @remove-on-eject-begin
              babelrc: false,
              configFile: false,
              presets: [require.resolve('babel-preset-react-app')],
              // Make sure we have a unique cache identifier, erring on the
              // side of caution.
              // We remove this when the user ejects because the default
              // is sane and uses Babel options. Instead of options, we use
              // the react-scripts and babel-preset-react-app versions.
              cacheIdentifier: getCacheIdentifier(
                isEnvProduction
                  ? 'production'
                  : 'development',
                [
                  'babel-plugin-named-asset-import',
                  'babel-preset-react-app'
                ]
              ),
              // @remove-on-eject-end
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo,+ref![path]'
                      }
                    }
                  }
                ]
              ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              compact: isEnvProduction
            }
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve('babel-preset-react-app/dependencies'),
                  { helpers: true }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              // @remove-on-eject-begin
              cacheIdentifier: getCacheIdentifier(
                isEnvProduction
                  ? 'production'
                  : 'development',
                [
                  'babel-plugin-named-asset-import',
                  'babel-preset-react-app'
                ]
              ),
              // @remove-on-eject-end
              // If an error happens in a package, it's possible to be
              // because it was compiled. Thus, we don't want the browser
              // debugger to show the original code. Instead, the code
              // being evaluated would be much more helpful.
              sourceMaps: false
            }
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use MiniCSSExtractPlugin to extract that CSS
          // to a file, but in development "style" loader enables hot editing
          // of CSS.
          // By default we support CSS Modules with the extension .module.css
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isEnvProduction && shouldUseSourceMap
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true
          },
          // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
          // using the extension .module.css
          {
            test: /\.module\.css$/,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isEnvProduction && shouldUseSourceMap,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent
            })
          },
          // Opt-in support for SASS (using .scss or .sass extensions).
          // By default we support SASS Modules with the
          // extensions .module.scss or .module.sass
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: isEnvProduction && shouldUseSourceMap
              },
              'sass-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: /\.module\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent
              },
              'sass-loader'
            )
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ]
      }
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: appHtml
        },
        isEnvProduction
          ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
          }
          : undefined
      )
    ),
    // 显示文件大小
    // new BundleAnalyzerPlugin(),
    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    isEnvProduction &&
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: publicUrl,
      TITLE: '一日一记',
      OFFLINE_TITLE: '离线笔记本'
    }),
    // This gives some necessary context to module not found errors, such as
    // the requesting resource.
    new ModuleNotFoundPlugin(appPath),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(stringified),
    // This is necessary to emit hot updates (currently CSS only):
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    isEnvProduction &&
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath,
      generate: (seed, files) => {
        const manifestFiles = files.reduce(function (manifest, file) {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        return {
          files: manifestFiles
        };
      }
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    isEnvProduction &&
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: publicUrl + '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp('/[^/]+\\.[^/]+$')
      ]
    })
  ].filter(Boolean)
};
if (isEnvDevelopment) {
  webpackConfig.devServer = {
    publicPath,
    contentBase,
    before: function (app, server) {
    },
    after: function (app, server) {
    },
    clientLogLevel: 'none', // string: 'none' | 'info' | 'error' | 'warning'
    // 此选项允许您将允许访问dev服务器的服务列入白名单。
    allowedHosts: [
      // 'host.com',
      // 'subdomain.host.com',
      // 'subdomain2.host.com',
      // 'host2.com'
    ],
    // 头部
    headers: {
    },
    inline: true,
    // 打开浏览器
    // open: 'Google Chrome',
    // openPage: '/different/page',
    // 编译错误是否全屏覆盖
    overlay: true,
    historyApiFallback: true,
    compress: true,
    hot: true,
    host: '127.0.0.1',
    port: 3004
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // },
  };
}
module.exports = webpackConfig;