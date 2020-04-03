<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <router-link v-else :to="item.redirect||item.path">{{ item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      console.log('$route')
      this.getBreadcrumb()
    }
  },
  created() {
    console.log('created')
    this.getBreadcrumb()
  },
  methods: {
    // generateTitle,
    getBreadcrumb() {
      const matched = this.$route.matched.filter(item => item.name)
      // const first = matched[0]
      // if (first && first.name.trim().toLocaleLowerCase() !== 'User'.toLocaleLowerCase()) {
      // matched = [{ path: '/user', meta: { title: 'user' }}].concat(matched)
      // }
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
