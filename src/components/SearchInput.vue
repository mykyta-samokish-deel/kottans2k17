<template lang='pug'>
  .search-form
    input.input-field(
      type='text'
      v-model='inputText'
      autocomplete='nope'
      placeholder='Input user or organization'
      @keyup.13='submit'
    )
    button.submit-button(@click='submit') Search
</template>

<script>
export default {
  name: 'search-input',
  data () {
    return {
      inputText: ''
    }
  },
  methods: {
    submit () {
      this.$router.push(this.inputText.toLowerCase())
    }
  }
}
</script>

<style lang='styl' scoped>
.search-form
  display flex
  align-items center
  justify-content center
  width inherit
  margin 0 auto
  padding 10px
  font-size 24px

  .input-field
    border-width 0
    width 100%
    padding .5em
    border-radius .5em
    font-size inherit
    background-color #ededed

    &::placeholder
      color darken(#ededed, 40%)

  .submit-button
    border-width 0
    background-color #3F51B5
    color white
    padding .5em
    font-size inherit
    border-radius .5em
    margin-left .4em
    cursor pointer

@media screen and (min-width: 800px)
  .search-form
    width 60%
    flex-direction row

@media screen and (max-width: 800px)
  .search-form
    flex-direction column
    font-size 16px

    .input-field
      flex 1

    .submit-button
      width 50%
      padding 16px
      margin 10px
</style>
