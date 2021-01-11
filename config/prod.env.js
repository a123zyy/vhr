'use strict'

const testEnv = require('./test.env');  //引入配置
const devEnv = require('./dev.env');  //引入配置

let envType = process.argv.splice(2)[0] || 'prod'; //读取变量
let envs = {
  prod:{
    NODE_ENV: '"production"',
    // Base_Api: '"http://qa.dongsenzs.com:8081"'
    Base_Api:'"https://mg.hongwan.com.cn"'
  },
  dev:devEnv,
  test:testEnv,
};
let exportENV = envs[envType];  //取相应配置

module.exports = exportENV
