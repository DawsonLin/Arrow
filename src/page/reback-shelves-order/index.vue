<template>
    <div class="picking-process">
        <mt-header fixed title="退货上架单">
            <router-link to="/menu" slot="left">
                <i class="mintui mintui-back go-back"></i><span>返回</span>
            </router-link>
            <!--<div slot="right">
                分区：<select v-model="warehouse_area_id" @change="change_warehouse_area" style="width: 60px;">
                <option v-for="item in warehouseAreaList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">{{item.label}}</option>
            </select>
            </div>-->
            <div slot="right" @click="get_zone" class="partition"><span  v-if="!seltitle">分区</span> <span v-if="seltitle">{{seltitle}}</span></div>
        </mt-header>
        <div class="pt-lg">

            <table class="table" width="100%">
                <thead>
                <tr ><th width="23%">上架单号</th><th width="23%">上架区</th><th width="23%">状&nbsp;&nbsp;态</th><th width="23%">创建人</th><th width="8%"></th></tr>
                </thead>
                <tbody  v-resize="{height:2}">
                <tr
                        v-for="(row,index) in pickingData"
                        :key="row.id"
                        :class="[index%2===0?'line-bg':'',status===index?'red':'']"
                        @click="get_picking(row)"
                >
                    <td width="23%">{{row.id}}</td>
                    <td width="23%">{{row.warehouse_area_code}}</td>
                    <td width="23%">{{row.status_name}}</td>
                    <td width="23%">{{row.creator_name}}</td>
                    <td width="8%"><i class="mintui mintui-back back" style="font-size: 17px;"></i></td>
                </tr>
                </tbody>
            </table>
        </div>
        <Zone v-model="zoneshow" :zone="warehouseAreaList" :wareid.sync="warehouse_area_id"
              @get_wareid="get_wareid"
        ></Zone>
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
    import{return_reback_shelves_order} from '../../api/putaway-order';
    import{api_warehouse_area} from '../../api/picking-process';
    import {mapGetters} from 'vuex';
    import Zone from '@/components/Zone';
    /*
     * 后端:刘志勇
     * */
    export default{
        data(){
            return{
                warehouse_id:'',
                warehouse_area_id:'全部',
                pickingData:[],
                warehouseAreaList:[],
                zoneshow:false,
                seltitle:null,
            }
        },
        mounted(){
            this.warehouse_id = this.$route.query.warehouse_id;
            this.get_warehouse_area();
            this.init();
        },
        methods:{
            get_wareid(val){
                this.seltitle=val
                console.log(this.seltitle,'title')
            },
            get_zone(){
                this.zoneshow=true
            },
            get_warehouse_area(){
                let data = {
                    warehouse_id : this.warehouse_id,
                    status:1,
                    warehouse_area_type:11,
                    sort_operator:1,
                };
                this.$http(api_warehouse_area,data).then(res=>{
                    this.warehouseAreaList = res;
                    this.warehouseAreaList = this.warehouseAreaList.map(res=>{
                        return {
                            value:res.id,
                            label:res.code,
                        };
                    });
                    if(res[0].operator_area === 1){
                        this.warehouse_area_id=res[0].code
                    }
                    this.warehouseAreaList.unshift({value:'',label:'全部'});
//                    this.warehouse_area_id = this.warehouseAreaList[0].value;
                    this.init();
                }).catch(code=>{
                    Toast({message:code.message,position: 'top',duration: 1000});
                });
            },
            change_warehouse_area(){
                this.init();
            },
            async init(){
                let data = {
                    warehouse_id:this.warehouse_id,
                    warehouse_area_code:this.warehouse_area_id==='全部'?'':this.warehouse_area_id,
                };
                this.$http(return_reback_shelves_order,data).then(res=>{
                    this.pickingData = res.data;
                    this.pickingData.forEach(data=>{
                        this.$set(data,'warehouse_id',this.warehouse_id);
                    });
                }).catch(code=>{
                    setTimeout(()=>{
                        this.$router.push('/menu')
                    },1500);
                    Toast({message:code.message,position: 'top',duration: 1000});
                    console.log(code);
                });
            },
            get_picking(row){
                this.$router.push({
                    path:"/reback-shelves-order/detail",
                    query:{
                        id:row.id,
                        warehouse_id:row.warehouse_id
                    }
                });
            }
        },
        computed:{
            ...mapGetters({
                loginInfo:'user/info'
            }),
            status(){
                let find = this.pickingData.findIndex(res=>{
                    return res.creator_id === this.loginInfo.realname&&res.status==='上架中';
                });
                console.log("find",find);
                return find;
            }
        },
        components:{
            Zone,
        }
    }
</script>
