import axios from 'axios';
//const serviceEndpoint = process.env.Base_Api;
// if (!serviceEndpoint) throw new Error('未找到接口服务配置信息');
console.log( process.env.Base_Api)
const client = axios.create({
  //baseURL: process.env.Base_Api,
  baseURL:'http://localhost:8082',
  headers: {
    "Client-Agent":"2/3361DEA1-B045-4043-ADB7-8C41A3F41205/1.0/1/14.0/iPhoneX"
  },
  timeout: 50000,
});


client.interceptors.response.use(config => {
  // if ((token != null && token != '' && token != undefined) || config.url.indexOf("login") === 14){
  //   config.headers['adminToken'] = token;
  // } else {
  //   alert("token为空,请重新登录!")
  //   sessionStorage.clear()
  //   Router.push({name: 'Login'})
  // }
  return config.data
});

client.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token")
    config.headers['token'] = token;
    //  let token = sessionStorage.getItem("adminToken")
    // if ((token != null && token != '' && token != undefined) || config.url.indexOf("login") === 14){
    //    config.headers['adminToken'] = token;
    //   return config;
    // } else {
    //   alert("token为空,请重新登录!")
    //   sessionStorage.clear()
    //   Router.push({name: 'Login'})
    // }
    return config;

  },
  error => {
    return Promise.reject(error);
  });


export default client;

//export { serviceEndpoint };

//将token放到请求头发送给服务器,将tokenkey放在请求头中
//config.headers.Authorization = `token ${token}`;

//也可以这种写法
// config.headers['accessToken'] = token;
