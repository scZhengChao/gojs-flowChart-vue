import Vue from 'vue'
import Router from 'vue-router'
import flowChart from '@/components/flowChart/flowChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'flowChart',
      component: flowChart
    }
  ]
})
