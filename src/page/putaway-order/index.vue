<template>
    <div class="picking-process">
        <mt-header fixed title="上架单管理">

            <router-link to="/menu" slot="left">
                <i class="mintui mintui-back go-back" ></i><span>返回</span>
            </router-link>
            <div slot="right">
                <button @click="create_order" class="partition">创建上架单</button>
            </div>
        </mt-header>
        <div class="pt-lg">
            <table class="table" width="100%">
                <thead>
                <tr ><th width="24%">上架单号</th><th width="24%">上架区</th><th width="28%">状态</th><th width="16%">创建人</th><th width="8%">&nbsp;</th></tr>
                </thead>
                <tbody  v-resize="{height:2}">
                <tr
                        v-for="(row,index) in pickingData"
                        :key="row.id"
                        :class="[index%2===0?'line-bg':'',status===index?'red':'']"
                        @click="get_picking(row)"
                >
                    <td width="24%">{{row.id}}</td>
                    <td width="24%">{{row.warehouse_area_id}}</td>
                    <td width="28%">{{row.status}}</td>
                    <td width="16%">{{row.creator_id}}</td>
                    <td width="8%"><i class="mintui mintui-back back" style="font-size: 17px;"></i></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
    .mint-cell-value{
        width:100%;
    }
    .table-box{
        width: 100%;
        margin:0;
        padding:0;
        border-collapse: collapse;
        border-spacing: 0;
        margin: 0 auto;
        th{
            /*background: #eff2f7;*/
        }
        th,td{
            width :25%;
            font-size: 1em;
            height: 26px;
            text-align: center;
            box-sizing: border-box;
        }
    }
</style>
<script>
    import { Toast } from 'mint-ui';
    import{putaway_order} from '../../api/putaway-order';
    import {api_login_info} from '../../api/user';
    /*
     * 后端:刘志勇
     * */
    export default{
        data(){
            return{
                warehouse_id:'',
                pickingData:[],
                loginInfo:[],
            }
        },
        mounted(){
            this.warehouse_id = this.$route.query.warehouse_id;
            this.init();
        },
        methods:{
            async init(){
                let data = {warehouse_id:this.warehouse_id};
                try{
                    const res = await this.$http(putaway_order,data);
                    this.pickingData = res.data;
                    this.pickingData.forEach(data=>{
                        this.$set(data,'warehouse_id',this.warehouse_id);
                    });
                }catch (code) {
                    setTimeout(()=>{this.$router.go(-1)},1000)
                    Toast({message:code.message,position: 'top',duration: 1000});
                    return Promise.reject()
                }
                const login_info = await this.$http(api_login_info)
                this.loginInfo = login_info;
            },
            create_order(){
                let find = this.pickingData.find(res=>{
                    return res.creator_id === this.loginInfo.realname;
                });
                if(!!find){
                    Toast({message:`请先完成${find.id}上架单`,position: 'top',duration: 1500});
                }else{
                    this.$router.push({
                        path:"/putaway-order/detail",
                        query:{
                            warehouse_id:this.$route.query.warehouse_id
                        }
                    });
                }
            },
            get_picking(row){
                if(row.creator_id !== this.loginInfo.realname){
                    Toast({message:`请处理自己的上架单`,position: 'top',duration: 1500});
                }else{
                    this.$router.push({
                        path:"/putaway-order/detail",
                        query:{
                            id:row.id,
                            warehouse_id:row.warehouse_id
                        }
                    });
                }
            }
        },
        computed:{
            status(){
                let find = this.pickingData.findIndex(res=>{
                    return res.creator_id === this.loginInfo.realname&&res.status==='上架中';
                });
                console.log("find",find);
                return find;
            }
        },
        components:{

        }
    }
</script>
