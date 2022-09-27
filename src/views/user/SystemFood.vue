<template>
    <div id="foodTable">
        <ul v-for="(item,index) in tableData" :key="index" :label="item" :value="item">
            <li class="box">
                <el-image class="upload-size" :src="'http://localhost:8081/' + item.foodPicture">
                    <img slot="error" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-image>
                <div class="global-flex">
                <div style="font-size:24px;margin:10px">
                    {{item.foodName}}
                </div>
                <div style="font-size:20px;margin:10px">
                    {{item.foodPrice}}元
                </div>
                </div>
                <div class="global-flex">
                <el-rate v-model="rate"
                disabled show-score text-color="#ff9900" score-template="5.0">
                </el-rate>
                <el-button @click="open(item.foodId)" type="text" class="button">
                  <i class="el-icon-dessert"></i>查看美食详情
                  </el-button>
                </div>
            </li>
        </ul>
        <el-dialog
            :close-on-click-modal="false"
            title="美食详情"
            :visible.sync="openVisible"
            width="600px"
            :before-close="updateHandleClose">
            <span>{{this.info}}</span>
        </el-dialog>
    </div>
</template>
<style>
#foodTable ul {
    list-style: none;
    float: left;
}
.upload-size {
    width: 330px;
    height: 300px;
}
.button {
  float: right;
}
.box {
    width: 330px;
    height: 385px;
    border: rgb(197, 190, 190) 1px solid;
}
</style>
<script>
export default {
  created () {
    this.loadList()
  },
  methods: {
    open (foodId) {
      this.$axios.get(`/scenicspot/food/select/${foodId}`)
        .then(({ data: res }) => {
          this.info = res.data.foodInfo
        })
      this.openVisible = true
    },
    updateHandleClose () {
      this.openVisible = false
    },
    loadList () {
      this.$axios.get(`/scenicspot/food/list/${this.currentPage}/${this.pageSize}`, {
        params: this.food
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
          console.log(this.tableData)
        })
    }
  },
  data () {
    return {
      rate: 5.0,
      food: {
        foodId: null,
        foodName: null
      },
      openVisible: false,
      info: null,
      tableData: [],
      currentPage: 0,
      pageSize: 0
    }
  }
}
</script>
