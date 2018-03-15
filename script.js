let app = new Vue({
  el: "#vue-app",
  data: {
    flickrUrl: "https://api.flickr.com/services/feeds/photos_public.gne?format=json",
    flickrJSON: {}
  },
  beforeCreate: function () {
    this.$nextTick(function () {
      this.start()
    })
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

      let dateString = ""

      dateString = dateString.concat(date.getFullYear())

      dateString = dateString.concat(", ")
      dateString = dateString.concat(MONTH_NAMES[date.getMonth()])

      dateString = dateString.concat(", ")
      dateString = dateString.concat(this.padTens(date.getDate()))

      dateString = dateString.concat(" at ")
      dateString = dateString.concat(this.padTens(date.getHours()))

      dateString = dateString.concat(":")
      dateString = dateString.concat(this.padTens(date.getMinutes()))

      dateString = dateString.concat(":")
      dateString = dateString.concat(this.padTens(date.getSeconds()))

      return dateString
    },

    getDescription(descriptionString) {
      let template = document.createElement("div")

      template.innerHTML = descriptionString

      if(template.children[2]) {
        return template.children[2].innerText
      }

      return "No description"
    },

    padTens(number) {
      return number > 10 ? number : `0${number}`
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
