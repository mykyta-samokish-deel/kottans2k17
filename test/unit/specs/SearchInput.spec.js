import Vue from 'vue'
import SearchInput from '@/components/SearchInput'

describe('SearchInput.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(SearchInput)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.search-form button').textContent)
      .to.equal('Search')
  })
})
