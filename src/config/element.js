import {Dialog,Button,Form,FormItem,Input,Checkbox} from 'element-ui'
export default {
  install:function(Vue){
    Vue.use(Dialog)
    Vue.use(Button)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Checkbox)
  }
}