import {http} from './http';
import './cache'
import store from '@/vuex';
import { Toast } from 'mint-ui';
const httpServer = async (request, data = {}, header  = {contentType:'application/x-www-form-urlencoded'})=>{
    store.dispatch('loading',true);
    try {
        var awaitHttp = await http(request, data, header);
        console.log('code awaitHttp>>>:',awaitHttp,request);
        setTimeout(()=>{store.dispatch('loading',false)},150);
        return Promise.resolve(awaitHttp)
    }catch (err){
        console.log('code err>>>:',err,request);
        setTimeout(()=>{store.dispatch('loading',false)},1000);
        return Promise.reject(err)
    }
};
export default httpServer;