<template>
  <div class="pay-order">
    <BaseHeader></BaseHeader>
    <!-- LOGO 步骤条 -->
    <div class="width_1200 logo">
      <div>
        <router-link to="/"><img :src="$store.state.logoImg" /></router-link>
        <div>结算页</div>
      </div>
      <div class="cart-steps">
        <span :class="stepIndex == 1 ? 'active' : ''">1.我的购物车</span>
        <Icon
          :class="stepIndex == 1 ? 'active-arrow' : ''"
          custom="icomoon icon-next"
        ></Icon>
        <span :class="stepIndex == 1 ? 'active' : ''">2.填写订单信息</span>
        <Icon
          :class="stepIndex == 1 ? 'active-arrow' : ''"
          custom="icomoon icon-next"
        ></Icon>
        <span :class="stepIndex == 2 ? 'active' : ''">3.成功提交订单</span>
      </div>
    </div>
    <Divider />
    <div class="content width_1200">
      <!-- 收货地址 -->
      <div class="address">
        <div class="card-head">
          <span>收货人信息</span>
          <span @click="goAddressManage">管理收货人地址</span>
        </div>
        <div class="address-manage">
          <div
            class="address-item"
            v-show="moreAddr ? true : index < 3"
            :class="selectedAddress.id === item.id ? 'border-red' : ''"
            @mouseenter="showEditBtn = index"
            @mouseleave="showEditBtn = ''"
            @click="selectAddress(item)"
            v-for="(item, index) in addressList"
            :key="index"
          >
            <div>
              <span>{{ item.name }}</span>
              <Tag class="ml_10" v-if="item.isDefault" color="red">默认</Tag>
              <Tag class="ml_10" v-if="item.addressAlias" color="warning">{{ item.addressAlias }} </Tag>
            </div>
            <div>{{ item.mobile }}</div>
            <div>{{ item.regionNames }} {{ item.detailAddress }}</div>
            <div class="edit-btn" v-show="showEditBtn === index">
              <span @click.stop="editAddress(item.id)">修改</span>
              <span class="ml_10" v-if="!item.isDefault" @click.stop="delAddress(item)"
                >删除</span
              >
            </div>
            <div class="corner-icon" v-show="selectedAddress.id === item.id">
              <div></div>
              <Icon type="md-checkmark" />
            </div>
          </div>
          <div class="add-address" @click="editAddress('')">
            <Icon type="ios-add-circle-outline" />
            <div>添加新地址</div>
          </div>
        </div>

        <div
          class="more-addr"
          @click="moreAddr = !moreAddr"
          v-if="addressList.length > 3"
        >
          {{ moreAddr ? "收起地址" : "更多地址" }}
          <Icon v-show="!moreAddr" type="md-arrow-dropdown" />
          <Icon v-show="moreAddr" type="md-arrow-dropup" />
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="goods-content">
        <div class="card-head mt_20 mb_20">
          <span>商品信息</span>
          <span @click="$router.push('/cart')">返回购物车</span>
        </div>

        <div style="border-bottom: 2px solid #b2d1ff;">
          <span class="goods-title" style="margin-left: 300px;">商品信息</span>
          <span class="width_150" style="margin-left: 500px;">单价（元）</span>
          <span class="width_100" style="margin-left: 50px;">数量</span>
          <span class="width_150" style="margin-left: 100px;">小计</span>
        </div>

        <div class="goods-msg" v-for="(shop, shopIndex) in goodsList" :key="shopIndex">
          <div class="shop-name">
            <span>
              <span class="hover-color" @click="goShopPage(shop.merchantId)">商家： {{shop.merchantName}}</span>&nbsp;&nbsp;
            </span>
          </div>

          <div class="goods-list">
            <div
              class="goods-item"
              v-for="(goods, goodsIndex) in shop.payGoodsList"
              :key="goodsIndex"
            >
              <span
                class="hover-color"
                @click="goGoodsDetail(goods.goodsSkuId, goods.goodsId)"
              >
                <img :src="goods.image" alt="" />
                <span style="vertical-align: top">{{ goods.name }}</span>
              </span>
              <span class="goods-price">{{ goods.sellingPrice | unitPrice("￥") }}</span>
              <span>x{{ goods.count }}</span>
              <span class="goods-price">{{ goods.subTotal | unitPrice("￥") }}</span>
            </div>
          </div>
          <div class="order-mark">
            <Input
              type="textarea"
              maxlength="60"
              v-model="shop.remark"
              show-word-limit
              placeholder="订单备注"
            />
            <span style="font-size: 12px; color: #999"
              >提示：请勿填写有关支付、收货、发票方面的信息</span
            >
          </div>
        </div>
      </div>
      <!-- 发票信息 -->
      <div class="invoice">
        <div class="card-head mt_20 mb_20">
          <span class="relative"
            >发票信息<span class="inv-tips">
              <Icon
                type="ios-alert-outline"
              />开企业抬头发票须填写纳税人识别号，以免影响报销
            </span></span
          >
        </div>
        <div class="inovice-content">
          <span>{{ invoiceData.invoiceTitle }}</span>
          <span v-if="invoiceData.invoiceContent == 0">{{'商品明细'}}</span>
          <span v-else-if="invoiceData.invoiceContent == 1">{{'商品类别'}}</span>
          <span v-else>无需发票</span>
          <span @click="editInvoice">编辑</span>
        </div>
      </div>
      <!-- 优惠券 -->
      <div class="invoice">
        <div class="card-head mt_20 mb_20">
          <span class="relative">优惠券</span>
        </div>
        <div v-if="couponList.length === 0">无可用优惠券</div>
        <ul v-else class="coupon-list">
          <li v-for="(item, index) in couponList" class="coupon-item" :key="index">
            <div class="c-left">
              <div>
                <span v-if="item.type === 0" class="fontsize_12 global_color">￥<span class="price">{{ item.discountAmount | unitPrice }}</span></span>
                <span v-if="item.type === 1" class="fontsize_12 global_color"><span class="price">{{ item.discountAmount }}</span>折</span>
                <span class="describe">满{{ item.minConsumption }}元可用</span>
              </div>
              <p>使用范围：{{ useScope(item.source, item.useScope, item.merchantName) }}</p>
              <p>有效期至：{{ item.validPeriodEnd | formatDateTime }}</p>
            </div>
            <img
              class="used"
              v-if="usedCouponId.includes(item.id)"
              src="../../assets/images/geted.png"
              alt=""
            />
            <b></b>
            <a class="c-right" @click="useCoupon(item.id, true)">立即使用</a>
            <a
              class="c-right"
              v-if="usedCouponId.includes(item.id)"
              @click="useCoupon(item.id, false)"
              >放弃优惠</a
            >
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
      </div>
      <!-- 订单价格 -->
      <div class="order-price">
        <div>
          <span>{{ totalCount }}件商品，总商品金额：</span
          ><span>{{ totalPrice | unitPrice("￥") }}</span>
        </div>
        <div v-if="priceDetailDTO.freightPrice > 0">
          <span>运费：</span
          ><span>{{ priceDetailDTO.freightPrice | unitPrice("￥") }}</span>
        </div>
        <div v-if="discountPrice > 0">
          <span>优惠券金额：</span
          ><span>-{{ discountPrice | unitPrice("￥") }}</span>
        </div>
