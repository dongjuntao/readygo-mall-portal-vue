<template>
  <div class="content-drawer">
    <div v-if="title === '购物车'" class="cart-con">
      <ul>
        <li v-for="(cartGoods,goodsIndex) in cartList" :key="goodsIndex">
          <div>
            <img :src="cartGoods.image" width="90" height="90" alt="">
          </div>
          <div>
            <p class="hover-color" @click="linkTo(`/goodsDetail?skuId=${cartGoods.goodsSkuId}&id=${cartGoods.goodsId}`)">{{cartGoods.name }}</p>
            <p class="price">{{cartGoods.sellingPrice | unitPrice('￥')}}<span>&nbsp; x{{cartGoods.count}}</span></p>
          </div>
          <span class="del hover-color" @click="deleteGoods(cartGoods.id)">删除</span>
        </li>
      </ul>
      <Button size="large" class="mt_10" type="primary" @click="linkTo('/cart')" long>去购物车结算</Button>
    </div>

    <div v-else-if="title === '我的订单'" class="order-con">
      <ul>
        <li v-for="(order,orderIndex) in orderList" :key="orderIndex">
          <div class="order-status"><span>{{filterOrderStatus(order.status)}}</span><span>{{order.createTime | formatDateTime}}</span></div>
          <div class="goods-img">
            <img :src="orderDetail.goodsImage"
              @click="linkTo(`/goodsDetail?skuId=${orderDetail.goodsSkuId}&id=${orderDetail.goodsId}`)"
              v-for="(orderDetail,imgIndex) in order.orderDetailList"
              :key="imgIndex" width="40" height="40" alt="">
          </div>
          <div class="order-handle"><span>{{ order.flowPrice | unitPrice("￥") }}</span><span class="hover-color" @click="linkTo(`home/OrderDetail?code=${order.code}`)">查看订单</span></div>
        </li>
      </ul>
      <Button type="primary" @click="linkTo('/home/MyOrder')" long>查看全部订单</Button>
    </div>

    <div v-else-if="title === '优惠券'" class="coupon-con">
      <ul class="coupon-list">
          <li v-for="(coupon, index) in couponList" class="coupon-item" :key="index">
            <div class="c-left">
              <div>
                <span v-if="coupon.type === 0" class="fontsize_12 global_color">￥<span class="price">{{coupon.discountAmount | unitPrice}}</span></span>
                <span v-if="coupon.type === 1" class="fontsize_12 global_color"><span class="price">{{coupon.discountAmount}}</span>折</span>
                <span class="describe">满{{coupon.minConsumption}}元可用</span>
              </div>
              <p>使用范围：{{useScope(coupon.source, coupon.useScope, coupon.merchantName)}}</p>
              <p>有效期：{{coupon.validPeriodEnd}}</p>
            </div>
            <b></b>
            <a class="c-right" @click="receiveCoupon(coupon)">立即领取</a>
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
    </div>
    <div v-else-if="title === '我的足迹'" class="tracks-con">
      <ul>
        <li v-for="(track,trackIndex) in tracksList" :key="trackIndex">
          <img :src="track.footprintGoodsVO.image" :alt="track.footprintGoodsVO.image"
               @click="linkTo(`/goodsDetail?skuId=${track.footprintGoodsVO.skuId}&id=${track.goodsId}`)" width="100" height="100">
          <div @click="addShoppingCartBtn(track.goodsId, track.footprintGoodsVO.skuId, track.merchantId)">加入购物车</div>
          <p class="global_color">{{track.footprintGoodsVO.price | unitPrice('￥')}}</p>
        </li>
      </ul>
      <div class="hover-color" style="text-align:center;" @click="linkTo('/home/MyTracks')">查看更多>></div>
    </div>
    <div v-else-if="title === '我的收藏'" class="collect-con">
      <ul>
        <li v-for="(collect,collectIndex) in collectList" :key="collectIndex">
          <img :src="collect.collectGoodsVO.image" :alt="collect.collectGoodsVO.image"
               @click="linkTo(`/goodsDetail?skuId=${collect.collectGoodsVO.skuId}&id=${collect.goodsId}`)" width="100" height="100">
          <div @click="addShoppingCartBtn(collect.goodsId, collect.collectGoodsVO.skuId, collect.merchantId)">加入购物车</div>
          <span class="del-icon" @click.stop="cancelCollect(collect.goodsId)">
            <Icon type="md-trash" />
          </span>
          <p class="global_color">{{collect.collectGoodsVO.price | unitPrice('￥')}}</p>
        </li>
      </ul>
      <div class="hover-color" style="text-align:center;" @click="linkTo('/home/Favorites')">查看更多>></div>
    </div>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import {deleteCart, getCartList, saveCart} from '@/api/mall-cart/cart'
import { getOrderList, cancelOrder, deleteOrder } from "@/api/mall-order/order"
import { getCouponList } from '@/api/mall-coupon/coupon';
import { receiveCoupon, getReceivedCouponList } from '@/api/mall-member/coupon-received'
import { getFootprintList, deleteFootprint } from '@/api/mall-member/footprint'
import {deleteCollectGoods, goodsListAll} from '@/api/mall-member/collect-goods'


