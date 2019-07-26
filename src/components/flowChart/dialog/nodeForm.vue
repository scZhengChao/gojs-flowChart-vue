<template>
   <el-dialog  width="50%" :visible.sync="view">
      <div slot="title" class="title">node info</div>
      <el-form :model='selectNodeForm' label-width="60px" :rules='rules' ref="nodeInfoForm">
        <el-form-item label="id" prop="id"  >
          <el-input :value="selectNodeForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="parent" prop="parent" >
            <el-select  v-model="selectParent" placeholder="父节点">
              <el-option
                v-for="item in selectNodeForm.parent"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="son" prop="son" >
            <el-select  v-model="selectSon" placeholder="子节点">
              <el-option
                v-for="item in selectNodeForm.son"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="other" prop="other" >
          <el-input v-model="otherTerm"></el-input>
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
  //  var floar = (rule,value,callback)=>{
  //     if(isNaN(value)){
  //       callback(new Error('必须输入数字'))
  //     }
  //     callback()
  //   }  
  return{
    view:this.visible,
    rules:{
    },
    selectParent:'',
    selectSon:'',
  }},
  computed:{
    otherTerm:{
      get(){
        return this.selectNodeForm.others
      },
      set(value){
        this.$store.commit('modifyForm',{id:this.selectNodeForm.id,data:value})
      }
    }
  },
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
          this.view = false
       }
     })
   },
  },

}
</script>