<template>
  <div class="wrapper">
    <!-- 卡片组件 -->
    <card _Title="我的足迹" :_Size="16" ></card>
    <Button class="del-btn" @click="deleteAll" type="primary">删除全部</Button>
    <!-- 足迹列表 -->
    <empty v-if="list.length === 0" />
    <ul class="track-list" v-else>
      <li v-for="(item, index) in list" :key="index" @click="goodsDetail(item.footprintGoodsVO.skuId, item.footprintGoodsVO.id)">
        <img :src="item.footprintGoodsVO.image" :alt="item.footprintGoodsVO.image" width="200" height="200">
        <p class="ellipsis">{{item.footprintGoodsVO.name}}</p>
        <p>{{item.footprintGoodsVO.price | unitPrice('￥')}}</p>
        <span class="del-icon" @click.stop="deleteById(item.footprintGoodsVO.id)">
          <Icon type="md-trash" />
        </span>
      </li>
    </ul>
    <!-- 分页 -->
    <div class="page-size">
      <Page :total="total" @on-change="changePageNum"
        @on-page-size-change="changePageSize"
        :page-size="pageSize"
        show-sizer>
      </Page>
    </div>
  </div>
</template>

<script>
import { getFootprintList, deleteFootprint } from '@/api/mall-member/footprint'

export default {
  name: 'MyTrack',
  data () {
    return {
      list: [], // 我的足迹，商品列表
      spinShow: false, // 控制loading是否加载
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted () {
    this.getFootprintList()
  },
  methods: {
    goodsDetail (skuId, id) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId, id }
      });
      window.open(routeUrl.href, '_blank');
    },

    deleteAll () { // 清除全部足迹
      this.$Modal.confirm({
        title: '删除',
        content: '<p>确定要删除全部足迹吗？</p>',
        onOk: () => {
          var params = this.axios.paramsHandler({});
          deleteFootprint(params).then(({data}) => {
            if (data && data.code=='200') {
              this.$Message.success('删除成功')
              this.getFootprintList()
            }
          })
        },
        onCancel: () => { }
      });
    },
    deleteById (id) {
      var params = this.axios.paramsHandler({goodsId: id});
      deleteFootprint(params).then(({data}) => {
        if (data && data.code=='200') {
          this.$Message.success('删除成功')
          this.getFootprintList()
        }
      })
    },
    changePageNum (val) { // 修改页码
      this.pageNum = val;
      this.getFootprintList()
    },
    changePageSize (val) { // 修改页数
      this.pageNum = 1;
      this.pageSize = val;
      this.getFootprintList()
    },

    //获取会员足迹
    getFootprintList() {
      var params = this.axios.paramsHandler({pageNum: this.pageNum, pageSize: this.pageSize});
      getFootprintList(params).then(({data}) => {
        if (data && data.code=='200') {
          this.list = data.data.list;
          this.total = data.data.totalCount
        } else {
          this.$Message.error(data.message);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.wrapper {
  margin-bottom: 40px;
}
.del-btn {
  margin: 0 0 10px 15px;
}

.track-list {
  display: flex;
  flex-wrap: wrap;
  li{
    width: 200px;
    overflow: hidden;
    margin-left: 15px;
    margin-bottom: 10px;
    border: 1px solid #eee;
    position: relative;
    &:hover{
      cursor: pointer;
      box-shadow:1px 1px 3px #999;
      .del-icon{
        display: block;
      }
    }
    p{
      padding: 0 5px;
      margin: 3px 0;
    }
    p:nth-child(2) {
      color: #999;
    }
    p:nth-child(3){
      color: $theme_color;
    }
    .del-icon {
      display: none;
      font-size: 30px;
      background-color:rgba(0,0,0,.3);
      position: absolute;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      right: 0;
      top: 0;
      cursor: pointer;
    }
  }
}
.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
