<template>
  <div class="recommend">
    <div class="recommend-div">
      <div class="head-recommend" :style="{ background: goodsRecommend.bgColor }">
        <span>{{ goodsRecommend.name }}</span>
        <span class="hover-pointer" @click="linkTo(goodsRecommend.url)">{{ goodsRecommend.secondName }}&gt;</span>
      </div>
      <div class="recommend-content">
        <template v-for="(item, index) in goodsRecommend.data">
          <div v-if="item" :key="index" @click="goGoodsDetail(item.goodsSkuList[0].id, item.id)" class="hover-pointer">
            <img :src="item.images.split(',')[0]" width="90" height="90" alt="" />
            <div>
              <div>{{ item.name.length>50 ? item.name.substring(0,50)+"..." : item.name }}</div>
              <div style="color: red;">¥ {{ item.goodsSkuList[0].sellingPrice }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      goodsRecommend: this.data //商品推荐
    };
  },
  methods: {
    goGoodsDetail (skuId, goodsId) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId: skuId, id: goodsId }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
  .recommend {
    display: flex;
    justify-content: space-between;
    .recommend-div {
      width: 100%;
      .recommend-content {
        display: flex;
        padding-top: 10px;
        font-size: 12px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        > div {
          display: flex;
          align-items: center;
          width: 240px;
          height: 120px;
          img {
            margin: 0 10px;
          }
          > div:nth-child(2) {
            :nth-child(2) {
              color: #449dae;
            }
          }
        }
      }
    }
  .head-recommend {
    display: flex;
    opacity: 90%;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 10px;
    background: #ee3f3f;
    color: #fff;
    span:nth-child(1) {
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 12px;
    }
  }
}
</style>
