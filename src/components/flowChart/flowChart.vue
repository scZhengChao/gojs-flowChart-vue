<template>
  <div class="contain">
    <div class="flowChart">
        <div class="flow">
              <div class="palette" ref='myPaletteDiv'></div>
              <div class="diagram" ref="myDiagramDiv"></div>
            </div>
          <div class="info">
            <div id="selectNode"></div>
            <div class="nodeOrLinkForm"></div>
          </div>
    </div>
    
    <div class="handle">
      <el-button @click="saveSubGram" type="primary" class="handleBtn">保 存</el-button>
      <el-button @click="sendGram" type="primary" class="handleBtn">发 送</el-button>
      <el-checkbox v-model="checked" class="checked" @change='checkSource'>source</el-checkbox>
    </div>
    <node-form :selectNodeForm='selectNodeForm' :visible.sync='visible'></node-form>
    <source-box :visible.sync ='checked' :sourceData='source'></source-box>
  </div>
</template>
<style >
 
</style>
<style scope>
.contain{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.flowChart{
  width: 100%;
  height: 85%;
  display: flex;
}
 .flow{
   width: 80%;
   border:1px solid black;
   height: 100%;
   box-sizing: border-box;
   flex: 1;
   display: flex;
 }
 .palette{
   height: 100%;
   width: 100px;
   border-right: 1px solid black;
 }
 .diagram{
   flex: 1;
 }

  .info{
    background: #399;
    width: 200px;
    height: 100%;
    box-sizing: border-box;
  }
  .handleBtn{
    height: 20px;
    padding:0px 10px;
    margin-top: 10px;
  }
  .handleBtn>span{
    height: 20px;
    line-height: 20px;
  }
  .checked{
    margin-left: 10px;
  }
</style>
<script>
import {cloneDeep} from 'lodash'
import {mapGetters} from 'vuex';
import FlowChart from '@/plugins/flowChart.js'
import nodeForm from './dialog/nodeForm.vue'
import sourceBox from './dialog/source'
import { type } from 'os';
export default {
  name:'flowChart',
  components:{
    nodeForm,sourceBox
  },
  data(){ return{
    visible:false,
    checked:false,
    selectNodeForm:{},
    source:{
      nodeInfo:{},
      formList:[]
    }
  }},
  created() {
    
  },
  mounted() {
    var that = this
   this.flow = new FlowChart({
      vue:this,
      myDiagramDiv:this.$refs.myDiagramDiv,  //画布
      myPaletteDiv:this.$refs.myPaletteDiv,  //模板
      selectNode:'selectNode',  //节点信息
   })
   this.flow.showMessage=(data)=>{
     let item = that.form.find(item=>{
       return item.id == data.key
     })
     item != undefined?that.selectNodeForm = cloneDeep(item):that.selectNodeForm = Object.assign({class:-1},data)
     that.visible = true
   }
  //  this.flow.showLink=(data)=>{
  //    this.selectNodeForm = Object.assign({
  //     class:0
  //    },data)
  //    that.visible = true
  //  }
  },
  methods: {

   saveSubGram(){

   },
   sendGram(){

   },
   checkSource(data){
    if(!data) return
    this.source.nodeInfo = this.flow.save()
    this.source.formList = this.form
   }
  },
  computed:{
      ...mapGetters([
      'form'
    ])
  }
}
</script>
