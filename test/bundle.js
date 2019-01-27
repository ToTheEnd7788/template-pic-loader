import webpack from 'webpack';
import configs from './webpack.config';

webpack(configs, (err, stats) => {
  if (err) console.log(err);

  console.log(stats.toString({
    colors: true
  }));
});