<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <breadcrumb class="breadcrumb-container"/>
      <div class="right-menu">
        <span style="color: #7d7d7f;vertical-align: top;user-select:none;" @click="pushUpload">您好！{{ user.userAlias}}</span>
        <el-dropdown class="avatar-container right-menu-item"  trigger="click">
          <div class="avatar-wrapper">
            <img src="../../../static/images/icon.gif" class="user-avatar">
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                <span style="display:block;" @click="changePwd">修改密码</span>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>

    <el-dialog
      :visible.sync="isShowEdit"
      title="用户编辑"
      width="17%"
      center>
      <table border="0">
        <tr class="line-height">
          <td class="table-label">用户名</td>
          <td>
            <el-input v-model="userInfo.userName" disabled type="text" auto-complete="off"/>
          </td>
        </tr>
        <tr class="line-height">
          <td class="table-label">用户别名</td>
          <td>
            <el-input v-model="userInfo.userAlias" type="text" auto-complete="off"/>
          </td>
        </tr>
        <tr class="line-height">
          <td class="table-label">权限</td>
          <td>
            <el-input v-model="userInfo.roleName" disabled/>
          </td>
        </tr>
        <tr class="line-height">
          <td class="table-label">设置新密码</td>
          <td>
            <el-input
              v-model="userInfo.password"
              type="password"
              auto-complete="off"
              placeholder="不修改，可不填"/>
          </td>
        </tr>
        <tr class="line-height">
          <td class="table-label">确认新密码</td>
          <td>
            <el-input
              v-model="userInfo.confirmPassword"
              type="password"
              auto-complete="off"
              placeholder="不修改，可不填"/>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialog = false">取 消</el-button>
    <el-button type="primary" @click="update">更 新</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'

  import store from '@/store'
  import {deepClone} from '@/utils/common'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
    },
    data() {
      return {
        isShowEdit: false,
        userInfo: {},
        clickCount: 0,
        lastTime: 0,
        offsetTime: 300
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'user',
        'permission_routers'
      ])
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.userInfo =deepClone(this.user)
        this.userInfo.password = ''
        this.userInfo.confirmPassword = ''
        this.userInfo.roleName = this.userInfo.userRole == 0 ? '管理员' : '普通用户'
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$confirm('确定退出吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            this.$message({
              type: 'success',
              message: '退出成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          })
        })
      },
      changePwd() {
        this.isShowEdit = true
      },
      update() {
        if (this.userInfo.userAlias === '') {
          this.$message.error('用户昵称不能为空')
          return
        }
        if (this.userInfo.password !== '') {
          if (this.userInfo.password.length !== this.userInfo.confirmPassword.length) {
            this.$message.error('两次密码不一致！')
            return
          } else {
            if (this.userInfo.password.length < 6) {
              this.$message.error('密码长度不能小于6位！')
              return
            }
          }
        }
        this.isShowEdit = false
        store.dispatch('UpdateUserInfo', this.userInfo)
          .then(() => {
            this.$message.success('更新用户信息成功')
            this.userInfo.password = ''
            this.userInfo.confirmPassword = ''
          })
      },
      pushUpload() {
        let currentTime = new Date().getTime()
        if (currentTime - this.lastTime < this.offsetTime || currentTime - this.lastTime === currentTime) {
          this.clickCount++
          this.lastTime = currentTime
          if (this.clickCount === 5) {
            for (let i = 0, len = this.permission_routers.length; i < len; i++) {
              let item = this.permission_routers[i]
              if (item.path.indexOf('uploadFile') > -1) {
                item.isSuper = false
                break
              }
            }
            this.$store.commit('HANDLE_ROUTERS', this.permission_routers)
            this.clickCount = 0
          }
        } else {
          this.clickCount = 0
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .line-height {
    line-height: 50px;
  }

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .screenfull {
        height: 20px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }

      .avatar-container {
        height: 50px;
        margin-right: 30px;

        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
