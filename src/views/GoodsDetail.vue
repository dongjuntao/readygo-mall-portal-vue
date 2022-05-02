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
            <Icon type="ios-heart" :color="isCollected ? '#ed3f14' : '#666'" />
            {{isCollected ? '已收藏店铺' : '收藏店铺'}}
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
import { getGoodsById } from '@/api/mall-goods/goods'

import {
  cancelCollect,
  collectGoods,
  isCollection,
  getGoodsDistribution,
} from "@/api/member";
import { getDetailById } from "@/api/shopentry";
import { getIMDetail } from "@/api/common";
import {deleteCollectGoods, saveCollectGoods} from '@/api/mall-member/collect-goods'
import { saveCollectShop, deleteCollectShop, isCollected } from '@/api/mall-member/collect-shop'
import {getUserInfo} from '@/utils/auth'

export default {
  name: "GoodsDetail",
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  async created() {
    await this.getGoodsDetail();
    // this.getIMDetailMethods();
    await this.collected();
  },
  data() {
    return {
      goodsMsg: {}, // 商品信息
      isLoading: false, // 加载状态
      isCollected: false, // 店铺收藏
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
    async getGoodsDetail() {
      this.isLoading = true;
      const params = this.$route.query;
      await getGoodsById(params).then(({data}) => {
        this.isLoading = false;
        if (data && data.code == '200') {
          this.goodsMsg = data;
        } else {
          this.$Message.error(data.message);
          this.$router.push("/");
        }
      }).catch(() => {
        this.$router.push("/");
      });
    },

    async collect() {
      // 取消收藏店铺
      if (this.isCollected) {
        var postData = this.axios.paramsHandler({merchantId: this.goodsMsg.data.adminUserId});
        deleteCollectShop(postData).then(({data}) => {
          if (data && data.code == '200') {
            this.isCollected = false
          }
        });
      } else { //收藏店铺
        var postData = this.axios.dataHandler({ merchantId: this.goodsMsg.data.adminUserId });
        saveCollectShop(postData).then(({data}) => {
          if (data && data.code == '200') {
            this.isCollected = true
          }
        });
      }
    },

    /**
     * 判断是否已收藏店铺
     */
    async collected () {
      // 用户登录才会判断是否收藏
      if (getUserInfo(sessionStorage.getItem("userNameKey"))) {
        var params = await this.axios.paramsHandler({ merchantId: this.goodsMsg.data.adminUserId });
        isCollected(params).then(({data}) => {
          if (data && data.code == '200') {
            this.isCollected = data.data
          }
        });
      }
    }
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
  }
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
