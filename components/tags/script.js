import template from "./template.html"

export default Vue.component("tagsPage", {
  template: template,
  data() {
    return {
      flickrApiUrl: "http://api.flickr.com/services/rest/",
      flickrJSON: {}
    }
  },
  beforeCreate: function () {
    this.$nextTick(function () {
      this.start()
    })
  },
  methods: {
    start() {
      this.getPhotosByTag("cat")
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
      return number >= 10 ? number : `0${number}`
    },

    titleExists(title) {
      if(title.length > 1) return title
      return "No Title"
    },

    getFlickrJSON(url, callback) {
      return fetchJSONP(url, callback)
        .then(function(response) {
          return response.json()
        })
        .catch(function(ex) {
          console.log('parsing failed', ex)
        })
    },

    getPhotosByTag(tag) {
      return new Promise((res, rej) => {
        let photos = []

        const method = "flickr.photos.search"

        const extras = "date_taken,description,owner_name,tags,url_m"

        const format = "format=json"

        const queries = `method=${method}&api_key=${window.flickrTokens.Key}&tags=${tag}&extras=${extras}`

        const request = `${this.flickrApiUrl}?${queries}&${format}`


        this.getFlickrJSON(request, "jsonFlickrApi")
          .then((response) => {
            res({
              items: response.photos.photo
            })
          })
      })
    }
  }
})
