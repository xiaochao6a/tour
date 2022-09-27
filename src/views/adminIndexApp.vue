<template>
<div id="app">
<el-container>
  <el-header>
    <div class="h-img"><img style="width:280px;height:110px" src="@/assets/lvtu.png"></div>
    <div class="welcome">
      <div class="font-c">欢迎:{{this.adminName}}</div>
    <el-dropdown>
    <div>
      <el-avatar :size="80">
        <img src="@/assets/yuanshen.png"/>
      </el-avatar>
    </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item >
          <div><i class="el-icon-s-tools"></i>个人设置</div></el-dropdown-item>
        <el-dropdown-item  @click.native="modifyPassword"><i class="el-icon-warning"></i>修改密码</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout"><i class="el-icon-switch-button"></i>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
  </el-header>
  <el-container>
  <el-aside width="280px">
    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="rgb(222, 222, 222)"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
          >
              <el-menu-item index="/tour/scenic">
                <i class="el-icon-position spanfont"></i>
                <span class="spanfont">景点管理</span>
              </el-menu-item>
              <el-menu-item index="/tour/ticket">
                <i class="el-icon-tickets spanfont"></i>
                <span class="spanfont">门票管理</span>
              </el-menu-item>
              <el-menu-item index="/tour/food">
                <i class="el-icon-food spanfont"></i>
                <span class="spanfont ">美食管理</span>
              </el-menu-item>
              <el-menu-item index="/tour/orders">
                <i class="el-icon-shopping-cart-2 spanfont"></i>
                <span class="spanfont">订单管理</span>
              </el-menu-item>
              <el-menu-item index="/tour/notice">
                <i class="el-icon-bell spanfont"></i>
                <span class="spanfont">公告管理</span>
              </el-menu-item>
              <el-menu-item index="/tour/tourist">
                <i class="el-icon-user spanfont"></i>
                <span class="spanfont">用户管理</span>
              </el-menu-item>
              <el-menu-item :disabled="$store.state.admin.role!=='超级管理员'" index="/tour/admin">
                <i class="el-icon-s-management spanfont"></i>
                <span class="spanfont">管理员管理</span>
              </el-menu-item>
          </el-menu>
  </el-aside>
  <el-main>
    <div class="content"></div>
    <router-view/>
  </el-main>
  </el-container>
</el-container>
<el-dialog
      :close-on-click-modal="false"
      title="修改密码"
      :visible.sync="updateVisible"
      width="600px"
      :before-close="updateHandleClose"
    >
    <el-form
        ref="updateForm"
        :rules="rules"
        :model="updateAdminForm"
        label-width="100px"
        size="mini"
      >
      <el-form-item prop="oldPassword" label="原密码">
          <el-input
            placeholder="请输入原密码"
            v-model="updateAdminForm.oldPassword"
          ></el-input>
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
          <el-input
            placeholder="请输入新密码"
            v-model="updateAdminForm.newPassword"
          ></el-input>
      </el-form-item>
      <el-form-item prop="checkNewPassword" label="确认新密码">
          <el-input
            placeholder="请确认新密码"
            v-model="updateAdminForm.checkNewPassword"
          ></el-input>
      </el-form-item>
      <el-form-item size="large">
          <el-button type="primary" size="medium" @click="update"
            >修改密码</el-button
          >
          <el-button size="medium" @click="cancelUpdate">取消</el-button>
        </el-form-item>
    </el-form>
    </el-dialog>
</div>
</template>
<style lang="css" scoped>
.welcome {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-container {
  height: 100vh;
  width: 100vw;
}
.el-header {
    height: 110px !important;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

}
.h-img{
  margin-left: -20px;
  margin-bottom: -2px;
}
.font-c{
  font-size: 21px;
  color: black;
}
.el-main {
  background-color: rgb(238, 233, 233);
}
.el-aside {
background-color: rgb(222, 222, 222);
}
.el-menu-item {
  height: 80px;
}
.spanfont {
  font-size: 24px;
  color: rgb(10, 190, 245);
  font-weight: 500;
}
#app {
  overflow: hidden;
}
</style>
<script>
export default {
  data () {
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const validateCheckNewPass = (rule, value, callback) => {
      if (value === this.updateAdminForm.newPassword) {
        callback()
      } else if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else {
        callback(new Error('两次密码不一致'))
      }
    }
    return {
      adminName: this.$store.state.admin.administratorsName,
      updateVisible: false,
      updateAdminForm: {
        oldPassword: null,
        newPassword: null, // 修改后密码
        checkNewPassword: null,
        username: this.$store.state.admin.administratorsName, // 用户名
        power: this.$store.state.admin.power // 权限
      },
      rules: {
        newPassword: [
          { required: true, validator: validateNewPass, trigger: 'blur' }
        ],
        checkNewPassword: [
          { required: true, validator: validateCheckNewPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    logout () {
      sessionStorage.removeItem(this.$store.state.loginAdmin)
      this.$router.push('/user/userlogin')
    },
    modifyPassword () {
      this.updateVisible = true
    },
    update () {
      /** 修改密码 */
      console.log(this.$store.state.loginAdmin)
      this.$axios
        .put('/user/revise', this.updateAdminForm)
        .then(({ data: res }) => {
          if (res.code === 2001) {
            this.cancelUpdate() // 关闭窗口
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              showClose: true,
              center: true
            })
          }
        })
    },
    /** 取消添加方法 */
    cancelUpdate () {
      this.updateVisible = false
    },
    // 关闭修改窗口的函数
    updateHandleClose (done) {
      this.cancelUpdate()
      done()
    }
  }
}
</script>
