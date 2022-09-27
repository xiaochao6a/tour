<!-- eslint-disable no-tabs -->
<template>
  <div id="buytickets">
    <div class="global-flex bgcolor">
      <div class="b-title"><a href="/index" id="to">首页</a></div>
      <div class="b-title">购票中心</div>
      <div class="b-user">用户：{{ user.touristName }}</div>
    </div>
    <el-card style="margin-top: 20px">
      <div slot="header" style="height:45px">
                <el-row>
          <el-col :span="4">
            <el-input style="width:100%" placeholder="门票名" v-model="ticket.ticketName" />
          </el-col>
          <el-col :span="4">
            <el-input  placeholder="所属景点" v-model="ticket.scenicName" />
          </el-col>
          <el-col :span="1" style="display: flex;justify-content: space-between;align-items: center;">
            <el-button
              size="medium"
              type="primary"
              icon="el-icon-search"
              round
              @click="query"
            ></el-button>
          </el-col>
        </el-row>
    </div>
        <!-- 数据部分 -->
    <div class="data">

        <el-table ref="pageTable" :data="tableData" style="width: 100%">
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
          <el-table-column prop="ticketNumber" header-align="center" label="购买数量" width="200">
              <!-- 选择数量 -->
              <template slot-scope="scope">
                <el-tag style="display:none" type="success" disable-transitions>{{scope.row.ticketExplain}}</el-tag>
                <el-input-number v-model="scope.row.ticketNumber" placeholder="0" :min="1" :max="10"></el-input-number>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
               <!-- 买票按钮 -->
               <el-button
              size="medium"
              type="primary"
              round
              @click="buy(scope.$index, scope.row)"
            >购买</el-button>
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
        <!-- 确认购买窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      title="请确认您的订单"
      :visible.sync="addVisible"
      width="600px"
      :before-close="addHandleClose"
    >
      <el-form label-width="80px" size="mini">
        <el-form-item label="门票名:">
          <span>{{this.buyTicket.ticketName}}</span>
        </el-form-item>
        <el-form-item label="购买数量:">
          <span>{{this.buyTicket.ticketNumber}}</span>
        </el-form-item>
        <el-form-item label="总价格:">
          <span>{{this.buyTicket.price}}</span>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="medium" @click="add">确认购买</el-button>
          <el-button size="medium" @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</el-card>
  </div>
</template>
<style>
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
  data () {
    return {
      ticket: {
        ticketId: null,
        ticketName: null,
        scenicName: null
      },
      addVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      user: { touristName: this.$store.state.user.touristsName },
      tableData: [],
      buyTicket: {
        ticketName: null,
        scenicName: null,
        touristName: this.$store.state.user.touristsName,
        ticketNumber: 0,
        ticketStatus: '未取票',
        price: null
      }
    }
  },
  methods: {
    query () {
      this.currentPage = 1 // 点击查询按钮，初始化页码为第一页
      this.loadList()
    },
    buy (index, row) {
      this.buyTicket.ticketNumber = row.ticketNumber
      console.log(row.ticketNumber)
      this.buyTicket.price = this.buyTicket.ticketNumber * row.ticketPrice
      this.buyTicket.ticketName = row.ticketName
      this.buyTicket.scenicName = row.scenicName
      if (row.ticketNumber === undefined) {
        alert('请选择购票数量')
        this.addVisible = false
      } else {
        this.addVisible = true
      }
    },
    add () {
      this.$axios.post('/tour/orders/add', this.buyTicket)
        .then(({ data: res }) => {
          if (res.code === 2001) {
            this.loadList() // 重新装载列表
            this.$message({
              message: res.message,
              type: 'success',
              duration: 2000,
              showClose: true,
              center: true
            })
          }
        })
      this.addVisible = false
    },
    // 关闭窗口函数(x)
    addHandleClose () {
      this.addVisible = false
    },
    // 取消
    cancelAdd () {
      this.addVisible = false
    },
    loadList () {
      this.$axios.get(`/tour/ticket/list/${this.currentPage}/${this.pageSize}`, {
        params: this.ticket
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    }
  }
}
</script>
