<template>
    <div>
        <el-card>
             <!-- 表单查询部分 -->
             <div slot="header" style="height:45px">
                <el-row>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="订单号" v-model="orders.ordersId"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="所属景点" v-model="orders.scenicName"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="游客名" v-model="orders.touristName"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="orders.ticketStatus" clearable @clear="setValueNull" placeholder="取票状态" >
                            <el-option value="已取票"></el-option>
                            <el-option value="未取票"></el-option>
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
                <el-table ref="pageTable" @selection-change="getSelectId" :data="tableData"
                style="width: 100%">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column type="index" label="序号" width="60">
                    </el-table-column>
                    <el-table-column prop="ordersId" label="订单号" width="120">
                      <template slot-scope="scope">
                        <span>{{ scope.row.ordersId }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="touristName"  label="游客名" width="120">
                      <template slot-scope="scope">
                        <span>{{ scope.row.touristName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ticketName" label="门票名" width="120">
                      <template slot-scope="scope">
                       <span>{{ scope.row.ticketName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicName" label="所属景点" width="120">
                      <template slot-scope="scope">
                       <span>{{ scope.row.scenicName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ticketNumber" label="购票数量" width="120">
                      <template slot-scope="scope">
                       <span>{{ scope.row.ticketNumber}}</span>
                      </template>
                    </el-table-column>
                     <el-table-column prop="price" sortable label="订单价格" width="120">
                      <template slot-scope="scope">
                        <span>{{ scope.row.price }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column sortable prop="createTime" label="下单时间" width="220">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span>{{ scope.row.createTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ticketCode" label="取票码" width="220">
                      <template slot-scope="scope">
                        <span>{{ scope.row.ticketCode }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ticketStatus" clearable @clear="setValueNull" label="取票状态" width="100">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.ticketStatus==='已取票'" type="info" disable-transitions>{{scope.row.ticketStatus}}</el-tag>
                        <el-tag v-if="scope.row.ticketStatus==='未取票'" type="success" disable-transitions>{{scope.row.ticketStatus}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="150">
                      <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
                            编辑
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
<!-- 修改窗口 -->
<el-dialog :close-on-click-modal="false" title="修改订单" :visible.sync="updateVisible" width="600px"
:before-close="updateHandleClose">
    <el-form ref="updateForm" :model="updateOrdersForm" label-width="80px" size="mini">
        <el-form-item prop="ordersId" label="">
          <input type="hidden" v-model="updateOrdersForm.ordersId"/>
        </el-form-item>
        <el-form-item prop="ticketStatus" label="取票状态">
          <el-select v-model="updateOrdersForm.ticketStatus" placeholder="请选择取票状态" >
                <el-option value="已取票"></el-option>
                <el-option value="未取票"></el-option>
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
      this.$axios.get(`/tour/orders/list/${this.currentPage}/${this.pageSize}`, {
        params: this.orders
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    setValueNull () {
      this.orders.ticketStatus = null
    },
    getSelectId (selection) {
      this.ids = [] // 清空数组
      for (let i = 0; i < selection.length; i++) {
        this.ids.push(selection[i].ordersId)
      }
    },
    // 批量删除
    batchDelete () {
      console.log(this.ids)
      if (this.ids.length !== 0) {
        this.$axios
          .delete('/tour/orders/delete', { params: { ids: this.ids } })
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
        .put('/tour/orders/update', this.updateOrdersForm)
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
      this.updateOrdersForm.ordersId = obj.ordersId
      this.updateOrdersForm.ticketStatus = obj.ticketStatus
      // 显示修改窗口
      this.updateVisible = true
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
      orders: {
        ordersId: null,
        scenicName: null,
        touristName: null,
        ticketStatus: null
      },
      // 修改门票表单绑定数据
      updateOrdersForm: {
        ordersId: null,
        ticketStatus: null
      }
    }
  }
}
</script>
