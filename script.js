import Vue from "vue"
import VueRouter from "vue-router"
import navbar from "./components/navbar.vue"
import routes from "./routes.js"

Vue.use(VueRouter)

Vue.component('navbar', navbar)

const router = new VueRouter({
  routes: routes
})

const app = new Vue({
  router
}).$mount("#vue-app")

window.app = app
