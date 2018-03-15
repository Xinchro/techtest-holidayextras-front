import navbar from "./components/navbar/script.js"
import routes from "./routes.js"

const router = new VueRouter({
  routes: routes
})

const app = new Vue({
  router
}).$mount("#vue-app")
