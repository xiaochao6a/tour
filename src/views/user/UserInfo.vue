<template>
  <div class="personalCenter">
    <el-container>
      <el-header><a href="/index" id="to">首页</a>>个人中心</el-header>
      <el-container>
        <el-aside width="320px">
          <div style="height:300px">
          <el-col :span="14">
              <div class="img">
                <el-tooltip
                    effect="light"
                    content="点击修改头像"
                    style="border: none"
                    placement="right">
                <el-avatar
                  :size="100"
                  :src="user.avatar"
                   @click.native="openDialog"
                   @mouseleave.native="untip"
                   @mouseenter.native="tip">
                   <img src='https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'/>
                   </el-avatar>
                </el-tooltip>
              </div>
              <div class="block">
               {{user.touristsName}}
              </div>
          </el-col>
          </div>
           <div class="info-title"><i class="el-icon-user-solid"></i>用户管理</div>
          <div class="info-menu">
                <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#D3DCE6"
            text-color="black"
            active-text-color="#ffd04b"
            :router="true"
          >
              <el-menu-item index="/spaceinfo">
                <i class="el-icon-user-solid"></i>
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item index="/changepassword">
                <i class="el-icon-s-order"></i>
                <span>修改密码</span>
              </el-menu-item>
          </el-menu>
          </div>
        </el-aside>
          <el-main>
            <!-- 头像上传窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      title="更改头像"
      :visible.sync="updateAvatarVisible"
      width="420px"
      :before-close="handleClose"
    >
      <span class="global" style="width: 250px">
        <img v-if="imageUrl" :src="imageUrl" class="avatar upload-size" />
        <img
          class="avatar upload-size"
          v-else
          src='https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'/>
        <el-upload
          ref="upload"
          name="file"
          class="avatar-uploader"
          :action="$store.state.serverPath + '/user/upload/'+this.touristsName"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="preview"
          :on-success="handleAvatarSuccess">
          <el-button plain size="mini" style="width: 100px">选择图片</el-button>
        </el-upload>
      </span>
      <div style="font-size: 12px; color: #999; margin-top: 20px">
        仅支持5M以内的jpg/ jpeg/ png/ gif 文件
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="upload()">确 定</el-button>
      </span>
    </el-dialog>
                <router-view/>
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>
<style>
.upload-size {
  width: 100px;
  max-height: 100px;
}
</style>
<script>
export default {
  created () {
    this.$store.state.user.avatar = this.$store.state.serverPath + this.$store.state.user.avatar
  },
  data () {
    return {
      touristsName: this.$store.state.user.touristsName,
      user: JSON.parse(sessionStorage.getItem(this.$store.state.loginUser)),
      imageUrl: JSON.parse(sessionStorage.getItem(this.$store.state.loginUser)).avatar,
      updateAvatarVisible: false

      // headers: {
      //   Authorization: JSON.parse(
      //     sessionStorage.getItem(this.$store.state.loginUser)
      //   ).token
      // }
      //   user: JSON.parse(sessionStorage.getItem(this.$store.state.loginUser)),

    }
  },
  methods: {
    // 鼠标移上
    tip () {
      this.user.avatar =
        'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
    },
    // 鼠标移出
    untip () {
      const user = JSON.parse(
        sessionStorage.getItem(this.$store.state.loginUser)
      )
      this.user.avatar = user.avatar
    },
    // 取消操作
    closeDialog () {
      this.updateAvatarVisible = false
      setTimeout(() => {
        this.imageUrl = JSON.parse(
          sessionStorage.getItem(this.$store.state.loginUser)
        ).avatar
      }, 300)
    },
    // 打开窗口
    openDialog () {
      this.updateAvatarVisible = true
    },
    // 关闭窗口
    handleClose (done) {
      // 关闭窗口的时候，重置预览头像变量
      setTimeout(() => {
        this.imageUrl = JSON.parse(
          sessionStorage.getItem(this.$store.state.loginUser)
        ).avatar
      }, 300)
      done()
    },
    // 上传头像
    upload () {
      this.$refs.upload.submit()
      this.updateAvatarVisible = false
    },
    // 上传头像成功
    handleAvatarSuccess (res, file) {
      this.user.avatar = this.$store.state.serverPath + res.data
      sessionStorage.setItem(this.$store.state.loginUser, JSON.stringify(this.user))
      if (res.code === 2001) {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 2000,
          showClose: true,
          center: true
        })
      }
      location.reload()
    },
    preview (file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    }
  }
}
</script>
<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    height: 92vh;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>
