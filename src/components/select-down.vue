<template>
    <div class="outbox">
        <div class="wrap">
            <span class="check">查询类型</span>
            <div class="inputbox">
                <input type="text" value="" v-model="selectitem">
            </div>
            <div class="custon-btn" @click="changeState">
                <div class="arrow-down"></div>
            </div>
        </div>
       <transition>
            <div class="custon-down" v-if="downshow">
                <div class="item" v-for="(item,index) in data" :key="index" @click="select(item,index)" :style="{background:showIndex===index?'rgb(228,228,228)':null}">
                    <span>{{item.label}}</span>
                    <!-- <div class="dot" >
                        <span ref="dot"></span>
                    </div> -->
                </div>
            </div>
       </transition>
    </div>
</template>

<script>
//条码 有数据的时候 点击item 触发请求  没有数据的时候 可以选择 不请求
    export default {
        props:['selectList','value','gitinput','mmpshow'],
        data() {
            return {
                data: this.selectList,
                downshow:false,
                showIndex:null,
                selectitem:'SKU',
                resinput:this.gitinput,
                tabshow:this.mmpshow
            }
        },
        methods: {
            changeState() {
                this.downshow=!this.downshow
                this.tabshow=false
                this.$emit('update:mmpshow',this.tabshow)
               /* if(this.downshow){
                   let int=this.showIndex ||0
                   this.$nextTick(()=>{
                      this.$refs.dot[int].style.background='pink'
                   })
                //    this.$refs.dot[int].style.background='pink'
                }*/
            },
            select(v,i){
                this.tabshow=true
                this.$emit('update:mmpshow',this.tabshow)
                this.showIndex=i
                this.downshow=false
                this.selectitem=v.label
                //this.$emit('chufa',this.selectitem)
                console.log(this.resinput.length,'len')
                this.$emit('req')
                this.$emit('chufa',this.selectitem)
                // if(this.resinput.length<=0){
                // this.$emit('req')
                // this.$emit('chufa',this.selectitem)
                // }
                // this.$refs.dot[i].style.background='pink'
            }
        },
        watch:{
            showIndex(val){
                this.showIndex=val
            },
           gitinput(val){
               console.log(49794878)
               this.resinput=val
           }
        },
    }
</script>

<style scoped>
.outbox{
    width: 320px;
}
.wrap{
    width: inherit;
    display: flex;
    align-items: center;
}
.check{
    font-size: 13px;
    width: 70px;
    margin-left: 12px;
}
.inputbox{
    width: 180px;
    margin-left: -13px;
}
.inputbox input{
    width: inherit;
    height: 26px;
    outline: none;
    /*border: none;*/
    border: 1px solid #b8bbbf;
    border-radius: 4px;
    text-indent: 4px;
}
.custon-btn{
    width: 50px;
    height: 26px;
    border: 1px solid #b8bbbf;
    margin-left: 3px;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    align-items: center;
}
.arrow-down {
    width:0;
    height:0;
    border-right:8px solid transparent;
    border-left:8px solid transparent;
    border-top:8px solid #b8bbbf;
}
.custon-down{
    width: 180px;
    border: 1px rgb(228, 228, 228) solid;
    margin-left: 70px;
    margin-top: 1px;
    border-radius: 4px;
    height: 80px;
    overflow: auto;
}
.custon-down .item{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(228, 228, 228);
    padding: 0 4px;
}
.dot{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgb(189, 187, 187);
    display: flex;
    justify-content: center;
    align-items: center;
}
.dot span{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(248, 246, 246);
    display: inline-block;
}
</style>