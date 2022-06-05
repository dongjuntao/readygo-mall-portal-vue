<template>
  <div class="wrapper">
    <card _Title="优惠券列表" :_Tabs="statusNameList" @_Change="change" />
    <empty v-if="list.length==0" />
    <ul class="coupon-list" v-else>
      <li v-for="(item, index) in list" class="coupon-item" :key="index">
        <div class="c-left">
          <div>
            <span v-if="item.type === 0" class="fontsize_12 global_color">￥<span class="price">{{item.discountAmount | unitPrice}}</span></span>
            <span v-if="item.type === 1" class="fontsize_12 global_color"><span class="price">{{item.discountAmount}}</span>折</span>
            <span class="describe">满{{item.minConsumption}}元可用</span>
          </div>
          <p>使用范围：{{useScope(item.source, item.useScope, item.merchantName)}}</p>
          <p>有效期至：{{item.validPeriodEnd | formatDateTime }}</p>
        </div>
        <b></b>
        <a class="c-right" :class="{'canot-use':params.memberCouponStatus !== 'NEW'}" @click="go(item)">立即使用</a>
        <i class="circle-top"></i>
        <i class="circle-bottom"></i>
      </li>
    </ul>
    <Page :total="total" @on-change="changePageNum"
      class="pageration"
      @on-page-size-change="changePageSize"
      :page-size="pageSize"
      show-total
      show-sizer>
    </Page>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>

import { getReceivedCouponList } from '@/api/mall-member/coupon-received'
export default {
  name: 'Coupons',
  data () {
    return {
      statusNameList: [ // 优惠券状态
        '未使用',
        '已使用',
        '已过期'
      ],
      statusList: [0, 1, 2], // 优惠券状态
      loading: false, // 列表加载状态
      params: { // 请求参数
        pageNumber: 1,
        pageSize: 10,
        memberCouponStatus: 'NEW'
      },
      pageNo: 1,
      pageSize: 10,
      useStatus: 0,
      total: 0, // 优惠券总数
      list: [] // 优惠券列表
    };
  },
  methods: {

    getList () { // 获取优惠券列表
      this.loading = true;
      var params = this.axios.paramsHandler({
        useStatus: this.useStatus,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      })
      getReceivedCouponList(params).then(({data}) => {
        this.loading = false
        if (data && data.code == '200') {
          this.list = data.data
          console.log("this.list.length= ==", this.list)
          this.total = data.data.totalCount
        }
      })
    },
    // 切换优惠券状态
    change (index) {
      this.useStatus = this.statusList[index]
      this.pageNo = 1;
      this.getList()
    },
    go (item) { // 根据使用条件跳转商品列表页面
      if (this.memberCouponStatus !== 0) return;
      if (item.storeId !== 'platform') {
        this.$router.push({path: '/merchant', query: {id: item.storeId}})
      } else {
        if (item.scopeType === 'PORTION_GOODS_CATEGORY') {
          this.$router.push({path: '/goodsList', query: {categoryId: item.scopeId}})
        } else {
          this.$router.push({path: '/goodsList'})
        }
      }
    },

    changePageNum (val) { // 分页改变页码
      this.pageNo = val;
      this.getList()
    },

    changePageSize (val) { // 分页改变页数
      this.pageNo = 1;
      this.pageSize = val;
      this.getList()
    },

    // 优惠券可用范围【改造】
    useScope (type, useScope, merchantName) {
      let shop = '平台';
      let goods = '全部商品'
      if (type != 0) shop = merchantName //不等于0，说明是商家的优惠券
      switch (useScope) {
        case 0:
          goods = '全部商品'
          break;
        case 1:
          goods = '指定分类商品'
          break;
        case 2:
          goods = '指定商品'
          break;
      }
      return `${shop} ${goods} 可用`
    },
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/styles/coupon.scss';
.coupon-item{
  height: 125px;
  .c-left{
    padding: 16px;
  }
  .c-right{
    padding: 20px 16px;
    width: 43px;
    font-size: 14px;
  }
  .canot-use{
    color: #999;
    background-color: #eee;
  }
  i {
    right: 34px;
  }
}

.pageration {
  text-align: right;
}
</style>
