<template>
<div>
<el-card>
    <div slot="header" style="height:45px">
                <el-row>
            <el-col :span="4">
            <el-input style="width:100%" placeholder="管理员账号" v-model="administrators.touristsName" />
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
          </el-col>
        </el-row>
    </div>
      <!-- 数据部分 -->
    <div class="data">
        <el-table ref="pageTable" :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="administratorsId" label="管理员ID" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.administratorsId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="administratorsName" label="管理员账号" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.administratorsName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="administratorsPassword"  label="管理员密码" width="200">
            <template>
              <span>******</span>
            </template>
          </el-table-column>
          <el-table-column prop="registerTime"  label="创建时间" width="240">
            <template slot-scope="scope">
              <span>{{ scope.row.registerTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="角色" width="200">
            <template slot-scope="scope">
             <el-tag v-if="scope.row.role==='超级管理员'" disable-transitions>超级管理员</el-tag>
             <el-tag v-if="scope.row.role==='管理员'" type="info" disable-transitions>管理员</el-tag>
            </template>
          </el-table-column>
           <el-table-column prop="power" label="权限" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.power }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.role==='超级管理员'"
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
            :total="total"
        >
        </el-pagination>
    </div>
        <!-- 添加窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加管理员"
      :visible.sync="addVisible"
      width="600px"
      :before-close="addHandleClose"
    >
      <el-form
        ref="addForm"
        :model="addAdministratorsForm"
        :rules="rules"
        label-width="100px"
        size="mini"
      >
        <el-form-item prop="addUsername" label="管理员账号">
          <el-input
            v-model="addAdministratorsForm.addUsername"
            placeholder="请输入管理员账号">
          </el-input>
        </el-form-item>

        <el-form-item prop="addPassword" label="管理员密码">
          <el-input
            placeholder="请输入管理员密码"
            v-model="addAdministratorsForm.addPassword"
          ></el-input>
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <template >
            <el-tag type="success">管理员</el-tag>
          </template>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="add">确定添加</el-button>
          <el-button size="medium" @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</el-card>
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
export default {
  created () {
    this.loadList()
  },
  data () {
    const validateaddPassword = (rule, value, callback) => {
      const reg = /^\d{6,10}$/
      if (!reg.test(value)) {
        callback(new Error('密码必须6-10位'))
      } else {
        callback()
      }
    }
    return {
      addVisible: false,
      tableData: [],
      updateVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      administrators: {
        administratorsId: null,
        administratorsName: null
      },
      addAdministratorsForm: {
        role: this.$store.state.admin.role,
        power: this.$store.state.admin.power,
        administratorsId: null,
        addUsername: null,
        addPassword: null,
        addRole: '管理员'
      },
      rules: {
        addPassword: [
          { required: true, validator: validateaddPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    loadList () {
      this.$axios.get(`/admin/list/${this.currentPage}/${this.pageSize}`, {
        params: this.administrators
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    add () {
    /** 添加管理员 */
      this.$axios
        .post('/admin/add', this.addAdministratorsForm)
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
    // 关闭窗口函数(x)
    addHandleClose (done) {
      this.cancelAdd()
      done()
    },
    /** 初始化弹出添加窗口方法 */
    initAdd () {
      this.addVisible = true
    },
    handleDelete (index, obj) {
      /** 删除景点 */
      this.$axios
        .delete(`/admin/delete/${obj.administratorsId}`)
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
  }
}
</script>
