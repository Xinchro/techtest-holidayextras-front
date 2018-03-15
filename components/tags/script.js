import template from "./template.html"

export default Vue.component("tagsPage", {
  template: template,
  data() {
    return {
      flickrUrl: "https://api.flickr.com/services/feeds/photos_public.gne?format=json",
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
      this.getFlickrJSON()
        .then((response) => {
          this.flickrJSON = response
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
