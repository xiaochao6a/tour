<template>
    <div>
        <el-card>
             <!-- 表单查询部分 -->
             <div slot="header" style="height:45px">
                <el-row>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="请输入美食名称"
                        v-model="food.foodName"></el-input>
                    </el-col>
                    <el-col :span="1" style="display: flex;justify-content: space-between;align-items: center;">
                        <el-button
                             size="small"
                             type="primary"
                             icon="el-icon-search"
                             @click="query"
                        ></el-button>
                        <el-button
                            @click="initAdd"
                            size="small"
                            type="success"
                            icon="el-icon-circle-plus-outline"
                            ></el-button>
                        <el-button
                             @click="batchDelete"
                             size="small"
                             type="danger"
                             icon="el-icon-delete"
                        ></el-button>
                    </el-col>
                </el-row>
             </div>
             <!-- 数据部分 -->
             <div class="data">
                <el-table ref="pageTable"
                @selection-change="getSelectId" :data="tableData"
                style="width: 100%">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column type="index"  label="序号" width="60">
                    </el-table-column>
                    <el-table-column prop="foodName"  label="美食名称" width="180">
                      <template slot-scope="scope">
                        <span>{{ scope.row.foodName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="foodPicture" label="美食图" width="240" >
                     <template slot-scope="scope">
                      <el-image class="upload-size" :src= "$store.state.serverPath + scope.row.foodPicture">
                        <img slot="error"  class="upload-size"
                        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      </el-image>
                     </template>
                    </el-table-column>
                    <el-table-column prop="foodPrice" sortable label="价格" width="180">
                      <template slot-scope="scope">
                       <el-tag type="danger">{{ scope.row.foodPrice}}</el-tag>
                      </template>
                    </el-table-column>
                     <el-table-column prop="foodInfo"  label="美食介绍" width="320">
                      <template slot-scope="scope">
                        <span>{{ scope.row.foodInfo }}</span>
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
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">
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
          :data= this.uploadFood
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
        <!--  修改窗口 -->
        <el-dialog
            :close-on-click-modal="false"
            title="修改美食信息"
            :visible.sync="updateVisible"
            width="600px"
            :before-close="updateHandleClose">

         <el-form ref="updateForm"
            :model="updateFoodForm"
            label-width="80px"
            size="mini">

        <el-form-item prop="foodId" label="">
          <input type="hidden" v-model="updateFoodForm.foodId" />
        </el-form-item>

        <el-form-item prop="foodName" label="美食名称">
          <el-input
            placeholder="请输入美食名称"
            v-model="updateFoodForm.foodName"
          ></el-input>
        </el-form-item>

        <el-form-item prop="foodPrice" label="美食价格">
          <el-input
            placeholder="请输入美食价格"
            v-model="updateFoodForm.foodPrice"
          ></el-input>
        </el-form-item>
        <el-form-item prop="foodInfo" label="美食介绍">
          <el-input
            placeholder="请输入美食介绍"
            :autosize="{ minRows: 5, maxRows: 10 }"
            type="textarea"
            v-model="updateFoodForm.foodInfo"
          ></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="update"
            >修改美食</el-button
          >
          <el-button size="medium" @click="cancelUpdate">取消</el-button>
        </el-form-item>

            </el-form>
        </el-dialog>

        <!-- 添加窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加美食"
      :visible.sync="addVisible"
      width="600px"
      :before-close="addHandleClose"
    >
      <el-form
        ref="addForm"
        :model="addfoodForm"
        label-width="80px"
        size="mini"
      >
        <el-form-item prop="foodName" label="美食名称">
          <el-input
            v-model="addfoodForm.foodName"
            placeholder="请输入美食名称">
          </el-input>
        </el-form-item>

        <el-form-item prop="foodPrice" label="美食价格">
          <el-input
            placeholder="请输入美食价格"
            v-model="addfoodForm.foodPrice"
          ></el-input>
        </el-form-item>

        <el-form-item prop="foodInfo" label="美食介绍">
          <el-input
            placeholder="请输入美食介绍"
            :autosize="{ minRows: 5, maxRows: 10 }"
            type="textarea"
            v-model="addfoodForm.foodInfo"
          ></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="add">确定添加</el-button>
          <el-button size="medium" @click="cancelAdd">取消</el-button>
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
        width: 180px;
        max-height: 100px;
    }
</style>
<script>
export default {
  created () {
    this.loadList()
  },
  methods: {
    preview (file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    /** 添加方法 */
    add () {
      /** 添加美食 */
      this.$axios.post('/scenicspot/food/add', this.addfoodForm)
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
    handleDelete (index, obj) {
      /** 删除美食信息 */
      this.$axios
        .delete(`/scenicspot/food/delete/${obj.foodId}`)
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
    },
    /** 初始化弹出添加窗口方法 */
    initAdd () {
      this.addVisible = true
    },
    loadList () {
      this.$axios.get(`/scenicspot/food/list/${this.currentPage}/${this.pageSize}`, {
        params: this.food
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    getSelectId (selection) {
      this.ids = [] // 清空数组
      for (let i = 0; i < selection.length; i++) {
        this.ids.push(selection[i].foodId)
      }
    },
    // 打开窗口
    openDialog (index, obj) {
      this.imageUrl = this.$store.state.serverPath + obj.foodPicture
      this.uploadFood.foodId = obj.foodId
      this.updateAvatarVisible = true
      this.uploadUrl = this.$store.state.serverPath + '/scenicspot/food/upload'
    },
    // 关闭窗口
    handleClose (done) {
      // 关闭窗口的时候，重置预览头像变量
      setTimeout(() => {
        this.imageUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }, 300)
      done()
    },
    // 上传图片
    upload () {
      this.$refs.upload.submit()
      this.updateAvatarVisible = false
    },
    // 上传图片成功
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
      console.log(this.ids)
      if (this.ids.length !== 0) {
        this.$axios
          .delete('/scenicspot/food/delete', { params: { ids: this.ids } })
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
    cancelAdd () {
      this.addVisible = false
      this.$refs.addForm.resetFields()
    },
    update () {
    /** 修改新闻 */
      this.$axios
        .put('/scenicspot/food/update', this.updateFoodForm)
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
    handleEdit (index, obj) {
      // 填充数据
      this.updateFoodForm.foodId = obj.foodId
      this.updateFoodForm.foodName = obj.foodName
      this.updateFoodForm.foodPrice = obj.foodPrice
      this.updateFoodForm.foodInfo = obj.foodInfo
      // 显示修改窗口
      this.updateVisible = true
    }
  },
  data () {
    return {
      uploadFood: {
        FoodId: null
      },
      uploadUrl: null,
      imageUrl: null,
      tableData: [],
      ids: [],
      addVisible: false,
      updateVisible: false,
      updateAvatarVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,

      /** 添加/修改表单绑定对象 */
      addfoodForm: {
        foodName: null,
        foodPrice: null,
        foodInfo: null
      },

      food: {
        foodId: null,
        foodName: null
      },
      // 修改门票表单绑定数据
      updateFoodForm: {
        foodName: null,
        foodPrice: null,
        foodInfo: null
      }
    }
  }
}
</script>
