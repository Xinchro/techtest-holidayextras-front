<template>
  <section id="vue-main-page">
    <navbar></navbar>
    <form v-on:submit.prevent="getPhotosByTags(search)" class="row">
      <section class="input-field col s12 m9">
        <label>Search</label>
        <input id="search" type="search" placeholder="Search" v-model="search">
        <i class="material-icons">close</i>
      </section>
      <section class="col s12 m3">
        <label>Sort</label>
        <select class="browser-default" v-model="sort">
          <option value="11">Date Taken - Asc</option>
          <option value="12">Date Taken - Desc</option>
          <option value="21">Date Posted - Asc</option>
          <option value="22" selected>Date Posted - Desc</option>
          <option value="31">Interest - Asc</option>
          <option value="32">Interest - Desc</option>
          <option value="4">Relevance</option>
        </select>
      </section>
    </form>
    <ul class="row">
      <li v-for="item in displayJSON.items" class="col s12 m4 l3 xl2">
        <section class="card sticky-action small">
          <section class="card-image waves-effect waves-block waves-light">
            <img class="activator" :src="item.url_m" :alt="item.title">
          </section>
          <section class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              <a :href="item.link" v-bind:title=titleExists(item.title)>{{titleExists(item.title)}}</a>
              <i class="material-icons right">more_vert</i>
            </span>
            <p>By:&nbsp;<a :href="`https://www.flickr.com/photos/${item.owner}`" v-bind:title="item.ownername">{{item.ownername}}</a></p>
          </section>
          <section class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              <a :href="item.link" v-bind:title=titleExists(item.title)>{{titleExists(item.title)}}</a>
              <i class="material-icons right">close</i></span>
            <p>{{getDescription(item.description)}}</p>
            <p>Date taken: {{formatDate(item.datetaken)}}</p>
            <section v-if="formatTags(item.tags).length>0">
              <span>Tags&nbsp;</span>
              <ul class="tag-list">
                <li v-for="tag in formatTags(item.tags)" class="chip">
                  <a :href="`https://www.flickr.com/photos/tags/${tag}`" v-bind:title=tag>&#35;{{tag}}</a>
                </li>
              </ul>
            </section>
          </section>
        </section>
      </li>
      <li class="col s12 m4 l3 xl2">
        <section class="card small valign-wrapper">
          <section class="card-image row">
            <section class="preloader-wrapper big active">
              <section class="spinner-layer spinner-blue-only">
                <section class="circle-clipper left">
                  <section class="circle"></section>
                </section><section class="gap-patch">
                  <section class="circle"></section>
                </section><section class="circle-clipper right">
                  <section class="circle"></section>
                </section>
              </section>
            </section>
            <section v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            </section>
          </section>
        </section>
      </li>
    </ul>
  </section>
</template>

