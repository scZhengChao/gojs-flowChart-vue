<template>
    <el-dialog  width="100%" :visible.sync="view" title="source" class="source">
      <textarea class="sourceBox" v-text='sourceData.nodeInfo'></textarea>
      <textarea v-text="sourceData.formList" class="sourceBox"></textarea>
   </el-dialog>
</template>
<style >
  .source .el-dialog__body{
    overflow: hidden;
  }
  .sourceBox{
    width: 50%;
    height: 300px;
    float: left;
  }
</style>
<script>
export default {
  name:'sourceData',
  props:{
    visible:Boolean,
    sourceData:Object
  },
  data(){return{
    view:this.visible
  }},
  methods:{

  },
  watch:{
    visible(newValue){
      this.view = newValue
    },
    view(newValue){
      this.$emit('update:visible',newValue)
    }
  }
}
</script>