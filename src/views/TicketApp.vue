<template>
<div>
<el-card>
    <div slot="header" style="height:45px">
                <el-row>
          <el-col :span="4">
            <el-input style="width:100%" placeholder="门票号" v-model="ticket.ticketId"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input style="width:100%" placeholder="门票名" v-model="ticket.ticketName" />
          </el-col>
          <el-col :span="4">
            <el-input  placeholder="所属景点" v-model="ticket.scenicName" />
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
        <el-table ref="pageTable" @selection-change="getSelectId" :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="ticketId" label="门票号" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.ticketId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ticketName"  label="门票名称" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.ticketName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="scenicName" label="所属景点" width="180">
            <template slot-scope="scope">
             <span>{{ scope.row.scenicName}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="ticketPrice" sortable label="门票价格" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.ticketPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ticketExplain" label="门票说明" width="180">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ticketExplain==='成人票'" disable-transitions>{{scope.row.ticketExplain}}</el-tag>
              <el-tag v-if="scope.row.ticketExplain==='儿童票'" type="success" disable-transitions>{{scope.row.ticketExplain}}</el-tag>
              <el-tag v-if="scope.row.ticketExplain==='学生票'" type="warning" disable-transitions>{{scope.row.ticketExplain}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
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
<!-- 添加窗口 -->
<el-dialog
 :close-on-click-modal="false"
 title="添加门票"
 :visible.sync="addVisible"
 width="600px"
 :before-close="addHandleClose">

 <el-form ref="addForm" :model="addTicketForm" label-width="80px" size="mini">
        <el-form-item prop="scenicName" label="所属景点">
          <el-input v-model="addTicketForm.scenicName" filterable placeholder="请输入景点名"></el-input>
        </el-form-item>
        <el-form-item prop="ticketName" label="门票名称">
          <el-input placeholder="请输入门票名称" v-model="addTicketForm.ticketName"></el-input>
        </el-form-item>
        <el-form-item prop="ticketPrice" label="门票价格">
          <el-input placeholder="请输入门票价格" v-model="addTicketForm.ticketPrice"></el-input>
        </el-form-item>
        <el-form-item prop="ticketExplain" label="门票说明">
          <!-- <el-input placeholder="请输入门票说明" :autosize="{ minRows: 5, maxRows: 10}" type="textarea" v-model="addTicketForm.ticketExplain"></el-input> -->
          <el-select v-model="addTicketForm.ticketExplain">
            <el-option value="成人票">成人票</el-option>
            <el-option value="儿童票">儿童票</el-option>
            <el-option value="学生票">学生票</el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="add">添加门票</el-button>
          <el-button size="medium" @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>

</el-dialog>

<!-- 修改窗口 -->
<el-dialog
 :close-on-click-modal="false"
 title="修改门票"
 :visible.sync="updateVisible"
 width="600px"
 :before-close="updateHandleClose">

 <el-form ref="updateForm" :model="updateTicketForm" label-width="80px" size="mini">
        <el-form-item prop="ticketId" label="">
          <input type="hidden" v-model="updateTicketForm.ticketId"/>
        </el-form-item>
        <el-form-item prop="scenicName" label="所属景点">
          <el-input v-model="updateTicketForm.scenicName" placeholder="请选择景点名">
          </el-input>
        </el-form-item>
        <el-form-item prop="ticketName" label="门票名称">
          <el-input placeholder="请输入门票名称" v-model="updateTicketForm.ticketName"></el-input>
        </el-form-item>
        <el-form-item prop="ticketPrice" label="门票价格">
          <el-input placeholder="请输入门票价格" v-model="updateTicketForm.ticketPrice"></el-input>
        </el-form-item>
        <el-form-item prop="ticketExplain" label="门票说明">
          <el-select v-model="updateTicketForm.ticketExplain">
            <el-option value="成人票"></el-option>
            <el-option value="儿童票"></el-option>
            <el-option value="学生票"></el-option>
          </el-select>
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
</style>
<script>
export default {
  created () {
    // 需要景区的名字数组
    this.loadList()
  },
  methods: {
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    loadList () {
      this.$axios.get(`/tour/ticket/list/${this.currentPage}/${this.pageSize}`, {
        params: this.ticket
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    getSelectId (selection) {
      this.ids = [] // 清空数组
      for (let i = 0; i < selection.length; i++) {
        this.ids.push(selection[i].ticketId)
      }
    },
    // 批量删除
    batchDelete () {
      console.log(this.ids)
      if (this.ids.length !== 0) {
        this.$axios
          .delete('/tour/ticket/delete', { params: { ids: this.ids } })
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
    /** 添加门票 */
      this.$axios
        .post('/tour/ticket/add', this.addTicketForm)
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
    /** 修改门票 */
      this.$axios
        .put('/tour/ticket/update', this.updateTicketForm)
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
      this.updateTicketForm.ticketId = obj.ticketId
      this.updateTicketForm.ticketName = obj.ticketName
      this.updateTicketForm.scenicName = obj.scenicName
      this.updateTicketForm.ticketPrice = obj.ticketPrice
      this.updateTicketForm.ticketExplain = obj.ticketExplain
      // 显示修改窗口
      this.updateVisible = true
    },
    handleDelete (index, obj) {
      /** 删除门票 */
      this.$axios
        .delete(`/tour/ticket/delete/${obj.ticketId}`)
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
      tableData: [],
      ids: [],
      addVisible: false,
      updateVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      ticket: {
        ticketId: null,
        ticketName: null,
        scenicName: null
      },
      // 添加门票表单绑定数据
      addTicketForm: {
        ticketId: null,
        ticketName: null,
        scenicName: null,
        ticketPrice: null,
        ticketExplain: null
      },
      // 修改门票表单绑定数据
      updateTicketForm: {
        ticketId: null,
        ticketName: null,
        scenicName: null,
        ticketPrice: null,
        ticketExplain: null
      }
    }
  }
}
</script>
