<template>
<div  class="bg">
    <div id="userlogon">
        <div style="width: 350px;margin-bottom:10px" class="txt">景点管理系统</div>
<el-row>
  <el-button type="primary" plain @click="showdiv1">游客</el-button>
  <el-button type="primary" plain @click="showdiv2">管理员</el-button>
</el-row>

    <div v-if="flag===0">
        <div class="login">游客登录</div>
      <el-form
        :model="user"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="touristsName">
          <el-input
            autocomplete="off"
            prefix-icon="el-icon-user-solid"
            placeholder="游客账号"
            v-model="user.touristsName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            show-password
            placeholder="密码"
            v-model="user.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            style="width: 100%"
            v-loading.fullscreen.lock="$store.state.fullscreenLoading"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div v-if="flag===1" style="width: 350px;">
        <div class="login" style="width: 350px;">管理员登录</div>
      <el-form
        :model="admin"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="administratorsName">
          <el-input
            autocomplete="off"
            prefix-icon="el-icon-user-solid"
            placeholder="管理员账号"
            v-model="admin.administratorsName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            show-password
            placeholder="密码"
            v-model="admin.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            style="width: 100%"
            v-loading.fullscreen.lock="$store.state.fullscreenLoading"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    </div>
</div>
</template>
// scoped代表样式只针对本vue文件内的DOM生效
<style lang="scss" scoped>
#userlogon {
  opacity: 0.8;
  border: 1px solid  #ccc;
  border-radius: 5px; // 圆角
  padding: 20px; // 内间距
  width: 350px;
  margin: 80px auto; // 上下外间距100，左右居中
}
.txt {
  text-align: center;
  font-family: '微软雅黑';
  font-size: 16px;
  color: rgb(46, 43, 43);
}
.bg{
background:url("../../assets/login.jpg");
width:100%;
height:100%;
position:fixed;
background-size:100% 100%;
}
</style>

<script>
export default {
  data () {
    const validateUsername = (rule, value, callback) => {
      const reg = /^[a-zA-Z]\w{6,9}$/
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (!reg.test(value)) {
        callback(
          new Error('账户包含字母下划线和数字，且必须以字母开头，长度6-10位')
        )
      } else {
        callback()
      }
    }
    const validateAdminname = (rule, value, callback) => {
      const reg = /^[a-zA-Z]\w{4,6}$/
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (!reg.test(value)) {
        callback(
          new Error('账户包含字母下划线和数字，且必须以字母开头，长度4-6位')
        )
      } else {
        callback()
      }
    }
    return {
      user: {
        touristsName: null,
        password: null
      },
      admin: {
        administratorsName: null,
        password: null
      },
      flag: 0,
      rules: {
        touristsName: [
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        adminname: [
          { validator: validateAdminname, trigger: ['blur', 'change'] }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            required: true,
            min: 6,
            max: 10,
            message: '密码长度在 6 到 10 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    showdiv1 () {
      this.flag = 0
    },
    showdiv2 () {
      this.flag = 1
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 请求后端，添加数据
          if (this.flag === 0) {
            this.url = '/auth/userlogin'
            this.obj = this.user
          } else {
            this.url = '/auth/adminlogin'
            this.obj = this.admin
          }
          const url = this.url
          const obj = this.obj
          console.log(this.obj)
          // 开启遮罩
          this.$store.commit('updateFullscreenLoading', true)
          this.$axios.post(url, obj).then(({ data: res }) => {
            // 登录的响应完了就关闭遮罩
            this.$store.commit('updateFullscreenLoading', false)
            // 代表登录成功
            if (res.code === 2001) {
              // 记录登录用户信息
              res.data.avatar = this.$store.state.serverPath + res.data.avatar
              this.$store.commit('updateUser', res.data)
              this.$message({
                message: '登录成功',
                type: 'success',
                center: true,
                onClose: (r) => {
                // 跳转到主界面
                  if (this.flag === 0) {
                    sessionStorage.setItem(this.$store.state.loginUser, JSON.stringify(res.data))
                    this.$router.push('/index')
                  } else {
                    sessionStorage.setItem(this.$store.state.loginAdmin, JSON.stringify(res.data))
                    this.$router.push('/tour/adminIndex')
                  }
                  this.$store.commit('updateFullscreenLoading', false)
                  console.log(res.data.token)
                }
              })
            } else {
              this.$store.commit('updateFullscreenLoading', false)
            }
          })
        }
      })
    }
  }
}
</script>
