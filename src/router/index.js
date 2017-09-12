import Vue from 'vue'
import Router from 'vue-router'

const SearchInput = () => import('@/components/SearchInput')
const RepList = () => import('@/components/RepList')

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'Root',
      component: SearchInput
    },
    {
      path: '/:owner',
      name: 'RepList',
      component: RepList,
      props: true
    }
  ]
})
