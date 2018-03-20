<template>
  <section id="vue-main-page">
    <navbar></navbar>
    <ul class="row">
      <li v-for="item in flickrJSON.items" class="col s12 m6 l4 xl3">
        <section class="card sticky-action large">
          <section class="card-image waves-effect waves-block waves-light">
            <img class="activator" :src="item.media.m" :alt="item.title">
          </section>
          <section class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              <a :href="item.link" v-bind:title=titleExists(item.title)>{{titleExists(item.title)}}</a>
              <i class="material-icons right">more_vert</i>
            </span>
            <p>By:&nbsp;<a :href="`https://www.flickr.com/photos/${item.author_id}`" v-bind:title=formatAuthor(item.author)>{{formatAuthor(item.author)}}</a></p>
          </section>
          <section class="card-action" v-if="formatTags(item.tags).length>0">
            <span>Tags&nbsp;</span>
            <ul class="tag-list">
              <li v-for="tag in formatTags(item.tags)" class="chip">
                <a :href="`https://www.flickr.com/photos/tags/${tag}`" v-bind:title=tag>&#35;{{tag}}</a>
              </li>
            </ul>
          </section>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              <a :href="item.link" v-bind:title=titleExists(item.title)>{{titleExists(item.title)}}</a>
              <i class="material-icons right">close</i></span>
            <p>{{getDescription(item.description)}}</p>
            <p>Date taken: {{formatDate(item.date_taken)}}</p>
          </div>
        </section>
      </li>
    </ul>
  </section>
</template>

<script>
  import Vue from "vue"

  export default {
    name: "mainPage",
    data() {
      return {
        flickrFeedUrl: "https://api.flickr.com/services/feeds/photos_public.gne?format=json",
        flickrJSON: { items: [] }
      }
    },
    beforeCreate: function () {
      this.$nextTick(function () {
        this.start()
      })
    },
    methods: {
      start() {
        this.getFlickrJSON(this.flickrFeedUrl, "jsonFlickrFeed")
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

      getFlickrJSON() {
        return fetchJSONP(this.flickrFeedUrl, "jsonFlickrFeed")
          .then(function(response) {
            return response.json()
          })
          .catch(function(ex) {
            console.log('parsing failed', ex)
          })
      }
    }
  }
</script>

<style>

</style>
