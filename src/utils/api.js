import axios from 'axios'
import {Message} from 'element-ui';
import router from '../router'
import {mymessage} from '@/utils/mymessage';

const client = axios.create({
    //baseURL: process.env.Base_Api,
    baseURL:'/api',
    headers: {
        "Client-Agent":"2/3361DEA1-B045-4043-ADB7-8C41A3F41205/1.0/1/14.0/iPhoneX"
    },
    timeout: 50000,
});
client.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.status == 500) {
        Message.error({message: success.data.msg})
        return;
    }
    if (success.data.msg) {
        Message.success({message: success.data.msg})
    }
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        mymessage.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
        router.replace('/');
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: '未知错误!'})
        }
    }
    return;
})

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: '/api',
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url:'/api',
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: '/api',
        data: params
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url:'/api',
        params: params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: '/api',
        params: params
    })
}
export default client;

