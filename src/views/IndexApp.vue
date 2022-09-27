<template>
    <div id="index-app">
        <div class="div-flex"><div><img class="logo" src="@/assets/logo.jpg"/>
        </div>
        <div style="margin-right:60px">
          <a href="user/userlogin"  class=".a">登录</a>
          <span>&nbsp;|&nbsp;</span>
          <a href="user/userregister">注册</a>
        </div>
        </div>
        <div>
<el-container>
  <el-header class="global-flex">
    <div class="h-left">
      <a href="#tous" id="to">首页</a>
      <a href="/user/userbuytickets">购票中心</a>
      <a href="/user/food">美食佳肴</a>
      <a href="user/scenic">景点全览</a>
      <a href="user/userinfo">个人信息</a>
      <a href="user/userorder">我的订单</a>
    </div>
    <div class="h-right">
      <form>
        <input placeholder="Search"/>
        <input style="height:25px;" type="submit" value="搜索"/>
      </form>
    </div>
  </el-header>
  <el-main>
    <div class="m">
     <el-carousel :interval="2000" arrow="always" height="350px">
    <el-carousel-item v-for="(item,index) in imgurls" :key="index">
      <img :src="item.img" width="100%" height="360px"/>
    </el-carousel-item>
  </el-carousel>
    </div>
  </el-main>
