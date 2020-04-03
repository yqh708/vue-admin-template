<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!--<keep-alive :include="cachedViews">-->
      <keep-alive >
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      let fullPath = this.$route.fullPath;
      return fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  /*min-height: calc(100vh - 84px);*/
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
</style>

