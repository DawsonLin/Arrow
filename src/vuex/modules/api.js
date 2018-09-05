/**
 * Created by Administrator on 2017/12/23.
 */
module.exports = {
    namespaced:true,
    state:{
        info:{},
        lastChangeAreaId:getCache('lastChangeAreaId', '')
    },
    mutations:{
        set_info(state, info){
            state.info = info;
        },
        lastChangeAreaId(state, lastChangeAreaId){
            state.lastChangeAreaId = lastChangeAreaId;
            setCache('lastChangeAreaId', lastChangeAreaId);
        }
    },
    actions:{
        set_info({commit}, info){
            commit('set_info', info);
        },
        lastChangeAreaId({commit}, lastChangeAreaId){
            commit('lastChangeAreaId', lastChangeAreaId);
        }
    },
    getters:{
        info(state){
            console.log(state.info);
            return state.info;
        },
        lastChangeAreaId(state){
            return state.lastChangeAreaId;
        }
    }
};