<!--        <div v-if="priceDetailDTO.discountPrice > 0">-->
<!--          <span>优惠金额：</span-->
<!--          ><span>-{{ priceDetailDTO.discountPrice | unitPrice("￥") }}</span>-->
<!--        </div>-->
<!--        <div v-if="$route.query.way === 'POINTS'">-->
<!--          <span>应付积分：</span-->
<!--          ><span class="actrual-price">{{ priceDetailDTO.payPoint }}</span>-->
<!--        </div>-->
        <div>
          <span>应付金额：</span
          ><span class="actrual-price">{{
            finalPrice ? finalPrice : totalPrice | unitPrice("￥")
          }}</span>
        </div>
      </div>
    </div>
    <!-- 底部支付栏 -->
    <div class="order-footer width_1200">
      <div class="pay ml_20" @click="pay">提交订单</div>
      <div class="pay-address" v-if="addressList.length">
        配送至：{{ selectedAddress.regionNames }}
        {{ selectedAddress.detailAddress }}&nbsp;&nbsp;收货人：{{
          selectedAddress.name
        }}&nbsp;&nbsp;{{ selectedAddress.mobile }}
      </div>
    </div>
    <BaseFooter></BaseFooter>
    <!-- 添加发票模态框 -->
    <invoice-modal ref="invModal" :invoiceData="invoiceData" @change="getInvMsg" />
    <!-- 选择地址模态框 -->
    <address-manage ref="address" :id="addrId" @change="addrChange"></address-manage>
  </div>
