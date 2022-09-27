<template>
    <div>
        <el-card>
            <!-- 表单查询部分 -->
            <div slot="header" style="height:45px">
                <el-row>
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
            </el-col>
                </el-row>
            </div>
            <!-- 数据部分 -->
             <div class="data">
                <el-table ref="pageTable" :data="tableData"
                style="width: 100%">
                    <el-table-column type="index" label="序号" width="120">
                    </el-table-column>
                    <el-table-column prop="scenicImg" label="景区图" width="300" >
                     <template slot-scope="scope">
                      <el-image class="upload-size" :src= "$store.state.serverPath + scope.row.scenicImage">
                        <img slot="error"  class="upload-size"
                        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      </el-image>
                     </template>
                    </el-table-column>
                    <el-table-column prop="scenicId" label="景区号" width="180">
                      <template slot-scope="scope">
                        <span>{{ scope.row.scenicId}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicName"  label="景区名称" width="180">
                      <template slot-scope="scope">
                        <span>{{ scope.row.scenicName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicPlace" label="所在地点" width="180">
                      <template slot-scope="scope">
                       <span>{{ scope.row.scenicPlace}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="scenicItem" label="景区主题" width="180" type="success" disable-transitions>
                     <template slot-scope="scope">
                       <el-tag type="success" v-if="scope.row.scenicItem==='历史'">{{ scope.row.scenicItem}}</el-tag>
                       <el-tag  v-if="scope.row.scenicItem!=='历史'">{{ scope.row.scenicItem}}</el-tag>
                      </template>
                    </el-table-column>
                     <el-table-column prop="scenicInfo" label="景区信息" width="600">
                      <template slot-scope="scope">
                        <span>{{ scope.row.scenicInfo }}</span>
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
    height: 80vh;
    overflow-y: auto;
}
.upload-size {
  width: 240px;
  max-height: 160px;
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
    }

  },
  data () {
    return {
      imageUrl: null,
      tableData: [],
      scenicItems: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      scenic: {
        scenicId: null,
        scenicName: null,
        scenicPlace: null,
        scenicItem: null
      }
    }
  }
}
</script>
