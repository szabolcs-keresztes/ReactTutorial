 module.exports = {
     entry: './public/scripts/app.js',
     output: {
         path: './public/dist',
         filename: 'app.js',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel',
             query: {
                presets: ['es2015', 'react']
             }
         }]
     }
 }