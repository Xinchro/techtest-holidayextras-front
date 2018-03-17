import template from "./template.html"

export default Vue.component("tagsPage", {
  template: template,
  data() {
    return {
      flickrApiUrl: "http://api.flickr.com/services/rest/",
      flickrJSON: { items: [] },
      search: "",
      busy: false,
      displayJSON: { items: [] },
      lastImageIndex: 0,
      currentPage: 1
    }
  },
  beforeCreate: function () {
    this.$nextTick(function () {
      this.start()
    })
  },
  methods: {
    start() {
      this.search = "cat"
      this.getPhotosByTags(this.search)
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
        .catch(function(err) {
          console.error('parsing failed', ex)
        })
    },

    getPhotoURL(photoID, ownerID) {
      return `https://www.flickr.com/${ownerID}/${photoID}`
    },

    getPhotosByTags(tags) {
      let photos = []

      tags = tags.replace(/\ /g, ",")

      const method = "flickr.photos.search"

      const extras = "date_taken,description,owner_name,tags,url_m"

      const format = "format=json"

      const page = `page=${this.currentPage}`

      const queries = `method=${method}&api_key=${window.flickrTokens.Key}&tags=${tags}&extras=${extras}&${page}`

      const request = `${this.flickrApiUrl}?${queries}&${format}`

      this.getFlickrJSON(request, "jsonFlickrApi")
        .then((response) => {
          let photoArray = response.photos.photo
          photoArray.map((photo) => {
            photo.link = this.getPhotoURL(photo.id, photo.owner)
          })
          this.flickrJSON.items = this.flickrJSON.items.concat(photoArray)
          console.log(JSON.stringify(this.flickrJSON.items[0]))
        })
    },

    loadMore() {
      this.busy = true;
      let pageLimit = this.currentPage * 100 // flickr sends 100 per page

      setTimeout(() => {
        if(this.lastImageIndex+10 < this.flickrJSON.items.length) {
          for(let i=this.lastImageIndex; i<this.lastImageIndex+10; i++) {
            this.displayJSON.items.push(this.flickrJSON.items[i])
          }
          this.lastImageIndex += 10
        } else
        if(this.lastImageIndex === this.flickrJSON.items.length) {
          // limit reached, next page please
          this.currentPage++
          this.getPhotosByTags(this.search)
        } else {
          for(let i=this.lastImageIndex; i<this.flickrJSON.items.length; i++) {
            this.displayJSON.items.push(this.flickrJSON.items[i])
          }
          this.lastImageIndex = this.flickrJSON.items.length
        }

        this.busy = false
      }, 1000)
    }
  }
})

Vue.use(infiniteScroll)
