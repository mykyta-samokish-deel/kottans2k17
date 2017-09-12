<template lang='pug'>
  li.repository-item(@click='emitData()')
    header.item--header
      svg.item--type(height="16" viewBox="0 0 12 16" width="12")
        path(fill-rule="evenodd" :d='svgPath(rep)')
      span.item--name {{ rep.name }}
    p.item--description {{ rep.description ? rep.description : 'No description added.' }}
    .item--meta
      .icons
        .star
          svg(height="16" viewBox="0 0 14 16" width="14")
            path(fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z")
          span {{ rep.stargazers_count }}
        .language(v-show='rep.language')
          span.icon(:style="{ 'background-color': rep.language ? `#${hashCode(rep.language).toString(16).substr(1, 6).padStart(6, 'b')}` : 'none' }")
          span.item--language {{ rep.language }}
      span.item--updated-at
        | last updated
        time(:datetime='rep.updated_at')  {{ formattedTime }}
</template>

<script>
import timeago from 'timeago.js'
import bus from '@/bus'

export default {
  name: 'repository-item',
  props: ['rep'],
  methods: {
    svgPath (item) {
      return item.fork
        ? 'M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z'
        : 'M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z'
    },
    hashCode (str) {
      return str.split('').reduce((prevHash, currVal) =>
        ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0)
    },
    emitData () {
      bus.$emit('triggerModal', {
        fullName: this.rep.full_name
      })
    }
  },
  computed: {
    formattedTime () {
      return timeago().format(this.rep.updated_at)
    }
  }
}
</script>

<style lang='styl'>
item_name = #676767

.repository-item
  cursor pointer
  display flex
  flex-direction column
  justify-content flex-start
  align-items flex-start
  margin 5px
  border 1px solid black

  .item--header
    display flex
    align-items center
    width 100%
    background-color inherit
    border-bottom 1px solid #ededed
    font-size 16px
    padding 1em

    .item--type
      margin-right 1em

    .item--name
      padding-left 0
      text-align left
      font-size inherit
      color item_name

  .item--description
    color darken(item_name, 20%)
    text-align left
    padding 10px

  .item--meta
    display flex
    align-items center
    width calc(100% - 20px)
    margin 10px
    margin-top 0

    .icons
      display flex
      flex 1

      .star, .language
        display flex
        align-items center

      .star
        max-width 120px
        min-width 40px
        margin-right 20px

        span
          font-size 16px
          margin-left .25em

      .language
        .item--language
          font-size 12px

        .icon
          width 16px
          height 16px
          border-radius 50%
          margin-right 4px

    .item--updated-at
      margin-left 1em
      font-size 12px
</style>
