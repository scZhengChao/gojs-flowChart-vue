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
          linkDataArray:payload.linkDataArray,
          form:payload.form
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
      son.parent.includes(payload.father)?"":son.parent.push(payload.father)
      let father = state.form.find(item=>item.id == payload.father)
      father.son.includes(payload.son)?"":father.son.push(payload.son)
    },
    clearForm:(state,payload)=>{
      state.form = []
    },
    loadSubForm:(state,payload)=>{
      state.form = state.form.concat(payload)
    },
    clearParent:(state,payload)=>{
      state.form.forEach(item=>{
        item.parent.length = 0
        item.son.length = 0
      })
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