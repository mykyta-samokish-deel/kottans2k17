<template lang='pug'>
  #app
    header: router-link(to='/') Home
    modal(v-if='showModal && defaultData !== null' @close='showModal = false')
      template(slot='header')
        a(:href='defaultData.html_url' target='_blank') {{ defaultData.name }}
        br
        a(:href='defaultData.parent.html_url' target='_blank' v-if='defaultData.fork') Origin: {{ defaultData.parent.full_name }}

      template(slot='body')
        p {{ defaultData.description }}
        .table
          ul.info(v-if='modalData.languages')
            span TOP LANGUAGES
            li(v-for='value, key in modalData.languages' v-if='value > 1023')
              span.key {{ key }}
              span.value | {{ value / 10 }} Kb
          ul.info(v-if='modalData.contributors')
            span TOP CONTRIBUTORS
            li(v-for='i in modalData.contributors.slice(0, 3)')
              a.key(:href='i.html_url') {{ i.login }}
              span.value | {{ i.contributions }}

      template(slot='footer')
        ul.info(v-if='modalData.pulls && modalData.pulls.length')
          span MOST TRENDING PULL REQUESTS
          li(v-for='i in modalData.pulls')
            a.link(:href='i.html_url' target='_blank') {{ i.title }}
        button.modal-default-button(@click="showModal = false") OK

    transition(name='fade'): router-view
</template>

<script>
import bus from './bus'

export default {
  name: 'app',
  data () {
    return {
      showModal: false,
      modalData: {
        data: null,
        languages: null,
        comments: null,
        contributors: null,
        pulls: null
      }
    }
  },
  computed: {
    defaultData () {
      return this.modalData.data
    }
  },
  components: {
    Modal: () => import('@/components/Modal')
  },
  mounted () {
    bus.$on('triggerModal', rep => {
      this.showModal = true
      fetch(`https://api.github.com/repos/${rep.fullName}`)
        .then(res => res.json())
        .then(data => {
          this.modalData.data = data
        })
        .then(() => {
          fetch(this.defaultData.languages_url)
            .then(r => r.json())
            .then(data => {
              this.modalData.languages = data
            })

          fetch(this.defaultData.contributors_url)
            .then(r => r.json())
            .then(data => {
              this.modalData.contributors = data
            })

          fetch(`${this.defaultData.url}/pulls?sort=popularity&state=open&per_page=5`)
            .then(r => r.json())
            .then(data => {
              this.modalData.pulls = data
            })
        })
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