</template>

<script>
import invoiceModal from "@/components/invoiceModal";
import addressManage from "@/components/addressManage";
import { memberAddress, delMemberAddress } from "@/api/address";
import { cartGoodsPay, createTrade, selectAddr, couponNum} from "@/api/cart";
import { canUseCouponList } from "@/api/member.js";

import { getReceivedCouponList, getReceivedCouponListAll } from '@/api/mall-member/coupon-received'
import { getPayRecipientInfoList, selectAddress } from '@/api/mall-order/recipient_info'
import { getInvoiceByParams } from '@/api/mall-order/invoice'
// import { getPayCartList } from '@/api/mall-cart/cart'
import { getPayInfoGoods } from '@/api/mall-order/pay-info-goods'
import { getSelected, selectCoupon } from '@/api/mall-order/coupon_selected'

export default {
  name: "Pay",
  components: { invoiceModal, addressManage },
  data() {
    return {
      stepIndex: 1, // 顶部步骤条状态
      invoiceAvailable: false, // 发票编辑按钮
      showEditBtn: "", // 鼠标移入显示编辑按钮
      orderMark: "", // 订单备注
      invoiceData: { // 发票信息
        invoiceTitle: "个人",
        invoiceContent: "不开发票",
      },
      addressList: [], // 地址列表
      selectedAddress: {}, // 所选地址
      goodsList: [], // 商品列表
      priceDetailDTO: {}, // 商品价格
      totalCount: 0, // 购买数量
      totalPrice:0, //总价格
      finalPrice:0, //最终价格
      discountPrice: 0, //优惠券价格
      addrId: "", // 编辑地址传入的id
      moreAddr: false, // 更多地址
      canUseCouponNum: 0, // 可用优惠券数量
      couponList: [], // 可用优惠券列表
      usedCouponId: [], // 已使用优惠券id
      selectedCoupon: {}, // 已选优惠券对象
    };
  },
  mounted() {
    // this.init();

    //新加的-------------------
    this.getRecipientAddress();//收货人信息
    this.getPayCartList(); //商家及商品信息
    this.getInvoiceData(); //发票信息
    this.getCouponList(); //优惠券信息
  },
  methods: {

    //新加的---------------------------------------------start-------------------------------------
    //商家及商品信息
    getPayCartList() {
      var params =  this.axios.paramsHandler({});
      getPayInfoGoods(params).then(({data}) => {
          // getPayCartList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.totalPrice = data.data.totalPrice;
          this.totalCount = data.data.totalCount;
          this.finalPrice = data.data.finalPrice;
          this.discountPrice = data.data.discountPrice;
          this.goodsList = data.data.payMerchantList;
        } else {
          this.$Message.error(data.message)
        }
      });
    },
    //获取收货地址
    getRecipientAddress() {
      var params =  this.axios.paramsHandler({});
      getPayRecipientInfoList(params).then(({data}) => {
        if (data && data.code === "200") {
          this.addressList = data.data;
          this.addressList.forEach((e, index) => {
            if (e.selected) {
              this.selectedAddress = e;
            }
            if (e.id === this.selectedAddress.id && index > 2) {
              this.moreAddr = true;
            }
          });
        } else {
          this.$Message.error(data.message)
        }
      });
    },
    selectAddress(item) {
      var params =  this.axios.paramsHandler({ recipientInfoId: item.id});
      selectAddress(params).then(({data}) => {
        if (data && data.code === "200") {
          this.$Message.success("选择收货人信息成功")
          this.getRecipientAddress();
        } else {
          this.$Message.error(data.message)
        }
      });
    },
    //查询发票信息
    getInvoiceData() {
      var params =  this.axios.paramsHandler({});
      getInvoiceByParams(params).then(({data}) => {
        if (data && data.code === "200") {
          if (data.data) {
            this.invoiceData = data.data
          }
        } else {
          this.$Message.error(data.message)
        }
      });
    },
    //查询我的优惠券
    getCouponList() {
      var params = this.axios.paramsHandler({
        useStatus: 0 //查询未使用的发票
      })
      getReceivedCouponListAll(params).then(({data}) => {
        if (data && data.code === "200") {
          if (data.data) {
            this.couponList = data.data
            this.getSelected();
          }
        } else {
          this.$Message.error(data.message)
        }
      });
    },
    //立即使用 / 放弃使用 优惠券
    useCoupon(id, used) {
      var data = this.axios.dataHandler({receivedCouponId: id})
      var params = this.axios.paramsHandler({use: used})
      selectCoupon(data, params).then(({data}) => {
        if (data && data.code === "200") {
          this.getCouponList();
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    //获取已选择的优惠券信息
    getSelected() {
      var params = this.axios.paramsHandler({})
      getSelected(params).then(({data}) => {
        if (data && data.code === "200") {
          this.usedCouponId = []
         if (data.data && data.data.length>0) {
           this.usedCouponId.push(data.data[0].receivedCouponId);
         }
          this.getPayCartList()
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    //新加的-----------------------------------------------end---------------------------------------

    // 初始化数据
    init() {
      this.getGoodsDetail();
    },
    goAddressManage() {
      // 跳转地址管理页面
      this.$router.push("/home/MyAddress");
    },

    getGoodsDetail() {
      // 订单商品详情
      this.$Spin.show();
      cartGoodsPay({ way: this.$route.query.way })
        .then((res) => {
          this.$Spin.hide();
          if (res.success) {
            this.goodsList = res.result.cartList;
            this.priceDetailDTO = res.result.priceDetailDTO;
            this.skuList = res.result.skuList;

            if (res.result.receiptVO) {
              this.invoiceData = res.result.receiptVO;
            }
            let notSupArea = res.result.notSupportFreight;
            this.selectedCoupon = {};
            if (res.result.platformCoupon)
              this.selectedCoupon[res.result.platformCoupon.memberCoupon.id] = res.result.platformCoupon;
            if (res.result.storeCoupons && Object.keys(res.result.storeCoupons)[0]) {
              let storeMemberCouponsId = Object.keys(res.result.storeCoupons)[0];
              let storeCouponId = res.result.storeCoupons[storeMemberCouponsId].memberCoupon.id;
              this.selectedCoupon[storeCouponId] = res.result.storeCoupons[storeMemberCouponsId];
            }
            if (notSupArea) {
              let content = [];
              let title = "";
              notSupArea.forEach((e) => {
                title = e.errorMessage;
                content.push(e.goodsSku.goodsName);
              });
              this.$Modal.warning({
                title: "以下商品超出配送区域" || title,
                content: content.toString(),
              });
            }
            if (res.result.memberAddress) {
              this.selectedAddress = res.result.memberAddress;
            }
            this.getAddress();
            this.totalNum = 0;
            for (let i = 0; i < this.skuList.length; i++) {
              this.totalNum += this.skuList[i].num;
            }
            this.usedCouponId = [];
            this.couponList = res.result.canUseCoupons;
            const couponKeys = Object.keys(this.selectedCoupon);
            if (couponKeys.length) {
              this.couponList.forEach((e) => {
                if (this.selectedCoupon[e.id] && e.id === this.selectedCoupon[e.id].memberCoupon.id) {
                  this.usedCouponId.push(e.id);
                }
              });
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          }
        })
        .catch(() => {
          this.$Spin.hide();
        });
    },
    getCouponNum() {
      // 获取可用优惠券数量
      couponNum({ way: this.$route.query.way }).then((res) => {
        this.canUseCouponNum = res.result;
        if (res.result) {
          let storeArr = [];
          let skuArr = [];
          this.goodsList.forEach((e) => {
            storeArr.push(e.storeId);
            e.skuList.forEach((i) => {
              skuArr.push(i.goodsSku.id);
            });
          });
          let params = {
            pageNumber: 1,
            pageSize: 100,
            memberCouponStatus: "NEW",
            scopeId: skuArr.toString(),
            storeId: storeArr.toString(),
            totalPrice: this.priceDetailDTO.goodsPrice,
          };
          canUseCouponList(params).then((res) => {
            // 可用优惠券列表
            if (res.success) this.couponList = res.result.records;
            const couponKeys = Object.keys(this.selectedCoupon);
            this.usedCouponId = [];
            if (couponKeys.length) {
              this.couponList.forEach((e) => {
                if (e.id === this.selectedCoupon[couponKeys].memberCoupon.id) {
                  this.usedCouponId.push(e.id);
                }
              });
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          });
        }
      });
    },

    editAddress(id) {
      // 编辑地址
      this.addrId = id;
      this.$refs.address.show();
    },
    addrChange() {
      // 添加，编辑地址回显
      this.getAddress();
    },
    delAddress(item) {
      // 删除地址
      this.$Modal.confirm({
        title: "提示",
        content: "你确定删除这个收货地址",
        onOk: () => {
          delMemberAddress(item.id).then((res) => {
            if (res.success) {
              this.$Message.success("删除成功");
              this.getAddress();
            }
          });
        },
        onCancel: () => {},
      });
    },
    goGoodsDetail(skuId, goodsId) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 跳转店铺首页
    goShopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: { id: id },
      });
      window.open(routeUrl.href, "_blank");
    },
    // useCoupon(id, used) {
    //   // 使用优惠券
    //   let params = {
    //     way: this.$route.query.way,
    //     memberCouponId: id,
    //     used: used, // true 为使用， false为弃用
    //   };
    //   selectCoupon(params).then((res) => {
    //     if (res.success) this.init();
    //   });
    // },
    // 编辑发票信息
    editInvoice() {
      this.$refs.invModal.invoiceAvailable = true;
    },
    // 获取发票信息
    getInvMsg(item) {
      if (item) {
        this.getInvoiceData()
        this.$refs.invModal.invoiceAvailable = false;
      }
    },

    pay() {
      // 结算
      const params = {
        client: "PC",
        remark: [],
        way: this.$route.query.way,
      };
      this.goodsList.forEach((e) => {
        if (e.remark) {
          params.remark.push({
            remark: e.remark,
            storeId: e.storeId,
          });
        }
      });

      if (!params.remark.length) delete params.remark;

      this.$Spin.show();
      createTrade(params)
        .then((res) => {
          this.$Spin.hide();
          if (res.success) {
            if (params.way === "POINTS") {
              // 积分支付不需要跳转支付页面
              this.$router.push("/payDone");
            } else {
              this.$router.push({
                path: "/payment",
                query: { orderType: "TRADE", sn: res.result.sn },
              });
            }
          }
        })
        .catch(() => {
          this.$Spin.hide();
        });
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
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/coupon.scss";
.goods-msg {
  border-bottom: 1px dashed red;
  overflow: hidden;
}
/** logo start */
.logo {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 0;

  div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 150px;
      height: auto;
      cursor: pointer;
    }

    div:nth-child(2) {
      width: 200px;
      color: #999;
      font-size: 16px;
      margin: 0 20px;

      span {
        color: $theme_color;
      }
    }
  }
}

.cart-steps {
  height: 30px;
  display: flex;
  align-items: center;

  span {
    @include content_color($light_content_color);
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    padding: 0 15px;
  }

  .ivu-icon {
    @include content_color($light_content_color);
    font-size: 20px;
    margin: 0 15px;
  }

  .active {
    border-radius: 50px;
    background-color: #ff8f23;
    color: #fff;
  }

  .active-arrow {
    color: #ff8f23;
  }
}

/** logo end */
/** content start */
.content {
  margin: 20px auto;
  background-color: #fff;
  min-height: 200px;
  padding: 15px 25px;
}

/** 地址管理 */
.address-manage {
  display: flex;
  flex-wrap: wrap;

  > div {
    border: 1px dotted #949494;
    width: 265px;
    height: 120px;
    margin: 20px 20px 0 0;
    padding: 10px;
    cursor: pointer;
    color: #999;
  }

  .add-address {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .ivu-icon {
      font-size: 24px;
    }
  }

  .address-item {
    position: relative;
    font-size: 12px;

    > div:nth-child(1) {
      margin-bottom: 10px;

      span {
        margin-right: 10px;
      }

      > span:nth-child(1) {
        color: #000000;
        font-size: 14px;
      }
    }

    .edit-btn {
      font-size: 12px;
      position: absolute;
      top: 15px;
      right: 20px;
      color: $theme_color;

      span:hover {
        border-bottom: 1px solid $theme_color;
      }
    }

    .corner-icon {
      position: absolute;
      right: -1px;
      bottom: -1px;

      div {
        width: 0;
        border-top: 20px solid transparent;
        border-right: 20px solid $theme_color;
      }

      .ivu-icon {
        font-size: 12px;
        position: absolute;
        bottom: 0;
        right: 1px;
        transform: rotate(-15deg);
        color: #fff;
      }
    }
  }

  .border-red {
    border-color: $theme_color;
  }
}

/** 购买商品列表 start */
.shop-name {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;

  > span:nth-child(1) {
    font-size: 13px;
    font-weight: bold;

    .ivu-icon {
      color: #ff8f23;

      &:hover {
        color: $theme_color;
      }
    }
  }

  > span:nth-child(2) {
    color: #999;
    position: relative;
    display: flex;
    width: 200px;
  }

  .delivery-list {
    position: absolute;
    right: 0;
    top: 20px;
    background-color: #f3fafe;
    box-shadow: 0px 0px 5px #b9b2b2;
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    min-height: 100px;
    padding: 10px;

    li {
      width: 90px;
      height: 30px;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.goods-list {
  width: 1150px;
  background-color: #f8f8f8;
  margin: 10px 0 20px 0;

  .goods-item {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    margin: 0 20px;
    border-bottom: 1px dotted #999;

    &:last-child {
      border: none;
    }

    img {
      width: 48px;
      height: 48px;
    }

    > span {
      text-align: center;
      width: 100px;
    }

    > span:nth-child(1) {
      font-size: 12px;

      flex: 1;
      text-align: left;
      > span {
        margin-left: 10px;
      }
    }

    > span:last-child {
      color: $theme_color;
      font-weight: bold;
    }

    .goods-price {
      font-size: 16px;
    }
  }
}

.order-mark {
  width: 500px;
}

/** 购买商品列表 end */
/** 发票信息 start */
.invoice {
  .inv-tips {
    position: absolute;
    border: 1px solid #ddd;
    width: 310px;
    padding: 3px;
    margin: 0 0 0 10px;
    font-size: 12px !important;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);

    &::before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 17px;
      background: url(../../assets/images/arrow-left.png) 0 0 no-repeat;
      background-color: #fff;
      position: absolute;
      left: -9px;
    }

    .ivu-icon {
      color: #ff8f23;
      margin-right: 3px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .inovice-content {
    > span {
      margin-right: 10px;
    }

    > span:last-child {
      color: $theme_color;
      cursor: pointer;

      &:hover {
        border-bottom: 1px solid $theme_color;
      }
    }
  }
}

/** 发票信息 end */

/** 订单价格 */
.order-price {
  text-align: right;
  margin-top: 30px;
  font-size: 16px;
  color: #999;

  > div > span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }

  .actrual-price {
    color: $theme_color;
    font-weight: bold;
    font-size: 20px;
  }
}

/** content end */
/** 底部支付栏 */
.order-footer {
  z-index: 20;
  height: 50px;
  @include background_color($light_white_background_color);
  @include title_color($title_color);
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border-top: 1px solid #ddd;
  margin: 10px auto;

  div {
    text-align: center;
  }

  position: sticky;
  bottom: 0;

  .pay {
    background-color: $theme_color;
    width: 150px;
    font-size: 20px;
    color: #fff;
    height: 100%;
    line-height: 50px;
    cursor: pointer;
  }
}

/** 公共表头 */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dddddd;
  height: 40px;
  color: #0f1011;
  font-weight: bold;

  span:nth-child(1) {
    font-size: 16px;
  }

  span:nth-child(2) {
    font-size: 12px;
    color: #438cde;
    cursor: pointer;

    &:hover {
      color: $theme_color;
    }
  }
}

.ivu-divider {
  background: $theme_color;
  height: 2px;
}

.pay-address {
  font-size: 12px;
}

.more-addr {
  cursor: pointer;
  margin-top: 10px;
  display: inline-block;
}

.coupon-item {
  width: 260px;
  height: 125px;
  margin-right: 10px;
  margin-bottom: 10px;

  .c-right {
    width: 30px;
    padding: 10px 7px;
  }

  b {
    background: url("../../assets/images/small-circle.png") top left repeat-y;
    right: 28px;
  }

  .circle-top,
  .circle-bottom {
    right: 22px;
  }

  .used {
    position: absolute;
    top: 60px;
    right: 40px;
    width: 50px;
    height: 50px;
  }
}

.coupon-list {
  max-height: 260px;
  overflow: scroll;
}
</style>
