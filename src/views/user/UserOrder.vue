<template>
    <div>
        <el-card>
             <!-- 表单查询部分 -->
             <div slot="header" style="height:45px">
                <el-row>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="订单编号" v-model="orders.ordersId"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="门票名" v-model="orders.ticketName" />
                    </el-col>
                    <el-col :span="4">
                        <el-input style="width:100%" placeholder="所属景点" v-model="orders.scenicName"></el-input>
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
                    </el-col>
                </el-row>
             </div>
             <!-- 数据部分 -->
             <div class="data">
                <el-table ref="pageTable" :data="tableData"
                style="width: 100%">
                    <el-table-column prop="ordersId" label="订单号" width="140">
                      <template slot-scope="scope">
                        <span>{{ scope.row.ordersId }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ticketName" label="门票名" width="140">
                      <template slot-scope="scope">
                       <span>{{ scope.row.ticketName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicName" label="所属景点" width="140">
                      <template slot-scope="scope">
                       <span>{{ scope.row.scenicName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ticketNumber" label="购票数量" width="140">
                      <template slot-scope="scope">
                       <span>{{ scope.row.ticketNumber}}</span>
                      </template>
                    </el-table-column>
                     <el-table-column prop="price" sortable label="订单价格" width="140">
                      <template slot-scope="scope">
                        <span>{{ scope.row.price }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column sortable prop="createTime" label="下单时间" width="280">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span>{{ scope.row.createTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ticketCode" label="取票码" width="280">
                      <template slot-scope="scope">
                        <span>{{ scope.row.ticketCode }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ticketStatus" label="取票状态" width="120">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.ticketStatus==='已取票'" type="info" disable-transitions>{{scope.row.ticketStatus}}</el-tag>
                        <el-tag v-if="scope.row.ticketStatus==='未取票'" type="success" disable-transitions>{{scope.row.ticketStatus}}</el-tag>
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
    setValueNull () {
      this.orders.ticketStatus = null
    },
    loadList () {
      this.$axios.get(`/tour/orders/list/${this.currentPage}/${this.pageSize}`, {
        params: this.orders
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    }
  },
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      orders: {
        ordersId: null,
        touristName: this.$store.state.user.touristsName,
        ticketName: null,
        scenicName: null,
        ticketStatus: null
      }
    }
  }
}
</script>
