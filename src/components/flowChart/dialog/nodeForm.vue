<template>
   <el-dialog  width="50%" :visible.sync="view">
      <div slot="title" class="title">node info</div>
      <el-form :model='selectNodeForm' label-width="60px" :rules='rules' ref="nodeInfoForm">
        <el-form-item label="id" prop="id"  >
          <el-input :value="selectNodeForm.key" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="group" prop="group" >
          <el-input :value="selectNodeForm.group?selectNodeForm.group:'false'" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="class" prop="class" >
          <el-input v-model="selectNodeForm.class" placeholder="0为开始项,只能有一个为0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="view = false">取 消</el-button>
        <el-button type="primary" @click="saveHandle">保 存</el-button>
      </div>
   </el-dialog>
</template>
<style >
  
</style>
<script>

export default {
  name:'nodeForm',
  props:{
    selectNodeForm:Object,
    visible:Boolean
  },
  data(){
   var floar = (rule,value,callback)=>{
      if(isNaN(value)){
        callback(new Error('必须输入数字'))
      }
      callback()
    }  
  return{
    view:this.visible,
    rules:{
      class:[{
        required:true,
        message:'输入不能为空',
      },{
        validator:floar,
        trigger:'blur'
      }]
    },
  }},
  watch:{
    view:{
      handler:function(newValue,oldValue){
        this.$emit('update:visible',newValue)
      }
    },
    visible(newValue){
      this.view = newValue
    },
  },
  methods:{
    saveHandle(){
     this.$refs.nodeInfoForm.validate((valid)=>{
       if(valid){
          this.$store.commit('save',{
            id:this.selectNodeForm.key,
            group:this.selectNodeForm.group == undefined?false:this.selectNodeForm.group,
            class:this.selectNodeForm.class == undefined?false:this.selectNodeForm.class
          })
          this.view = false
       }
     })
   },
  },

}
</script>