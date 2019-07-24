import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex)
const store = new Vuex.Store({
  state:{
    form:[],
    subOptions:[],
  },
  mutations:{
    save:(state,payload)=>{
      let value = state.form.findIndex(item=>{
        return item.id == payload.id
      })
      if(value == -1){
        state.form.push(payload)
      }else{
        state.form[value] = payload
      }
    },
    saveSub:(state,payload)=>{
      let option = {
        value:JSON.stringify({
          nodeDataArray:payload.nodeDataArray,
          linkDataArray:payload.linkDataArray
        }),
        label:payload.name
      }
      state.subOptions.push(option)
    }
  },
  actions:{

  },
  getters:{
    form:state=>state.form,
    subOptions:state=>state.subOptions
  },
  strict:process.env.NODE_ENV !== 'production'
})
export default store