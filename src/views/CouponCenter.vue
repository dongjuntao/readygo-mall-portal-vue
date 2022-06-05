<template>
  <div class="coupon-center">
    <BaseHeader></BaseHeader>
    <div class="content">
      <div>
        <div class="coupon-title">
          <router-link to="/">
            <img src="../assets/images/logo.png" width="120" alt="">
          </router-link>
          <p>领券中心</p>
          <Input search style="width:400px" @on-search='search' enter-button="搜索" placeholder="搜索优惠券" />
        </div>

        <div class="fontsize_18 recommend">推荐好券</div>

        <empty v-if="list.length===0" />
        <ul class="coupon-list" v-else>
          <li v-for="(item, index) in list" class="coupon-item" :key="index">
            <div class="c-left">
              <div>
                <span v-if="item.type === 0" class="fontsize_12 global_color">￥<span class="price">{{item.discountAmount | unitPrice}}</span></span>
                <span v-if="item.type === 1" class="fontsize_12 global_color"><span class="price">{{item.discountAmount}}</span>折</span>
                <span class="describe">满{{item.minConsumption}}元可用</span>
              </div>
              <p>使用范围：{{useScope(item.source, item.useScope, item.merchantName)}}</p>
              <p>有效期至：{{item.validPeriodEnd | formatDateTime}}</p>
            </div>
            <b></b>
            <a class="c-right" @click="receiveCoupon(item)">立即领取</a>
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
        <Page :total="total" @on-change="changePageNum"
          class="pagination"
          @on-page-size-change="changePageSize"
          :page-size="pageSize"
          show-total
          show-sizer>
        </Page>
      </div>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>
// import {couponList, receiveCoupon} from '@/api/member.js'

import { getCouponList } from '@/api/mall-coupon/coupon';
import { receiveCoupon, getReceivedCouponList } from '@/api/mall-member/coupon-received'

export default {
  data () {
    return {
      list: [], // 优惠券列表
      total: 0, // 优惠券总数
      pageNo: 1,
      pageSize: 10,
      name: '',
    }
  },
  methods: {

    //新增的----------------------------start-----------
    getList () {
      this.$Spin.show();
      var params = this.axios.paramsHandler({
        authStatus: 1,
        name: this.name,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      });//审核通过的优惠券
      getCouponList(params).then(({data}) => {
        this.$Spin.hide()
        this.loading = false
        if (data && data.code == '200') {

          this.list = data.data.list
          this.total = data.data.totalCount
          console.log("this.list = ", this.list)
        }
      }).catch(() => { this.$Spin.hide() })
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
    //新增的-----------------------------end------------

    // 搜索优惠券
    search (item) {
      this.name = item
      this.pageNo = 1
      this.getList()
    },

    // 分页 改变页码
    changePageNum (val) {
      this.pageNo = val;
      this.getList()
    },
    // 分页 改变每页数
    changePageSize (val) {
      this.pageNo = 1;
      this.pageSize = val;
      this.getList()
    },
    // 领取优惠券
    receiveCoupon (item) {
      var params = this.axios.paramsHandler({ couponId: item.id });
      receiveCoupon(params).then(({data}) => {
        if (data && data.code == '200') {
          this.$Modal.confirm({
            title: '领取优惠券',
            content: '<p>优惠券领取成功，可到我的优惠券页面查看</p>',
            okText: '我的优惠券',
            cancelText: '立即使用',
            closable: true,
            onOk: () => {
              this.$router.push('/home/Coupons')
            },
            onCancel: () => {
              if (item.storeId !== 'platform') {
                this.$router.push({path: '/merchant', query: {id: item.storeId}})
              } else {
                if (item.scopeType === 'PORTION_GOODS_CATEGORY') {
                  this.$router.push({path: '/goodsList', query: {categoryId: item.scopeId}})
                } else {
                  this.$router.push({path: '/goodsList'})
                }
              }
            }
          });
        } else {
          this.$Message.error(data.message);
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/styles/coupon.scss';
  .content{
    width: 100%;
    background-color: #fff;

    > div {
      margin: 10px auto;
      width: 1200px;
    }
  }
  .coupon-title {
    display: flex;
    align-items: center;

    p{
      font-size: 18px;
      margin-right: 500px;
    }
    border-bottom: 2px solid $theme_color;
  }
  .recommend {
    margin: 20px auto;
    font-weight: bold;
    width: 200px;
    text-align: center;
  }
  .coupon-item {
    b{
      background: url('../assets/images/small-circle.png') top left repeat-y;
    }
  }
  .pagination {
    text-align: right;
    padding-bottom: 10px;
  }
</style>