<script>
  import Vue from "vue"
  import infiniteScroll from "vue-infinite-scroll"

  export default {
    name: "tagsPage",
    data() {
      return {
        flickrApiUrl: "https://api.flickr.com/services/rest/",
        flickrJSON: { items: [] },
        search: "",
        busy: false,
        displayJSON: { items: [] },
        lastImageIndex: 0,
        currentPage: 1,
        sort: 22
      }
    },
    beforeCreate: function() {
      this.$nextTick(function() {
        // an initial search
        this.start()
      })
    },
    watch: {
      sort: function(value) {
        this.refreshPhotosWithSort(value)
      }
    },
    methods: {
      /*
        Initiates a default search when the page loads
      */
      start() {
        // initial (default) search
        this.search = "cat"
        this.getPhotosByTags(this.search)
      },

      /*
        Checks which sorting method we want to use and refreshes our photo array

        @params string - string of a number
      */
      refreshPhotosWithSort(value) {
        // try to parse value, print an error if it fails
        try {
          value = parseInt(value)
        } catch(err) {
          console.error(err)
          console.error("Failed to parse sorting int")
        }
        // switch to decide what sort we're using, logs error if value doesn't match
        switch(value) {
          case 11:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "date-posted-asc")
            break
          case 12:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "date-posted-desc")
            break
          case 21:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "date-taken-asc")
            break
          case 22:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "date-taken-desc")
            break
          case 31:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "interestingness-asc")
            break
          case 32:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "interestingness-desc")
            break
          case 4:
            this.flickrJSON.items = []
            this.displayJSON = { items: [] }
            this.getPhotosByTags(this.search, "relevance")
            break
          default:
            console.error("Invalid sort value")
        }
      },

      /*
        Turns a string of space-divided tags into an array
        @params string - space separated tags
        @returns array - empty or array of tags
      */
      formatTags(tagString) {
        if(tagString) return tagString.split(" ")

        return []
      },

      /*
        Formats a string as "DD MMMM YYYY, hh:mm:ss"
        @params number - epoch time
        @returns string - formatted datetime
      */
      formatDate(isoDate) {
        const date = new Date(isoDate)
        const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ]

        // do the formatting properly
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

      /*
        Gets the description string from the description object

        @params object - the object with the description text in it
        @returns string - a description
      */
      getDescription(description) {
        // create a temporary element
        let section = document.createElement("section")
        // set the html in our temp element
        section.innerHTML = description._content || "No content"

        // return the text(only) from our temp element
        return section.textContent || section.innerText || ""
      },

      /*
        Pads single digit numbers with a zero

        @params number
        @returns number
      */
      padTens(number) {
        return number >= 10 ? number : `0${number}`
      },

      /*
        Makes sure there's a title

        @params string
        @returns string
      */
      titleExists(title) {
        if(title.length > 1) return title
        // if no title, return a stock string
        return "No Title"
      },

      /*
        Fetch JSON data from the flickr API

        @params string - api endpoint url
        @params string - callback name
        @returns Promise - resolves with data
      */
      getFlickrJSON(url, callback) {
        return fetchJSONP(url, callback)
          .then(function(response) {
            // return promise with json in it
            return response.json()
          })
          .catch(function(err) {
            console.error('parsing failed', ex)
          })
      },

      /*
        Creates a url to a photo's page based on the photo's and owner's ids

        @params string - photo id
        @params string - owner id
        @returns string - photo page url
      */
      getPhotoURL(photoID, ownerID) {
        return `https://www.flickr.com/${ownerID}/${photoID}`
      },

      /*
        Get a page(up to 100) of photos from flickr, based on the tags, and add it to the photo collection

        @params string - space separated tags
        @params sortType (optional) - flickr api sort string
      */
      getPhotosByTags(tags, sortType) {
        // set the system to busy until we get the new photos
        this.busy = true

        let photos = []

        // turn our tags into an array
        tags = tags.replace(/\ /g, ",")

        // set up our queries
        const method = "flickr.photos.search"
        const extras = "date_taken,description,owner_name,tags,url_m"
        const format = "format=json"
        const page = this.currentPage
        const sort = sortType || ""

        // join all our queries together
        const queries = `method=${method}&api_key=${window.flickrTokens.Key}&tags=${tags}&extras=${extras}&page=${page}&sort=${sort}`

        // setup the request url
        const request = `${this.flickrApiUrl}?${queries}&${format}`

        // get our json with our new url and expected callback function name
        this.getFlickrJSON(request, "jsonFlickrApi")
          .then((response) => {
            let photoArray = response.photos.photo
            // make a new property per photo, for its page url
            photoArray.map((photo) => {
              photo.link = this.getPhotoURL(photo.id, photo.owner)
            })

            // add the new page to the current list
            this.flickrJSON.items = this.flickrJSON.items.concat(photoArray)
            // got our photos, not busy anymore
            this.busy = false
          })
      },

      /*
        Adds 10 images to the displayed photo array, gets a new page once limit(100) is reached
      */
      loadMore() {
        // if we're busy: don't add anything new
        if(!this.busy) {
          // set us as busy
          this.busy = true

          // check to see if our new set of 10 photos will make us go over the total photos we have
          if(this.lastImageIndex+10 < this.flickrJSON.items.length) {
            // loop through and add 10 new photos to display
            for(let i=this.lastImageIndex; i<this.lastImageIndex+10; i++) {
              this.displayJSON.items.push(this.flickrJSON.items[i])
            }
            // increment current index
            this.lastImageIndex += 10
          }
          // if we've reached the end, try get a new page
          else if(this.lastImageIndex === this.flickrJSON.items.length) {
            // limit reached, next page please
            this.currentPage++
            // get photos(in new page)
            this.getPhotosByTags(this.search)
          }
          // if we're going to go over our total
          else {
            // loop until our total and add the remaining pictures
            for(let i=this.lastImageIndex; i<this.flickrJSON.items.length; i++) {
              this.displayJSON.items.push(this.flickrJSON.items[i])
            }
            // current index is set to our limit
            this.lastImageIndex = this.flickrJSON.items.length
          }

          // loaded new images, not busy anymore
          this.busy = false
        }
      }
    }
  }

  Vue.use(infiniteScroll)
</script>

<style>

</style>
