<template>
  <div>
    <!-- 卡片 -->
    <el-card style="margin-top: 20px">
      <!-- 表单查询部分 -->
      <div slot="header" style="height: 45px">
        <el-row>
          <el-col :span="4">
            <el-input placeholder="请输入标题" v-model="notice.title" />
          </el-col>
          <el-col :span="3"  style="display: flex;justify-content: space-between;align-items: center;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="query"
            >搜索</el-button>
            <el-button
              @click="initAdd"
              size="small"
              type="success"
              icon="el-icon-circle-plus-outline"
            >添加</el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="batchDelete"
            >删除</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 数据部分 -->
      <div class="data">
        <el-table
        @selection-change="getSelectId"
        ref="pageTable"
        :data="tableData"
        style="width: 100%"
        >
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column type="index"  width="120" label="序号"></el-table-column>
          <el-table-column prop="noticeTopic" label="标题" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.noticeTopic }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="noticeContent" label="内容" width="400">
            <template slot-scope="scope">
              <span>{{ scope.row.noticeContent }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="createTime"
            label="发布时间"
            width="180"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index,scope.row)"></el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"></el-button>
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
            :total="total"
          >
          </el-pagination>
      </div>
    </el-card>

    <!-- 添加窗口 -->
    <el-dialog
    :close-on-click-modal="false"
    title="添加公告"
    :visible.sync="addVisible"
    width="600px"
    :before-close="addHandleClose"
    >
      <el-form
        ref="addForm"
        :model="addNoticeForm"
        label-width="80px"
        size="mini"
      >
        <el-form-item prop="noticeTopic" label="公告标题">
          <el-input placeholder="请输入公告标题" v-model="addNoticeForm.noticeTopic"></el-input>
        </el-form-item>
        <el-form-item prop="noticeContent" label="公告内容">
          <el-input
          placeholder="请输入公告内容"
          :autosize="{minRows: 5, maxRows: 10}"
          type="textarea"
          v-model="addNoticeForm.noticeContent"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="add">添加公告</el-button>
          <el-button size="medium" @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      title="修改公告"
      :visible.sync="updateVisible"
      width="600px"
      :before-close="updateHandleClose"
    >
    <el-form
        ref="updateForm"
        :model="updateNoticeForm"
        label-width="80px"
        size="mini"
      >
      <el-form-item prop="noticeTopic" label="公告标题">
          <el-input
            placeholder="请输入公告标题"
            v-model="updateNoticeForm.noticeTopic"
          ></el-input>
      </el-form-item>
      <el-form-item prop="noticeContent" label="公告内容">
          <el-input
            placeholder="请输入公告内容"
            :autosize="{ minRows: 5, maxRows: 10 }"
            type="textarea"
            v-model="updateNoticeForm.noticeContent"
          ></el-input>
      </el-form-item>
      <el-form-item size="large">
          <el-button type="primary" size="medium" @click="update"
            >修改公告</el-button
          >
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
</style>
<script>
/** vue生命周期钩子 */
export default {
  created () {
    /** 加载分页列表 */
    this.loadList()
  },
  methods: {
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    loadList () {
      this.$axios
        .get(`/admin/notice/list/${this.currentPage}/${this.pageSize}`, {
          params: this.notice
        })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    /** 添加方法 */
    add () {
      /** 添加公告 */
      this.$axios
        .post('/admin/notice/add', this.addNoticeForm)
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
    /** 取消添加方法 */
    cancelAdd () {
      this.addVisible = false
      this.$refs.addForm.resetFields()
    },
    update () {
      /** 修改公告 */
      this.$axios
        .put('/admin/notice/update', this.updateNoticeForm)
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
    /** 取消添加方法 */
    cancelUpdate () {
      this.updateVisible = false
    },
    /** 初始化弹出添加窗口方法 */
    initAdd () {
      this.addVisible = true
    },
    // 关闭添加窗口的函数
    addHandleClose (done) {
      this.cancelAdd()
      done()
    },
    // 关闭修改窗口的函数
    updateHandleClose (done) {
      this.cancelUpdate()
      done()
    },
    handleEdit (index, obj) {
      // 填充数据
      this.updateNoticeForm.noticeId = obj.noticeId
      this.updateNoticeForm.noticeTopic = obj.noticeTopic
      this.updateNoticeForm.noticeContent = obj.noticeContent
      // 显示修改窗口
      this.updateVisible = true
    },
    // 批量删除
    batchDelete () {
      console.log(this.ids)
      if (this.ids.length !== 0) {
        this.$axios.delete('/admin/notice/delete', { params: { ids: this.ids } })
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
    getSelectId (selection) {
      this.ids = [] // 清空数组
      for (let i = 0; i < selection.length; i++) {
        this.ids.push(selection[i].noticeId)
      }
    },
    handleDelete (index, obj) {
      /** 公告新闻 */
      this.$axios
        .delete(`/admin/notice/delete/${obj.noticeId}`)
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
      /** 批量删除选中的id */
      ids: [],
      /** 添加/修改表单绑定对象 */
      addNoticeForm: {
        noticeContent: null,
        noticeTopic: null
      },
      updateNoticeForm: {
        noticeContent: null,
        noticeTopic: null
      },
      /** 查询表单绑定对象 */
      notice: {
        noticeContent: null,
        noticeId: null,
        noticeTopic: null,
        startTime: null,
        endTime: null
      },
      addVisible: false,
      updateVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      tableData: []
    }
  }
}
</script>