export default {
  name: 'Drawer',
  props: {
    title: {
      default: '',
      type: String
    }
  },
  watch: {
    title (val) {
      switch (val) {
        case '购物车':
          this.getCartList()
          break;
        case '我的订单':
          this.getOrderList()
          break;
        case '我的足迹':
          this.getFootprintList()
          break;
        case '优惠券':
          this.getCouponList()
          break;
        case '我的收藏':
          this.getCollectList()
          break;
      }
    }
  },
  data () {
    return {
      loading: false, // 控制spin显隐
      cartList: [], // 购物车列表
      couponList: [], // 优惠券列表
      orderList: [], // 订单列表
      collectList: [], // 收藏列表
      tracksList: [], // 足迹列表
      orderStatusList: [ // 订单状态
        {
          name: '未付款',
          status: 'UNPAID'
        },
        {
          name: '已付款',
          status: 'PAID'
        },
        {
          name: '待发货',
          status: 'UNDELIVERED'
        },
        {
          name: '已发货',
          status: 'DELIVERED'
        },
        {
          name: '已完成',
          status: 'COMPLETED'
        },
        {
          name: '待核验',
          status: 'TAKE'
        },
        {
          name: '已取消',
          status: 'CANCELLED'
        }
      ]
    };
  },
  methods: {
    getCartList () { // 获取购物车列表
      var params = this.axios.paramsHandler({})
      getCartList(params).then(({data}) => {
        if (data && data.code=='200') {
          this.cartList = [];
          var result = data.data.cartMerchantList;
          if (result) {
            for (var i=0; i<result.length; i++) {
              var cartGoodsList = result[i].cartGoodsList;
              for (var j=0; j<cartGoodsList.length; j++) {
                this.cartList.push(cartGoodsList[j])
              }
            }
            this.cartNum = data.data.checkedTotalCount
          }else {
            this.cartNum = 0;
          }
        }
      });
    },

    //删除购物车商品
    deleteGoods(id) {
      var params;
      params = this.axios.paramsHandler({ deleteType: 0, cartGoodsId: id });
      deleteCart(params).then(({data}) => {
        if (data && data.code === "200") {
          this.$Message.success('删除成功');
          this.getCartList();
        } else {
          this.$Message.error(data.message)
        }
      });
    },

    filterOrderStatus (status) { // 获取订单状态中文
      const ob = this.orderStatusList.filter(e => { return e.status === status });
      return ob[0].name
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
    },

    // 优惠券可用范围
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

    //加入购物车
    addShoppingCartBtn(goodsId, goodsSkuId, merchantId) {
      var params = this.axios.paramsHandler({
        merchantId: merchantId
      });
      var data = this.axios.dataHandler({
        goodsId: goodsId,
        goodsSkuId: goodsSkuId,
        count: 1
      });
      this.loading = true;
      saveCart(params,data).then(({data}) => {
        this.loading = false;
        if (data && data.code == '200') {
          this.$router.push({
            path: "/shoppingCart",
            query: { detail: this.goodsDetail, count: this.count },
          });
        } else {
          this.$Message.warning(data.message);
        }
      }).catch(() => {
        this.loading = false;
      });
    },

    // 获取优惠券列表
    getCouponList () {
      this.loading = true;
      var params = this.axios.paramsHandler({
        authStatus: 1,
        pageNo: 1,
        pageSize: 100
      });//审核通过的优惠券,最多取一百个
      getCouponList(params).then(({data}) => {
        this.loading = false
        if (data && data.code == '200') {
          this.couponList = data.data.list
        }
      }).catch(() => { this.loading = false })
    },

    // 获取订单列表
    getOrderList () {
      this.loading = true
      var params = this.axios.paramsHandler({
        pageNo: 1,
        pageSize: 10,
        status: ""
      });
      getOrderList(params).then(({data}) => {
        this.loading = false
        if (data && data.code == 200) {
          this.orderList = data.data.list;
          console.log("this.orderList == ", this.orderList)
        }
      });
    },

    // 获取收藏列表
    getCollectList () {
      this.loading = true
      var params = this.axios.paramsHandler({});
      goodsListAll(params).then(({data}) => {
        if (data && data.code == '200') {
          this.loading = false
          this.collectList = data.data
          console.log("this.collectList == ", this.collectList)
        }
      });
    },

    // 取消收藏
    cancelCollect (id) {
      var postData = this.axios.paramsHandler({goodsId: id});
      deleteCollectGoods(postData).then(({data}) => {
        if (data && data.code == '200') {
          this.getCollectList();
        }
      });
    },

    //获取会员足迹
    getFootprintList() {
      this.loading = true
      var params = this.axios.paramsHandler({pageNo: this.pageNo, pageSize: this.pageSize});
      getFootprintList(params).then(({data}) => {
        if (data && data.code=='200') {
          this.tracksList = data.data.list;
          this.loading = false
        } else {
          this.loading = false
          this.$Message.error(data.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../assets/styles/coupon.scss';
@import './drawer.scss';
.coupon-item{
  overflow: hidden;
  background-color: #fff;
  height: 120px;
  .c-left{
    padding: 15px;
  }
  .c-right{
    width: 38px;
    padding: 13px;
    font-size: 14px;
  }
  i{
    right: 30px;
    background-color: #eee;
  }
}
</style>
