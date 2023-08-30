<template>
  <div class="wrapper">
    <!-- 卡片组件 -->
    <card _Title="我的订单" :_Size="16" :_Tabs="changeWay" @_Change="change" v-if="!homePage"></card>
    <card _Title="我的订单" :_Size="16" :_Tabs="changeWay" @_Change="change" _More="全部订单" _Src="/home/MyOrder" v-else></card>
    <!-- 搜索 筛选 -->
    <div class="mb_20 box" v-if="!homePage">
      <div class="global_float_right" >
        <Input
          class="width_300"
          search
          enter-button
          v-model="params.code"
          @on-search="getList"
          placeholder="请输入订单号搜索"
        />
      </div>
    </div>
    <!-- 订单列表 -->
    <empty v-if="orderList.length === 0" />
    <div class="order-content" v-else>
      <div class="order-list" v-for="(order, onderIndex) in orderList" :key="onderIndex">
        <div class="order-header">
          <div>
            <span>{{order.createTime | formatDateTime}}</span> &nbsp;&nbsp;
            <span>
              订单号：{{ order.code }} &nbsp; &nbsp; &nbsp;
            </span>
            <span style="cursor: pointer; font-family: 微软雅黑; font-size: 13px; color: forestgreen">{{ order.merchantName }} </span>

          </div>
          <div style="float:right; position: absolute; margin-left: 580px">
            <div style="margin-left: 80px;">{{ filterOrderStatus(order.status) }}</div>
          </div>
          <div style="float: right; position: absolute; margin-left: 700px">
            <div style="text-align: right; font-weight: bold; color: #de0202">{{ order.totalPrice | unitPrice("￥") }}</div>
          </div>

          <template>
            <Dropdown trigger="click" style="margin-left: 20px">
              <Button type="primary" size="small">
                操作
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <template #list>
                <DropdownMenu>
                  <DropdownItem @click.native="orderDetail(order.code)">
                    订单详情
                  </DropdownItem>
                  <!-- 取消订单 (未支付状态（UNPAID），已支付状态（），未发货状态（UNDELIVERED）才能取消订单)-->
                  <DropdownItem v-if="order.status=='UNPAID' || order.status=='UNDELIVERED'" @click.native="handleCancelOrder(order.code)">
                    取消订单
                  </DropdownItem>
                  <!-- 去支付 (未支付状态（UNPAID）才能去支付)-->
                  <DropdownItem v-if="order.status == 'UNPAID'" @click.native="goPay(order.tradeCode, order.code)">
                    去支付
                  </DropdownItem>
                  <!-- 确认收货 (待收货状态（DELIVERED）才能确认收货)-->
                  <DropdownItem v-if="order.status == 'DELIVERED'" @click.native="confirmReceiptAll(order.code)">
                    确认收货
                  </DropdownItem>
                  <!-- 售后 (已完成的订单才能申请售后)-->
                  <DropdownItem v-if="order.status == 'FINISHED'" @click.native="applyAfterSale(order.orderDetailList)">
                    申请售后
                  </DropdownItem>
                  <DropdownItem @click.native="deleteOrder(order.code)">
                    删除
                  </DropdownItem>
                </DropdownMenu>
              </template>
            </Dropdown>
          </template>
        </div>
        <div class="order-body">
          <div class="goods-list">
            <div v-for="(orderDetail, orderDetailIndex) in order.orderDetailList" :key="orderDetailIndex">
              <img @click="goodsDetail(orderDetail.goodsSkuId, orderDetail.goodsId)" class="hover-color" :src="orderDetail.goodsImage" alt=""/>
              <div>
                <div class="hover-color" @click="goodsDetail(orderDetail.goodsSkuId, orderDetail.goodsId)">{{ orderDetail.goodsName }}</div>
                <div class="mt_10">
                  <span class="global_color">{{ orderDetail.goodsSellingPrice | unitPrice("￥") }} </span>x {{ orderDetail.goodsCount }}
                </div>
                <!-- 确认收货 (待收货状态（DELIVERED）才能确认收货)-->
                <Button v-if="orderDetail.subStatus == 'DELIVERED'" @click="confirmReceipt(orderDetail.subCode)" size="small" type="success" class="fontsize_12" style="position:relative;top:-22px;left:100px">确认收货</Button>
                <Button v-if="orderDetail.commentStatus == 'NOT_COMMENTED'" @click="comment(order.code, orderDetail.subCode,order.merchantId, orderDetailIndex)" size="small" type="success" class="fontsize_12" style="position:relative;top:-22px;left:100px">评价</Button>
                <Button v-if="orderDetail.complainStatus == 'NO_APPLY'" @click="complain(orderDetail.subCode, orderDetailIndex)" type="warning" class="fontsize_12" size="small" style="position:relative;top:-22px;left:100px">投诉</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <!-- 分页 -->
    <div class="page-size" v-if="!homePage">
      <Page :total="total" @on-change="changePageNum"
        @on-page-size-change="changePageSize"
        :page-size="params.pageSize"
        show-total
        show-sizer>
      </Page>
    </div>
    <!-- 选择售后商品 -->
    <Modal v-model="afterSaleModal" title="请选择申请售后的商品">
      <div>
        <Table
          border
          :columns="afterSaleColumns"
          :data="afterSaleArr"
          @on-row-click="afterSaleSelect"
        >
        </Table>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="cancelAvail" title="请选择取消订单原因" @on-ok="sureCancel" @on-cancel="cancelAvail = false">
      <RadioGroup v-model="cancelParams.reason" vertical type="button" button-style="solid">
        <Radio :label="item" v-for="item in cancelReason" :key="item">
           {{item}}
        </Radio>
      </RadioGroup>
    </Modal>
  </div>
