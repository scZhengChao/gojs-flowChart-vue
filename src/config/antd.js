 import { Button ,Modal,Form,Input} from 'ant-design-vue';
export default {
  install:function(Vue){
    Vue.use(Button)
    Vue.use(Modal)
    Vue.use(Form)
    Vue.use(Input)
  }
}