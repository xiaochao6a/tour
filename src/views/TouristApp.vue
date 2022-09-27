<template>
<div>
<el-card>
    <div slot="header" style="height:45px">
                <el-row>
            <el-col :span="4">
            <el-input style="width:100%" placeholder="游客名" v-model="tourists.touristsName" />
            </el-col>
            <el-col :span="1" style="display: flex;justify-content: space-between;align-items: center;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="query"
            ></el-button>
          </el-col>
        </el-row>
    </div>
      <!-- 数据部分 -->
    <div class="data">
        <el-table ref="pageTable" :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="touristsId" label="游客号" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.touristsId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="touristsName"  label="游客名称" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.touristsName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="touristsGender"  label="性别" width="100">
            <template slot-scope="scope">
             <el-tag type="primary" v-if="scope.row.gender===1" disable-transitions>男</el-tag>
             <el-tag type="danger" v-if="scope.row.gender===0" disable-transitions>女</el-tag>
             <el-tag type="success" v-if="scope.row.gender===2" disable-transitions>保密</el-tag>
             </template>
          </el-table-column>
          <el-table-column prop="touristsBirthday"  label="游客生日" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.birthday }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="touristTelephone" label="游客电话" width="150">
            <template slot-scope="scope">
             <span>{{ scope.row.telephone}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="registerTime" sortable label="注册时间" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.registerTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="power"  label="权限" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.power }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status===1" disable-transitions>{{scope.row.status}}</el-tag>
              <el-tag type="danger" v-if="scope.row.status===0" disable-transitions>{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini" type="success"
                @click="active(scope.$index, scope.row)"
                >激活</el-button
              >
              <el-button
                size="mini" type="danger"
                @click="freeze(scope.$index, scope.row)"
                >冻结</el-button
              >
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
    return {
      tableData: [],
      updateVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      tourists: {
        touristsId: null,
        touristsName: null
      }
    }
  },
  methods: {
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    loadList () {
      console.log(this.tourists)
      this.$axios.get(`/user/list/${this.currentPage}/${this.pageSize}`, {
        params: this.tourists
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
          console.log(this.tableData)
        })
    },
    active (index, row) {
    /** 激活 */
      this.$axios
        .put(`/user/modify/Active/${row.touristsId}`)
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
    freeze (index, row) {
    /** 冻结 */
      this.$axios
        .put(`/user/modify/Freeze/${row.touristsId}`)
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
    }
  }
}
</script>
