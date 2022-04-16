<template>
  <div class="model-item" v-if="element && element.key">
    <!-- 轮播图模块，包括个人信息，快捷导航模块 -->
    <template v-if="element.type == 'carousel'">
      <model-carousel :data="element" class="mb_20 width_1200_auto"></model-carousel>
    </template>
    <!-- 限时秒杀 待完善 -->
    <template v-if="element.type == 'seckill' && element.options.list.length">
      <seckill :data="element"  class="mb_20 width_1200_auto"></seckill>
    </template>
    <!-- 好货推荐 -->
    <template v-if="element.type == 'goodsRecommend'">
      <recommend :data="element" class="mb_20 width_1200_auto"></recommend>
    </template>
    <!-- 新品排行 -->
    <template v-if="element.type == 'newGoodsSort'">
      <new-goods-sort :data="element" class="mb_20 width_1200_auto"></new-goods-sort>
    </template>
    <!-- 优惠多多 -->
    <template v-if="element.type == 'manyDiscounts'">
      <many-discounts :data="element" class="mb_20 width_1200_auto"></many-discounts>
    </template>
  </div>
</template>

<script>
import ModelCarousel from './modelList/Carousel.vue';
import NewGoodsSort from './modelList/NewGoodsSort.vue';
import Recommend from './modelList/Recommend.vue';
import Seckill from './modelList/Seckill.vue';
import ManyDiscounts from './modelList/ManyDiscounts'

export default {
  name: 'modelFormItem',
  props: ['element', 'select', 'index', 'data'],
  components: {
    ModelCarousel,
    Recommend,
    NewGoodsSort,
    ManyDiscounts,
    Seckill
  },
  data () {
    return {
      showModal: false, // 控制模态框显隐
      selected: {} // 已选数据
    };
  }
};
</script>
<style lang="scss" scoped>

.model-item {
  position: relative;
  margin-bottom: 10px;
}

.width_1200_auto{
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
}
</style>
