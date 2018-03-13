let app = new Vue({
  el: "#vue-app",
  data: {
    flickrUrl: "https://api.flickr.com/services/feeds/photos_public.gne?format=json",
    flickrJSON: {}
  },
  methods: {
    start() {
      this.getFlickrJSON()
        .then((response) => {
          this.flickrJSON = response
          console.log(response)
        })
    },
    getFlickrJSON() {
      return fetchJSONP(this.flickrUrl, "jsonFlickrFeed")
        .then(function(response) {
            return response.json()
          })
        .catch(function(ex) {
            console.log('parsing failed', ex)
          })
    }
  }
})

// launch app
app.start()
