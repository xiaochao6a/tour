<template>
   <div class="bg">
    <div id="register-app">
    <div>欢迎注册</div>
    <div>
    <el-form :model="user" :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-form-item prop="touristsName">
    <el-input prefix-icon="el-icon-user-solid" placeholder="账号"  v-model="user.touristsName"></el-input>
    </el-form-item>
     <el-form-item prop="password">
    <el-input prefix-icon="el-icon-lock" show-password placeholder="密码"  v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item prop="telephone">
    <el-input prefix-icon="el-icon-phone" placeholder="电话号码"  v-model="user.telephone"></el-input>
     </el-form-item>
      <el-form-item prop="birthday">
    <el-date-picker
      type="date"
      placeholder="选择生日"
    v-model="user.birthday"
    style="width: 100%"
    ></el-date-picker>
      </el-form-item>
    <div style="text-align: center">
      <el-form-item prop="gender">
      <el-radio v-model="user.gender" label="2" size="mini" border>保密</el-radio>
      <el-radio v-model="user.gender" label="1" size="mini" border>男</el-radio>
      <el-radio v-model="user.gender" label="0" size="mini" border>女</el-radio>
      </el-form-item>
    </div>
  <!-- <el-form-item label="爱好" prop="favorite">
    <el-checkbox-group v-model="user.favorite">
      <el-checkbox label="1" name="favorite">美食</el-checkbox>
      <el-checkbox label="2" name="favorite">音乐</el-checkbox>
      <el-checkbox label="3" name="favorite">看书</el-checkbox>
      <el-checkbox label="4" name="favorite">打球</el-checkbox>
    </el-checkbox-group>
  </el-form-item> -->

  <el-form-item label="是否同意本站协议" required>
     <el-switch v-model="agree"></el-switch>
  </el-form-item>

  <el-form-item>
     <el-button :disabled="!agree"
     type="primary"
     plain style="width:100%"
     v-loading.fullscreen.lock='$store.state.fullscreenLoading'
     @click="submitForm('ruleForm')">注册</el-button>
  </el-form-item>
</el-form>
    </div>
    </div>
    </div>
</template>
<style lang="scss" scoped>

#register-app{
    opacity: 0.8;
    border:1px solid rgb(238, 187, 242);
    background-color: rgb(225, 185, 142);
    border-radius: 6px;
    padding: 20px;
    width: 350px;
    margin: 60px auto;
}
.bg{
  background:url("../../assets/register.png");
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
        callback(new Error('账号包含字母下划线和数字,且必须以字母开头,长度6-10位'))
      } else {
        callback()
      }
    }
    const validateTelephone = (rule, value, callback) => {
      const reg = /^1(3|9|5|7|8)\d{9}$/
      if (value === '') {
        callback(new Error('请输入号码'))
      } else if (!reg.test(value)) {
        callback(new Error('电话号码以1开头，长度11位'))
      } else {
        callback()
      }
    }
    return {
      agree: false,
      user: {
        touristsName: '',
        password: '',
        telephone: '',
        birthday: '',
        gender: '2'
      },
      rules: {
        touristsName: [
          { validator: validateUsername, trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          { required: true, min: 6, max: 10, message: '密码长度在 6 到 10 个字符', trigger: 'change' }
        ],
        telephone: [
          { validator: validateTelephone, trigger: ['change', 'blur'] },
          { required: true, min: 11, max: 11, message: '电话号码长度要11位', trigger: 'change' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择日期', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 请求后端，添加数据
          const url = '/auth/register'
          this.$store.commit('updateFullscreenLoading', true)
          this.$axios.post(url, this.user).then(({ data: res }) => {
            if (res.code === 2001) {
              this.$message({
                message: '注册成功',
                type: 'success',
                center: true,
                onClose: (r) => {
                // 跳转到登录界面
                  this.$store.commit('updateFullscreenLoading', false)
                  this.$router.push('/user/userlogin')
                }
              })
            } else {
              this.$message.error('用户名已经存在，请更换')
              this.$store.commit('updateFullscreenLoading', false)
            }
          })
        }
      })
    }
  }
}
</script>
