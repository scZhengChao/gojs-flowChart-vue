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
    },
    deleteForm:(state,payload)=>{
      let index = state.form.findIndex(item=>item.id == payload.key)
      state.form.splice(index,1)
    },
    setParents:(state,payload)=>{
      let son = state.form.find(item=>item.id == payload.son)
      son.parent?son.parent.push(payload.father):son.parent = [payload.father]
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