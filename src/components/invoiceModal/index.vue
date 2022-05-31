<template>
  <div class="invoice-modal">
    <Modal v-model="invoiceAvailable" width="600" footer-hide>
      <p slot="header">
        <span>发票信息</span>
      </p>
      <!-- 普通发票 -->
      <div class="nav-content">
        <Form :model="invoiceForm" ref="form" label-position="left" :rules="ruleInline" :label-width="110">
          <FormItem label="发票类型">
            <RadioGroup v-model="invoiceForm.invoiceType" type="button" button-style="solid">
              <Radio @on-change="changeInvoiceType" :label="1">电子普通发票</Radio>
              <Radio :label="2" :disabled="true" title="抱歉，暂不支持，敬请期待">增值税专用发票</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="发票抬头">
            <RadioGroup v-model="invoiceForm.invoiceTitleType" @on-change="changeInvoiceTitleType" type="button" button-style="solid">
              <Radio :label="0">个人</Radio>
              <Radio :label="1">单位</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="个人名称" v-if="invoiceForm.invoiceTitleType === 0" prop="invoiceTitle">
            <i-input v-model="invoiceForm.invoiceTitle"></i-input>
          </FormItem>
          <FormItem label="单位名称" v-if="invoiceForm.invoiceTitleType === 1" prop="invoiceTitle">
            <i-input v-model="invoiceForm.invoiceTitle"></i-input>
          </FormItem>
          <FormItem label="纳税人识别号" v-if="invoiceForm.invoiceTitleType === 1" prop="taxNumber">
            <i-input v-model="invoiceForm.taxNumber"></i-input>
          </FormItem>
          <FormItem label="发票内容">
            <RadioGroup v-model="invoiceForm.invoiceContent" type="button" button-style="solid">
              <Radio :label="0">商品明细</Radio>
              <Radio :label="1">商品类别</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="收票人手机" prop="mobile">
            <i-input v-model="invoiceForm.mobile" maxlength="20"></i-input>
          </FormItem>
          <FormItem label="收票人邮箱" prop="email">
            <i-input v-model="invoiceForm.email" maxlength="50"></i-input>
          </FormItem>
        </Form>
        <div style="text-align: center">
          <Button type="primary" :loading="loading" @click="submit">保存发票信息</Button>
          <Button type="default" @click="invoiceAvailable = false">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { TINumber } from '@/plugins/RegExp.js';
import { saveOrUpdateCartInvoice } from '@/api/mall-cart/cart_invoice'
export default {
  name: 'invoiceModal',
  data () {
    return {
      invoiceAvailable: false, // 模态框显隐
      loading: false, // 提交状态
      invoiceForm: {
        id: 0,
        invoiceType: 1, // 发票类型
        invoiceTitleType: 0, //发票抬头类型 0 个人 1 单位
        invoiceTitle: '', // 发票抬头
        taxNumber: '', // 纳税人识别号
        invoiceContent: 0, // 发票内容
        mobile: '', //收票人手机
        email: '' //收票人邮箱
      },
      ruleInline: {
        taxNumber: [
          { required: true, message: '请填写纳税人识别号' },
          { pattern: TINumber, message: '请填写正确的纳税人识别号' }
        ]
      }
    };
  },
  props: ['invoiceData'],
  watch: {
    // 回显的发票信息
    invoiceData: {
      handler (val) {
        this.invoiceForm = { ...val };
      },
      deep: true,
      immeadite: true
    }
  },
  methods: {
    /**
     * 选择发票类型
     */
    changeInvoiceType (val) {
      this.$nextTick(() => {
        this.invoiceForm.invoiceType = val;
      });
    },
    /**
     *  选择发票抬头
     */
    changeInvoiceTitleType (val) {
      this.$nextTick(() => {
        this.invoiceForm.invoiceTitleType = val;
      });
    },

    /**
     *  保存判断
     */
    saveValidate () {
      let flag = true;
      // 保存分为两种类型，个人以及企业
      const { invoiceTitle, mobile, email } = JSON.parse(
        JSON.stringify(this.invoiceForm)
      );
      // 判断是否填写发票抬头
      if (!invoiceTitle) {
        this.$Message.error('请填写发票抬头!');
        flag = false;
        return false;
      }
      // 判断是否填写收票人手机号
      if (!mobile) {
        this.$Message.error('请填写收票人手机!');
        flag = false;
        return false;
      }
      // 判断是否填写收票人邮箱
      if (!email) {
        this.$Message.error('请填写收票人邮箱!');
        flag = false;
        return false;
      }
      if (this.invoiceForm.invoiceTitleType === 1) {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            flag = false;
          }
        });
      } else {
        this.invoiceForm.taxNumber = "";
      }
      return flag;
    },
    // 保存发票信息
    async submit () {
      if (this.saveValidate()) {
        this.loading = true;
        var postData =  this.axios.dataHandler({
          id: this.invoiceForm.id,
          invoiceType: this.invoiceForm.invoiceType,
          invoiceTitleType: this.invoiceForm.invoiceTitleType,
          invoiceTitle: this.invoiceForm.invoiceTitle,
          taxNumber: this.invoiceForm.taxNumber,
          invoiceContent: this.invoiceForm.invoiceContent,
          mobile: this.invoiceForm.mobile,
          email: this.invoiceForm.email
        });

        console.log("postData==",postData)
        saveOrUpdateCartInvoice(postData).then(({data}) => {
          if (data && data.code === "200") {
            this.$emit('change', true);
          } else {
            this.$Message.error(data.message)
          }
          this.loading = false;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/** 普票 */
.inv-type {
  text-align: center;
}
.add-inv {
  font-size: 12px;
  color: #438cde;
  cursor: pointer;
  &:hover {
    color: $theme_color;
  }
}

.nav-content {
  width: 500px;
  margin: 10px auto;
}
</style>
