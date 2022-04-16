<template>
  <div style="background:#fff;">
    <BaseHeader></BaseHeader>
    <Search></Search>
    <drawer></drawer>
    <ShopHeader :detail="storeMsg"></ShopHeader>
    <div class="shop-item-path">
      <div class="shop-nav-container">
        <Breadcrumb>
          <BreadcrumbItem to="/">首页</BreadcrumbItem>
        </Breadcrumb>
        <div class="store-collect">
          <span class="mr_10" v-if="goodsMsg.data">
            <router-link :to="'Merchant?id=' + goodsMsg.data.storeId">{{ goodsMsg.data.storeName }}</router-link>
          </span>
          <span @click="collect">
            <Icon type="ios-heart" :color="storeCollected ? '#ed3f14' : '#666'" />
            {{storeCollected ? '已收藏店铺' : '收藏店铺'}}
          </span>
          <!--
               先看下udesk merchantEuid 是否有值
               有的话 链接udesk
               没有的话 显示云智服
           -->
          <span class="ml_10" v-if="storeMsg.merchantEuid" @click="IMService()">联系客服</span>

          <span v-else @click="connectCs(storeMsg.yzfSign)" class="ml_10">
            <Icon custom="icomoon icon-customer-service" />联系客服
          </span>
        </div>
      </div>
    </div>
    <!-- 商品信息展示 -->
    <ShowGoods v-if="goodsMsg.data" :detail="goodsMsg"></ShowGoods>
    <!-- 商品详细展示 -->
    <ShowGoodsDetail v-if="goodsMsg.data" :detail="goodsMsg"></ShowGoodsDetail>

    <Spin size="large" fix v-if="isLoading"></Spin>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import Search from "@/components/Search";
import ShopHeader from "@/components/header/ShopHeader";
import ShowGoods from "@/components/goodsDetail/ShowGoods";
import ShowGoodsDetail from "@/components/goodsDetail/ShowGoodsDetail";
// import { goodsSkuDetail } from "@/api/goods";
import { getGoodsById } from '@/api/mall-goods/goods'

import {
  cancelCollect,
  collectGoods,
  isCollection,
  getGoodsDistribution,
} from "@/api/member";
import { getDetailById } from "@/api/shopentry";
import { getIMDetail } from "@/api/common";
export default {
  name: "GoodsDetail",
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  created() {
    this.getGoodsDetail();
    // this.getIMDetailMethods();
  },
  data() {
    return {
      goodsMsg: {}, // 商品信息
      isLoading: false, // 加载状态
      storeCollected: false, // 商品收藏
      storeMsg: {}, // 店铺信息
      IMLink: "",
    };
  },
  methods: {
    // 跳转im客服
    IMService() {
      window.open(this.IM);
    },
    // 获取im信息
    async getIMDetailMethods() {
      let res = await getIMDetail();
      if (res.success) {
        this.IMLink = res.result;
      }
    },
    // 获取商品详情
    getGoodsDetail() {
      this.isLoading = true;
      const params = this.$route.query;
      getGoodsById(params).then((res) => {
        this.isLoading = false;
        if (res && res.code == '200') {
          this.goodsMsg = res;
          // 判断是否收藏
          // if (this.Cookies.getItem("userInfo")) {
          //   isCollection("STORE", this.goodsMsg.data.storeId).then((res) => {
          //     if (res.success && res.result) {
          //       this.storeCollected = true;
          //     }
          //   });
          // }
          // 获取店铺信息
          // getDetailById(this.goodsMsg.data.storeId).then((res) => {
          //   if (res.success) {
          //     this.storeMsg = res.result;
          //   }
          // });
        } else {
          this.$Message.error(res.message);
          this.$router.push("/");
        }
      }).catch(() => {
        this.$router.push("/");
      });
    },

    async collect() {
      // 收藏店铺
      if (this.storeCollected) {
        let cancel = await cancelCollect("STORE", this.goodsMsg.data.storeId);
        if (cancel.success) {
          this.$Message.success("已取消收藏");
          this.storeCollected = false;
        }
      } else {
        let collect = await collectGoods("STORE", this.goodsMsg.data.storeId);
        if (collect.code === 200) {
          this.storeCollected = true;
          this.$Message.success("收藏店铺成功,可以前往个人中心我的收藏查看");
        }
      }
    },
  },
  watch: {
    "$route.query.skuId": function (val) {
      location.reload();
    },
  },
  computed: {
    IM() {
      return this.IMLink + this.storeMsg.merchantEuid;
    },
  },
  components: {
    Search,
    ShopHeader,
    ShowGoods,
    ShowGoodsDetail,
  },
};
</script>
<style scoped lang="scss">
.shop-item-path {
  height: 38px;
  @include background_color($light_background_color);
  line-height: 38px;
  color: #2c2c2c;
}

.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
  position: relative;

  .store-collect {
    position: absolute;
    right: 20px;
    top: 0;
    color: #999;

    span {
      &:hover {
        cursor: pointer;
        color: $theme_color;
      }
    }
  }
}
</style>
