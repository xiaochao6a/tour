<template>
    <div>
        <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>个人信息</span>
    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
  </div>
  <div class="listinfo">
    <div>游客名：{{user.touristsName}}</div>
    <div>性别：
      <el-tag type="success" v-if="user.gender===2">保密</el-tag>
      <el-tag v-if="user.gender===1">男</el-tag>
      <el-tag type="danger" v-if="user.gender===0">女</el-tag>
    </div>
    <div>生日：{{user.birthday}}</div>
    <div>电话：{{user.telephone}}</div>
  </div>
</el-card>
    </div>

</template>
<script>
export default {
  data () {
    return {
      user: {
        touristsName: this.$store.state.user.touristsName,
        gender: this.$store.state.user.gender,
        birthday: this.$store.state.user.birthday,
        telephone: this.$store.state.user.telephone
      }
      //   user: JSON.parse(sessionStorage.getItem(this.$store.state.loginUser))
    }
  }
}
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 600px;
    height: 400px;
  }
</style>
