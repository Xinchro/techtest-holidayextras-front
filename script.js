let app = new Vue({
  el: '#vue-app',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    start: function () {
      console.log("Vue running!")
    }
  }
})

// launch app
app.start()
