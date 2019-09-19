import axios from 'axios'
import vue from 'vue'
import router from './router'

const http = axios.create({
    baseURL:"http://localhost:3000/admin/api"
})

//设置头信息
http.interceptors.request.use(function (config) {
    // Do something before request is sent
    if(localStorage.token){
        config.headers.Authorization = 'bearer ' + (localStorage.token || '')
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

//axios  ->  interceptors     http拦截器
http.interceptors.response.use(res=>{
    return res
},err=>{
    if(err.response.data.message){
        vue.prototype.$message({
            type:'error',
            message:err.response.data.message
        })

        if(err.response.status === 401){
            router.push('/login')
        }


    }
    return Promise.reject(err)
})

export default http