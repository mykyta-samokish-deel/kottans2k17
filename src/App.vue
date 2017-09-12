<template lang='pug'>
  #app
    header: router-link(to='/') Home
    modal(v-if='showModal' @close='showModal = false')
      a(slot='header') {{ modalData.name }}
    transition(name='fade'): router-view
</template>

<script>
import bus from './bus'

export default {
  name: 'app',
  data () {
    return {
      showModal: false,
      modalData: null
    }
  },
  components: {
    Modal: () => import('@/components/Modal')
  },
  mounted () {
    bus.$on('triggerModal', rep => {
      this.showModal = true
      this.modalData = rep
    })
  }
}
</script>

<style lang='stylus'>
*
  box-sizing border-box
  margin 0
  padding 0

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

main
  text-align center
  width 100%

header
  margin 0
  padding 16px 0
  background-color #3F51B5
  color #ffffff
  text-align left

  a
    text-decoration none
    display block
    color white
    position relative
    font-size 20px
    padding-left 16px
    letter-spacing .02em
    font-weight 400

.fade-enter-active, .fade-leave-active
  transition opacity 500ms

.fade-enter, .fade-leave-to
  opacity 0
</style>