</el-container>
        </div>
        <a name="tous"></a>
        <div class="main-box">
          <div class="main-left">
          <div class="title-left">景点门票</div>
          <div class="t_content">
            <div class="t">
             <div style="width:500px"> <a href="/user/userbuytickets"><img height="260px" width="500px" src="../assets/g.jpg"/></a></div>
                <ol class="info"><a style="color:black;font-weight: bold;" href="/user/userbuytickets">【故宫】</a>
                  <li>景点主题：历史</li>
                  <li>景点地址：北京</li>
                  <li>景点特色：北京故宫是中国明清两代的皇家宫殿，旧称紫禁城，位于北京中轴线的中心。
                    北京故宫内的建筑分为外朝和内廷两部分。
                    外朝的中心为太和殿、中和殿、保和殿，统称三大殿，是国家举行大典礼的地方。
                    北京故宫是世界上现存规模最大、保存最为完整的木质结构古建筑之一，是国家AAAAA级旅游景区，1961年被列为第一批全国重点文物保护单位；1987年被列为世界文化遗产。</li>
                </ol>
            </div>
          </div>
          <div class="t_content">
             <div class="t">
             <div style="width:500px"> <a href="/user/userbuytickets"><img height="260px" width="500px" src="../assets/l.jpg"/></a></div>
                <ol class="info"><a style="color:black;font-weight: bold;" href="/user/userbuytickets">【罗浮宫】</a>
                  <li>景点主题：人文</li>
                  <li>景点地址：欧洲</li>
                  <li>景点特色：位于法国巴黎市中心的塞纳河北岸，位居世界四大博物馆之首。始建于1204年，原是法国的王宫，居住过50位法国国王和王后，是法国古典主义时期最珍贵的建筑物之一，以收藏丰富的古典绘画和雕刻而闻名于世。
                  现为卢浮宫博物馆，占地约198公顷，宫前的金字塔形玻璃入口，占地面积为24公顷，是华人建筑大师贝聿铭设计的。1793年8月10日，卢浮宫艺术馆正式对外开放，成为一个博物馆。
                  卢浮宫已成为世界著名的艺术殿堂，是举世瞩目的万宝之宫。</li>
                </ol>
            </div>
          </div>
          <div class="t_content">
             <div class="t">
             <div style="width:500px"> <a href="/user/userbuytickets"><img height="260px" width="500px" src="../assets/b.jpg"/></a></div>
                <ol class="info"><a style="color:black;font-weight: bold;" href="/user/userbuytickets">【兵马俑】</a>
                  <li>景点主题：历史</li>
                  <li>景点地址：西安</li>
                  <li>景点特色：亦简称秦兵马俑或秦俑，是第一批全国重点文物保护单位、第一批中国世界遗产，位于今陕西省西安市临潼区秦始皇陵以东1.5千米处的兵马俑坑内。
                  兵马俑是古代墓葬雕塑的一个类别。古代施行人殉，奴隶是奴隶主生前的附属品，奴隶主死后奴隶要作为殉葬品为奴隶主陪葬。兵马俑即制成兵马（战车、战马、士兵）形状的殉葬品。</li>
                </ol>
            </div>
          </div>
          </div>
          <div class="main-right">
            <div class="up-area">
              <div class="title-right">热门地区</div>
              <div class="c-place"><span><a href="">北京</a></span><span><a href="">上海</a></span><span></span><a href="">西安</a><span></span><a href="">杭州</a></div>
              <div class="c-tit">服务保障</div>
              <ol class="cl">
                <li><div class="cct"><img src="../assets/bao.png"/>入园保证</div><div class="cct1">顺利入园,快速服务</div></li>
                <li><div class="cct"><img src="../assets/kuai.png"/>快速入园</div><div class="cct1">便捷入园,无需排队</div></li>
                <li><div class="cct"><img src="../assets/tui.png"/>随时退</div><div class="cct1">无条件退,放心订票</div></li>
                <li><div class="cct"><img src="../assets/sui.png"/>贵就赔</div><div class="cct1">买贵就赔,保证便宜</div></li>
              </ol>
            </div>
            <div class="row-area">
              <div class="r-da"><img src="../assets/laba.png"/>系统公告</div>
              <div class="r-content">
              <el-table ref="pageTable" :data="tableData" show-header:false>
                <el-table-column label="最新公告" header-align="center" >
                      <template slot-scope="scope" >
                        <span @click="look(scope.row)" style="font-size:16px" class="alert"><i class="el-icon-collection-tag"></i> {{ scope.row.noticeTopic }}</span>
                      </template>
                </el-table-column>
              </el-table>
              </div>
            </div>
            </div>
        </div>
        <div class="mid"><img src="../assets/stronger.jpg"/></div>
        <div class="floor">
          <div class="f-content">
          <div class="f-title div-flex"><span>美食推荐</span><a href="/user/food">更多</a></div>
          <div class="food">
            <div class="t-f"><img src="../assets/food1.jpg"/></div>
            <ol>【地三鲜】<li>美食介绍：地三鲜</li><li>推荐餐馆：东北餐馆</li></ol>
          </div>
          <div class="food">
            <div class="t-f"><img src="../assets/food2.jpg"/></div>
            <ol>【猪蹄】<li>美食介绍：猪蹄</li><li>推荐餐馆：猪蹄餐馆</li></ol>
          </div>
          <div class="food">
            <div class="t-f"><img src="../assets/food3.jpg"/></div>
            <ol>【排骨】<li>美食介绍：排骨</li><li>推荐餐馆：排骨餐馆</li></ol>
          </div>
           <div class="food">
            <div class="t-f"><img src="../assets/food4.jpg"/></div>
            <ol>【南昌炒粉】<li>美食介绍：南昌特色炒米粉</li><li>推荐餐馆：南昌炒粉面馆</li></ol>
          </div>
          <div class="food">
            <div class="t-f"><img src="../assets/北京烤鸭.jpg"/></div>
            <ol>【北京烤鸭】<li>美食介绍：北京传统手艺</li><li>推荐餐馆：全聚德</li></ol>
          </div>
        </div>
        </div>
        <div class="floor-ban"><span>关于我们</span><span>联系我们</span><span>招贤纳士</span><span>法律声明</span><span>友情链接</span><span>支付方式</span><span>服务声明</span><span>广告声明</span></div>
    <el-dialog
      :close-on-click-modal="false"
      title="公告详情"
      :visible.sync="alertVisible"
      width="420px"
      :before-close="closeDialog"
      >
      <span>
        {{this.alertContent}}
      </span>
      <span slot="footer">
        <el-button @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<style>
  .el-header, .el-footer {
    background-color:#212121;
    height: 40px !important;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color:#FEFEFC;
    overflow: hidden;
    height: 380px;
  }
  .alert:hover {
    color: rgb(255, 145, 0);
    cursor: pointer;
  }
  .el-table-column{
    color: #212121;
    font-size: 24px;
    font-weight: bold !important;
  }
  </style>
<script>
export default {
  created () {
    this.loadList()
  },
  methods: {
    loadList () {
      this.$axios.get('/admin/notice/list/1/8', {
        params: this.notice
      })
        .then(({ data: res }) => {
          this.tableData = res.data.list
        })
    },
    look (row) {
      this.lookNotice.noticeTopic = row.noticeTopic
      this.$axios.get('/admin/notice/list/1/1', { params: this.lookNotice })
        .then(({ data: res }) => {
          this.alertContent = res.data.list[0].noticeContent
          console.log(this.alertContent)
          this.alertVisible = true
        })
    },
    closeDialog () {
      this.alertVisible = false
    }
  },
  data () {
    return {
      alertVisible: false,
      alertContent: null,
      tableData: [],
      notice: {
        noticeTopic: null
      },
      lookNotice: {
        noticeTopic: null
      },
      imgurls: [
        { img: require('../assets/1.jpg') }, { img: require('../assets/2.jpg') }, { img: require('../assets/3.jpg') }, { img: require('../assets/4.jpg') }]
    }
  }
}
</script>