</template>

<script>
import { sureReceived, delOrder } from '@/api/order';
import { afterSaleReason } from '@/api/member';
import { orderStatusList } from '../enumeration.js'

import { getOrderList, cancelOrder, deleteOrder, confirmReceiptAll, confirmReceipt } from "@/api/mall-order/order"
export default {
  name: 'MyOrder',
  props: {
    homePage: { // 判断是否个人中心首页展示内容
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      orderList: [], // 订单列表
      status: "",
      params: { // 请求参数
        pageNum: 1,
        pageSize: 10,
        status: '',
        code: ''
      },
      cancelParams: { // 取消售后参数
        orderCode: '',
        reason: ''
      },
      // 状态数组
      orderStatusList,
      changeWay: ['全部订单', '待付款', '待收货', '待评价'], // 订单状态
      total: 0, // 数据总数
      spinShow: false, // 加载状态
      afterSaleModal: false, // 选择售后商品模态框
      afterSaleColumns: [ // 售后商品表头
        {title: '商品名称', key: 'name'},
        {title: '价格', key: 'goodsPrice'}
      ],
      afterSaleArr: [], // 售后商品列表
      cancelAvail: false, // 取消订单modal控制
      cancelReason:  [ // 取消订单原因
        "拍错了",
        "买重复了",
        "不想要了",
        "有更满意的了"
      ]
    };
  },
  mounted () {
    if (this.homePage) this.params.pageSize = 5;
    this.getList();
  },
  methods: {
    goodsDetail (skuId, goodsId) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: { skuId: skuId, id: goodsId }
      });
      window.open(routeUrl.href, '_blank');
    },
    // 切换订单状态
    change (index) {
      switch (index) {
        case 0:
          this.params.status = ""
          break;
        case 1:
          this.params.status = "UNPAID"
          break;
        case 2:
          this.params.status = "DELIVERED"
          break;
        case 3:
          this.params.status = "FINISHED"
          break;
      }
      this.getList()
    },

    // 跳转店铺首页
    shopPage (id) {
      let routeUrl = this.$router.resolve({
        path: '/Merchant',
        query: { id: id }
      });
      window.open(routeUrl.href, '_blank');
    },

    orderDetail (code) {
      // 跳转订单详情
      this.$router.push({ name: 'OrderDetail', query: {code: code} });
    },

    confirmReceiptAll (code) { // 全部确认收货
      this.$Modal.confirm({
        title: '确认收货',
        content: '<p>是否确认收货？</p>',
        onOk: () => {
          var params = this.axios.paramsHandler({code: code});
          confirmReceiptAll(params).then(({data}) => {
            if (data && data.code == '200') {
              this.$Message.success('确认收货成功');
              this.getList()
            }
          })
        },
        onCancel: () => {}
      });
    },

    confirmReceipt (subCode) { // 单个确认收货
      this.$Modal.confirm({
        title: '确认收货',
        content: '<p>是否确认收货？</p>',
        onOk: () => {
          var params = this.axios.paramsHandler({ subCode: subCode });
          confirmReceipt(params).then(({data}) => {
            if (data && data.code == '200') {
              this.$Message.success('确认收货成功');
              this.getList()
            }
          })
        },
        onCancel: () => {}
      });
    },

    // 去支付
    goPay (code, orderCode) {
      this.$router.push({
        path: '/payment',
        query: {
          code: code,
          orderType: "ORDER",
          orderCode: orderCode
        }
      });
    },

    applyAfterSale (goodsItem) { // 申请售后
      console.log("goodsItem == ", goodsItem)
      let arr = []
      goodsItem.forEach(e => {
        if (e.afterSalesStatus === 'NOT_APPLIED') {
          arr.push(e)
        }
      });
      if (arr.length === 1) {
        this.$router.push({name: 'ApplyAfterSale', query: {sn: arr[0].sn}})
      } else {
        this.afterSaleArr = arr;
        this.afterSaleModal = true
      }
    },
    // 申请售后
    afterSaleSelect (item) {
      this.$router.push({name: 'ApplyAfterSale', query: {sn: item.sn}})
    },
    comment (code, subCode, merchantId, goodsIndex) { // 评价
      this.$router.push({path: '/home/addEval', query: {subCode, index: goodsIndex, code: code, merchantId: merchantId}})
    },
    complain (sn, goodsIndex) { // 投诉
      this.$router.push({name: 'Complain', query: {sn, index: goodsIndex}})
    },

    // 删除订单
    deleteOrder (code) {
      this.$Modal.confirm({
        title: '删除订单',
        content: '<p>确认删除当前订单吗？</p>',
        onOk: () => {
          var params = this.axios.paramsHandler({ code: code});
          deleteOrder(params).then(({data}) => {
            if (data && data.code == '200') {
              this.$Message.success('删除成功');
              this.getList()
            }
          })
        },
        onCancel: () => {}
      });
    },

    // 获取订单列表
    getList () {
      this.spinShow = true;
      var params = this.axios.paramsHandler(this.params);
      getOrderList(params).then(({data}) => {
        this.spinShow = false
        if (data && data.code == 200) {
          this.orderList = data.data.list;
          this.total = data.data.totalCount;
        }
      });
    },

    changePageNum (val) { // 修改页码
      this.params.pageNum = val;
      this.getList()
    },
    changePageSize (val) { // 修改页数
      this.params.pageNum = 1;
      this.params.pageSize = val;
      this.getList()
    },


    handleCancelOrder (code) {
      // 取消订单
      this.cancelAvail = true
      this.cancelParams.orderCode = code;
      this.cancelParams.reason = this.cancelReason[0];
    },
    sureCancel () { // 确定取消
      var params = this.axios.paramsHandler({
        code: this.cancelParams.orderCode,
        cancelReason: this.cancelParams.reason
      });
      cancelOrder(params).then(({data}) => {
        if (data && data.code == '200') {
          this.$Message.success('取消订单成功')
          this.getList()
          this.cancelAvail = false
        }
      })
    },


    filterOrderStatus (status) { // 获取订单状态中文
      const ob = this.orderStatusList.filter(e => { return e.status === status });
      return ob[0].name
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  margin-bottom: 40px;
}
.box {
  overflow: hidden;
}
.page-size {
  margin: 15px 0px;
  text-align: right;
}
/** 订单列表 */
.order-list {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 10px;

  &:hover{
    .del-btn{visibility: visible;}
  }
  .del-btn{
    visibility: hidden;
  }

  .order-header {
    display: flex;
    align-items: center;
    padding: 10px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    > div:nth-child(1) > div:nth-child(2) {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
  .order-body {
    display: flex;
    justify-content: space-between;
    color: #999;
    padding: 10px;

    .goods-list > div {
      width: 500px;
      display: flex;
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      > div {
        flex: 1;
      }
    }

    > div:nth-child(2) {
      width: 150px;
      text-align: center;
      span {
        color: #438cde;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
      .ivu-icon {
        color: #ff8f23;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
    }

    > div:nth-child(3) {
      width: 100px;
      .ivu-btn {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
