import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex)
const store = new Vuex.Store({
  state:{
    form:[]
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
    }
  },
  actions:{

  },
  getters:{
    form:state=>state.form
  },
  strict:process.env.NODE_ENV !== 'production'
})
export default store