import page from './page'
import barMenu from './bar-menu'

export default {
    install: function (Vue) {
        Vue.component('my-page', page)
        Vue.component('bar-menu', barMenu)
    }
}
