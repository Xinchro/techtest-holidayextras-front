<template>
  <nav class="nav-extended">
    <section class="nav-wrapper">
      <span class="brand-logo center">Flickr</span>
    </section>
    <section class="nav-content">
      <ul class="tabs tabs-transparent row">
        <li class="tab col s6"><router-link to="/" exact-active-class="active">Feed</router-link></li>
        <li class="tab col s6"><router-link to="/tags" exact-active-class="active">Tags</router-link></li>
      </ul>
    </section>
  </nav>
</template>

<script>
  import Vue from "vue"

  export default {
    name: "navbar",
    data() {
      return {
      }
    }
  }
</script>

<style>

</style>
