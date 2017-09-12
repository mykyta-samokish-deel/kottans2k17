<template lang='pug'>
  main
    h1.title {{ owner }}
    .filters
      .order
        label(for='order') Order:
        input(type='checkbox' :value='true' v-model='order' name='order')
      .sort
        label Sort:
        select(v-model='sort')
          option(v-for='order in sortOptions' :key='order') {{ order }}
      ul.filter
        li
          label(for='date') Last Updated:
          input(type='date' name='date' v-model='filter.date')

        li
          label Languages:
          select(v-model='filter.lang')
            option
            option(v-for='lang in getLanguages(data)') {{ lang }}

        li
          label Stars: {{ filter.stars }}
          input(type='range' v-model='filter.stars' :max='getMaxStars' :min='0')

        li
          label(for='issues_count') Has open issues:
          input(type='checkbox' :value='true' v-model='filter.issues' name='issues_count')

        li
          label(for='topics') Has topics:
          input(type='checkbox' :value='true' v-model='filter.topics' name='topics')

        li
          label Type:
          select(v-model='filter.type')
            option(v-for='type in ["all", "forks", "sources"]') {{ type }}

    transition-group.repository-list(v-show='data.length' name='list' tag='ul')
      rep-item(v-for='item in sortedArray(data)' :rep='item' :key='item.id')

    button.load-more(@click='loadMore()') Load More
</template>

<script>
import RepItem from './RepItem'

export default {
  name: 'repository-list',
  components: {
    RepItem
  },
  data () {
    return {
      data: [],
      page: 1,
      per_page: 30,
      filter: {
        lang: null,
        date: null,
        stars: 0,
        issues: false,
        topics: false,
        type: 'all'
      },
      sort: 'Repo Name',
      order: false
    }
  },
  computed: {
    sortOptions () {
      return [
        'Repo Name',
        'Stars Count',
        'Open Issues Count',
        'Updated Date'
      ]
    },
    formattedDate () {
      return this.filter.date && this.filter.date.split('-').reverse().join('.')
    },
    getMaxStars () {
      return Math.max(...this.data.map(i => i.stargazers_count))
    }
  },
  props: ['owner'],
  methods: {
    loadMore () {
      const { owner, page } = this
      caches.open(`cached-reps`).then(cache => {
        fetch(`https://api.github.com/users/${owner}/repos?page=${page}&per_page=${this.per_page}`, {
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json'
          }
        })
          .then(res => res.json())
          .then(data => {
            if (!data.length) return

            cache.add(owner)
            this.data = this.data.concat(data)
            this.page += 1
          })
          .catch(console.error)
      })
    },
    getLanguages (reps) {
      return [...new Set(reps.map(i => i.language))].filter(Boolean)
    },
    filters (rep) {
      return this.byLanguage(rep) &&
        this.byStars(rep) &&
        this.byUpdatedDate(rep) &&
        this.byOpenIssues(rep) &&
        this.byTopicsCount(rep) &&
        this.byType(rep)
    },
    byTopicsCount (rep) {
      return this.filter.topics
        ? rep.topics.length > 0
        : true
    },
    byType (rep) {
      if (this.filter.type === 'all') return true
      if (this.filter.type === 'forks') return rep.fork
      if (this.filter.type === 'sources') return !rep.fork
    },
    byOpenIssues (rep) {
      return this.filter.issues
        ? rep.open_issues_count > 0
        : true
    },
    byStars (rep) {
      return rep.stargazers_count >= this.filter.stars
    },
    byUpdatedDate (rep) {
      if (!this.filter.date) return rep
      return new Date(rep.updated_at) > new Date(this.filter.date)
    },
    byLanguage (rep) {
      if (!this.filter.lang) return rep
      return rep.language === this.filter.lang
    },
    sortReps (reps) {
      const clone = reps.slice(0) // cloned arr
      switch (this.sort) {
        case 'Stars Count':
          clone.sort((a, b) => a.stargazers_count - b.stargazers_count)
          return clone
        case 'Open Issues Count':
          clone.sort((a, b) => a.open_issues_count - b.open_issues_count)
          return clone
        case 'Updated Date':
          clone.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
          return clone
        default:
          return reps
      }
    },
    sortedArray (reps) {
      const result = this.sortReps(reps).filter(this.filters)
      return this.order
        ? result.reverse()
        : result
    }
  },
  mounted () {
    this.loadMore()
  }
}
</script>

<style lang='styl'>
main
  text-align center
  width 100%

  .load-more
    margin 10px 0
    margin-bottom 15px
    border-width 0
    width 200px
    border-radius 8px
    background-color #3F51B5
    color #fff
    padding 10px

  .title
    padding 5px

  .filters
    padding 5px
    display flex
    flex-direction column

    .order, .filter, .sort
      list-style none
      display flex
      align-items center
      margin 0 10px

      label
        margin-left 5px
        margin-right 10px

    .filter
      text-align left
      flex-direction column
      align-items flex-start

      li label
        display inline-block
        width 150px

    select
      margin 5px
      border-color black

.repository-list
  list-style none

.list-enter-active, .list-leave-active
  transition all 1000ms

.list-enter, .list-leave-to
  opacity 0
  transform translateY(30px)

@media screen and (min-width: 801px)
  main
    width 60%
    margin 0 auto
</style>
