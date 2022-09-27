<template>
    <div>
<el-card class="box-card">
  <div>
   <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="原密码" prop="pass">
    <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="newPass">
    <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkNewPassword" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
  </div>
</el-card>
    </div>
</template>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 500px;
    height: 350px;
  }
</style>
<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    const newvalidatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkNewPassword !== '') {
          this.$refs.ruleForm.validateField('checkNewPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      //   user: JSON.parse(sessionStorage.getItem(this.$store.state.loginUser)),
      ruleForm: {
        oldPassword: null,
        newPassword: null,
        checkNewPassword: null,
        username: this.$store.state.user.touristsName,
        power: this.$store.state.user.power
      },
      rules: {
        oldPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: newvalidatePass, trigger: 'blur' }
        ],
        checkNewPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 请求后端，添加数据
          this.$axios.put('/user/revise', this.ruleForm)
            .then(({ data: res }) => {
              console.log(res)
              if (res.code === 2001) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  center: true,
                  onClose: (r) => {
                    this.$router.push('/user/userlogin')
                  }
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
