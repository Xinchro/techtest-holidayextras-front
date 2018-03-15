import mainPage from "./components/main/script.js"
import tagsPage from "./components/tags/script.js"

export default [
  {
    path: '/',
    component: mainPage
  },
  {
    path: '/tags',
    component: tagsPage
  }
]
