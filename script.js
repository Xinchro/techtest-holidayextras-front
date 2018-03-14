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
        })
    },

    formatTags(tagString) {
      if(tagString) return tagString.split(" ")

      return []
    },

    formatAuthor(authorString) {
      if(authorString) return authorString.split("\"")[1]

      return "Author"
    },

    formatDate(isoDate) {
      const date = new Date(isoDate)
      const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]

      return `${date.getFullYear()}, ${MONTH_NAMES[date.getMonth()]}, ${date.getDate()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    },

    titleExists(title) {
      if(title.length > 1) return title
      return "No Title"
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
