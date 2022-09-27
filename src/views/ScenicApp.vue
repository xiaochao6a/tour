<template>
    <div>
        <el-card>
            <!-- 表单查询部分 -->
            <div slot="header" style="height:45px">
                <el-row>
                    <el-col :span="4">
            <el-input style="width:100%" placeholder="景区号" v-model="scenic.scenicId"></el-input>
                    </el-col>
                    <el-col :span="4">
            <el-input style="width:100%" placeholder="景区名称" v-model="scenic.scenicName" />
                    </el-col>
                    <el-col :span="4">
            <el-input style="width:100%" placeholder="所在地点" v-model="scenic.scenicPlace" />
                    </el-col>
                    <el-col :span="4">
            <el-select v-model="scenic.scenicItem" clearable @clear="setValueNull" filterable placeholder="景区主题" >
            <el-option
            v-for="(item,index) in scenicItems" :key="index" :label="item" :value="item">
            </el-option>
            </el-select>
                    </el-col>
                    <el-col :span="1" style="display: flex;justify-content: space-between;align-items: center;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="query"
            ></el-button>
            <el-button
              size="small"
              type="success"
              icon="el-icon-circle-plus-outline"
               @click="initAdd"
            ></el-button>
            <el-button
              size="small"
              type="warnning"
              icon="el-icon-delete"
              @click="batchDelete"
            ></el-button>
            </el-col>
                </el-row>
            </div>
            <!-- 数据部分 -->
             <div class="data">
                <el-table ref="pageTable" @selection-change="getSelectId" :data="tableData"
                style="width: 100%">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column type="index" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="scenicImg" label="景区图" width="150" >
                     <template slot-scope="scope">
                      <el-image class="upload-size" :src= "$store.state.serverPath + scope.row.scenicImage">
                        <img slot="error"  class="upload-size"
                        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      </el-image>
                     </template>
                    </el-table-column>
                    <el-table-column prop="scenicId" label="景区号" width="150">
                      <template slot-scope="scope">
                        <span>{{ scope.row.scenicId}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicName"  label="景区名称" width="150">
                      <template slot-scope="scope">
                        <span>{{ scope.row.scenicName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicPlace" label="所在地点" width="150">
                      <template slot-scope="scope">
                       <span>{{ scope.row.scenicPlace}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicItem" label="景区主题" width="150" type="success" disable-transitions>
                     <template slot-scope="scope">
                       <el-tag type="success" v-if="scope.row.scenicItem==='历史'">{{ scope.row.scenicItem}}</el-tag>
                       <el-tag  v-if="scope.row.scenicItem!=='历史'">{{ scope.row.scenicItem}}</el-tag>
                      </template>
                    </el-table-column>
                     <el-table-column prop="scenicInfo" label="景区信息" width="200">
                      <template slot-scope="scope">
                        <span>{{ scope.row.scenicInfo }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="240">
                      <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="info" @click.native="openDialog(scope.$index, scope.row)">
                            添加图片
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                </el-table>
             </div>
              <!-- 分页插件 -->
             <div class="block" style="text-align: right">
        <el-pagination
            background
            @size-change="loadList"
            @current-change="loadList"
            :current-page.sync="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
             </div>
        </el-card>
  <!-- 图片上传窗口 -->
        <el-dialog
      :close-on-click-modal="false"
      title="上传图片"
      :visible.sync="updateAvatarVisible"
      width="420px"
      :before-close="handleClose"
      >
      <span class="global" style="width: 250px">
        <img v-if="imageUrl" :src="imageUrl" class="avatar upload-size" />
        <img
          class="avatar upload-size"
          v-else
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
        <el-upload
          ref="upload"
          name="file"
          class="avatar-uploader"
          v-model="uploadUrl"
          :data= this.uploadScenic
          :action= this.uploadUrl
          :show-file-list="false"
          :auto-upload="false"
          :on-change="preview"
          :on-success="handleAvatarSuccess">
          <el-button plain size="mini" style="width: 100px;margin:10px" type="success">选择图片</el-button>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="upload()">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 添加窗口 -->
<el-dialog :close-on-click-modal="false" title="添加景区" :visible.sync="addVisible" width="600px"
 :before-close="addHandleClose">
 <el-form ref="addForm" :model="addScenicForm" label-width="80px" size="mini">
        <el-form-item prop="scenicName" label="景区名称">
          <el-input v-model="addScenicForm.scenicName" filterable placeholder="请输入景点名"></el-input>
        </el-form-item>
        <el-form-item prop="scenicPlace" label="所在地点">
          <el-input placeholder="请输入所在地点" v-model="addScenicForm.scenicPlace"></el-input>
        </el-form-item>
        <el-form-item prop="scenicInfo" label="景点信息">
          <el-input placeholder="请输入景点信息" v-model="addScenicForm.scenicInfo"></el-input>
        </el-form-item>
        <el-form-item prop="scenicItem" label="景区主题">
          <el-input placeholder="请输入景点主题" v-model="addScenicForm.scenicItem"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="add">添加景区</el-button>
          <el-button size="medium" @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
</el-dialog>
<!-- 修改窗口 -->
<el-dialog
 :close-on-click-modal="false"
 title="修改景点"
 :visible.sync="updateVisible"
 width="600px"
 :before-close="updateHandleClose">

 <el-form ref="updateForm" :model="updateScenicForm" label-width="80px" size="mini">
        <el-form-item prop="scenicId" label="">
          <input type="hidden" v-model="updateScenicForm.scenicId"/>
        </el-form-item>
        <el-form-item prop="scenicName" label="景点名称">
          <el-input v-model="updateScenicForm.scenicName" placeholder="请选择景点名">
          </el-input>
        </el-form-item>
        <el-form-item prop="scenicPlace" label="所在地点">
          <el-input placeholder="请输入所在地点" v-model="updateScenicForm.scenicPlace"></el-input>
        </el-form-item>
       <el-form-item prop="scenicItem" label="景区主题">
          <el-select v-model="updateScenicForm.scenicItem"  @clear="setValueNull"  filterable placeholder="请选择景区主题">
              <el-option
                v-for="(item,index) in scenicItems" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="scenicInfo" label="景区信息">
          <el-input placeholder="请输入景区信息" :autosize="{ minRows: 5, maxRows: 10}" type="textarea"
          v-model="updateScenicForm.scenicInfo"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="update">修改</el-button>
          <el-button size="medium" @click="cancelUpdate">取消</el-button>
        </el-form-item>
      </el-form>
</el-dialog>
  </div>
</template>
  <style lang="scss" scoped>
.el-col {
  padding: 0 10px;
}
.data{
    height: 60vh;
    overflow-y: auto;
}
.upload-size {
  width: 120px;
  max-height: 80px;
}
</style>
<script>
export default {
  created () {
    this.$axios.get('/scenic/find').then(({ data: res }) => {
      this.scenicItems = res.data
    })
    this.loadList()
  },
  methods: {
    preview (file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    setValueNull () {
      this.scenic.scenicItem = null
    },
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    loadList () {
      this.$axios.get(`/scenic/list/${this.currentPage}/${this.pageSize}`, {
        params: this.scenic
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    getSelectId (selection) {
      this.ids = [] // 清空数组
      for (let i = 0; i < selection.length; i++) {
        this.ids.push(selection[i].scenicId)
      }
    },
    openDialog (index, obj) {
      this.imageUrl = this.$store.state.serverPath + obj.scenicImage
      this.uploadScenic.scenicId = obj.scenicId
      this.updateAvatarVisible = true
      this.uploadUrl = this.$store.state.serverPath + '/scenic/upload'
    },
    // 关闭窗口
    handleClose (done) {
      // 关闭窗口的时候，重置预览头像变量
      setTimeout(() => {
        this.imageUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
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
      if (res.code === 2001) {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          showClose: true,
          center: true
        })
      }
      this.imageUrl = this.$store.state.serverPath + res.data
      location.reload()
    },
    // 取消操作
    closeDialog () {
      this.updateAvatarVisible = false
      setTimeout(() => {
        this.imageUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }, 300)
    },
    // 批量删除
    batchDelete () {
      if (this.ids.length !== 0) {
        this.$axios
          .delete('/scenic/delete', { params: { ids: this.ids } })
          .then(({ data: res }) => {
            if (res.code === 2001) {
              this.loadList() // 重新装载列表
              this.$message({
                message: res.message,
                type: 'success',
                duration: 1500,
                showClose: true,
                center: true
              })
            }
          })
      } else {
        alert('请选择要删除的数据')
      }
    },
    add () {
    /** 添加景点 */
      this.$axios
        .post('/scenic/add', this.addScenicForm)
        .then(({ data: res }) => {
          if (res.code === 2001) {
            this.loadList() // 重新装载列表
            this.cancelAdd() // 关闭窗口
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
    cancelAdd () {
      this.addVisible = false
      this.$refs.addForm.resetFields()
    },
    update () {
    /** 修改景点 */
      this.$axios
        .put('/scenic/update', this.updateScenicForm)
        .then(({ data: res }) => {
          if (res.code === 2001) {
            this.loadList() // 重新装载列表
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
    cancelUpdate () {
      this.updateVisible = false
    },
    // 关闭窗口函数(x)
    addHandleClose (done) {
      this.cancelAdd()
      done()
    },
    // 关闭修改窗口
    updateHandleClose (done) {
      this.cancelUpdate()
      done()
    },
    /** 初始化弹出添加窗口方法 */
    initAdd () {
      this.addVisible = true
    },
    handleEdit (index, obj) {
      // 填充数据
      this.updateScenicForm.scenicId = obj.scenicId
      this.updateScenicForm.scenicName = obj.scenicName
      this.updateScenicForm.scenicItem = obj.scenicItem
      this.updateScenicForm.scenicPlace = obj.scenicPlace
      this.updateScenicForm.scenicInfo = obj.scenicInfo
      // 显示修改窗口
      this.updateVisible = true
    },
    handleDelete (index, obj) {
      /** 删除景点 */
      this.$axios
        .delete(`/scenic/delete/${obj.scenicId}`)
        .then(({ data: res }) => {
          if (res.code === 2001) {
            this.loadList() // 重新装载列表
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              showClose: true,
              center: true
            })
          }
        })
    }
  },
  data () {
    return {
      uploadScenic: {
        scenicId: null
      },
      uploadUrl: null,
      imageUrl: null,
      tableData: [],
      ids: [],
      scenicItems: [],
      addVisible: false,
      updateVisible: false,
      updateAvatarVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      scenic: {
        scenicId: null,
        scenicName: null,
        scenicPlace: null,
        scenicItem: null
      },
      // 添加门票表单绑定数据
      addScenicForm: {
        scenicId: null,
        scenicName: null,
        scenicItem: null,
        scenicPlace: null,
        scenicInfo: null
      },
      // 修改门票表单绑定数据
      updateScenicForm: {
        scenicId: null,
        scenicName: null,
        scenicItem: null,
        scenicPlace: null,
        scenicInfo: null,
        scenicImage: null
      }
    }
  }
}
</script>
