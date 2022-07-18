<template>
  <div class="login" @keyup.enter="handleSubmit">
    <!-- 顶部logo -->
    <div class="top-content" @click='$refs.verify.show = false'>
      <div class="logo-box">
        <img :src="$store.state.logoImg" @click="$router.push('/')" />
        <div>欢迎登录</div>
      </div>
    </div>
    <!-- 登录主体 包含轮播图 登录模块 -->
    <div class="login-container">
      <!-- 轮播 -->
      <Carousel loop :autoplay-speed="5000" class="login-carousel" arrow="never">
        <CarouselItem>
          <div class="demo-carousel" @click='$refs.verify.show = false'>
            <img width="100%" height="100%" src="@/assets/images/login/login-background.jpg">
          </div>
        </CarouselItem>
      </Carousel>
      <!-- 登录模块 -->
      <div class="form-box">
        <div class="account-number">
          <div class="tab-switch">
            <span>{{'账号登录'}}</span>
          </div>
          <div @click="$router.push('signUp')">立即注册</div>
        </div>
        <!-- 账号密码登录 -->
        <Form ref="formInline" :model="formData" :rules="ruleInline" v-show="type === true"
          @click.self='$refs.verify.show = false'>
          <FormItem prop="userName">
            <i-input type="text" v-model="formData.userName" clearable placeholder="用户名">
              <Icon type="md-person" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input type="password" v-model="formData.password" clearable placeholder="密码">
              <Icon type="md-lock" slot="prepend"> </Icon>
            </i-input>
          </FormItem>
          <FormItem>
            <Button type="warning" @click="useVerify" long>登录</Button>
          </FormItem>
        </Form>
        <div class="regist">
          <span @click="$router.push('forgetPassword')">忘记密码</span>
        </div>
      </div>
      <!--滑动验证码-->
      <verify @success="handleSubmit" :captchaType="'blockPuzzle'" :imgSize="{width:'400px',height:'200px'}" ref="verify"></verify>
    </div>
    <div class="foot">
      <Row type="flex" justify="space-around" class="help">
        <router-link to="/article" class="item" target="_blank">帮助</router-link>
        <router-link to="/article?id=1371779927900160000" class="item" target="_blank">隐私</router-link>
        <router-link to="/article?id=1371992704333905920" class="item" target="_blank">条款</router-link>
      </Row>
      <Row type="flex" justify="center" class="copyright">
        Copyright © {{year}} - Present
        <a href="https://pickmall.cn" target="_blank" style="margin: 0 5px">{{config.title}}</a>
        版权所有
      </Row>
    </div>
  </div>
</template>

<script>

import storage from "@/plugins/storage.js";
import verify from '@/components/verifition/Verify'
import { login } from '@/api/mall-member/member'
import {setToken, setUserInfo} from "@/utils/auth";

export default {
  name: "Login",
  components: {
    verify,
  },
  data() {
    return {
      config:require('@/config'),
      type: true, // true 账号登录  false 验证码登录
      formData: {
        // 登录表单
        userName: "",
        password: "",
      },
      ruleInline: {
        // 验证规则
        username: [{ required: true, message: "请输入用户名" }],
        password: [
          { required: true, message: "请输入密码" },
          { type: "string", min: 6, message: "密码不能少于6位" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码" },
          {
            pattern: RegExp.mobile,
            message: "请输入正确的手机号",
          },
        ],
        code: [{ required: true, message: "请输入手机验证码" }],
      },
      year: new Date().getFullYear(),
    };
  },
  methods: {
    // 登录
    handleSubmit(captchaVerification) {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          var paramsData = this.axios.paramsHandler(captchaVerification);
          var postData = this.axios.dataHandler({
            userName: this.formData.userName,
            password: this.formData.password,
            userType: 4 //会员（userType置为4）
          });

          login(paramsData,postData).then(({data}) => {
            if (data && data.code == '200') {
              //保存token
              setToken(data.data.enhanceInfo.userName, data.data.accessToken)
              //保存用户信息
              setUserInfo(data.data.enhanceInfo.userName, data.data.enhanceInfo);
              sessionStorage.setItem("userNameKey", data.data.enhanceInfo.userName)
              this.$Message.success("登录成功");
              this.$router.push("/");
            } else {
              this.$Message.error(data.message);
            }
          });
        }
      });
    },

    useVerify(){
      this.$refs.verify.show()
    }

  },
  mounted() {
    document.onkeydown = (e) => {
      if (window.event === undefined) {
        var key = e.keyCode
      } else {
        var key = window.event.keyCode
      }
      if (key === 13) {
        this.useVerify()
      }
    }
  }
};

</script>
<style scoped lang="scss">
.login {
  height: 100%;
  background-color: #f0f2f5;
}
.top-content {
  width: 100%;
  height: 80px;
  position: relative;
  z-index: 1;

  box-shadow: 0 1px 1px #ddd;
  background-color: #f4f4f4;

  .logo-box {
    width: 80%;
    max-width: 1200px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    img {
      width: 150px;
      cursor: pointer;
    }
    div {
      font-size: 20px;
      margin-top: 10px;
    }
  }
}
.login-carousel {
  width: 100%;
  height: 550px;
  .demo-carousel {
    height: 550px;
    width: inherit;
    display: flex;
    justify-content: center;
  }
}

.login-container {
  position: relative;
  width: 100%;
  height: 550px;
}

.form-box {
  width: 350px;
  box-sizing: border-box;
  position: absolute;
  top: 150px;
  right: 60%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  .account-number {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;
    > div:nth-child(2) {
      color: $theme_color;
      cursor: pointer;
    }
    .tab-switch {
      height: 40px;
      font-size: 14px;

      span:nth-child(1) {
        font-size: 16px;
        border-right: 1px solid #ddd;
        padding-right: 10px;
      }

      span:nth-child(2) {
        cursor: pointer;
        padding-left: 10px;
        &:hover {
          color: $theme_color;
        }
      }
    }
  }
}

.verify-con {
  position: absolute;
  right: 16%;
  top: 90px;
  z-index: 10;
}

.other-login {
  margin: 0 auto;
  > svg {
    cursor: pointer;
    width: 24px;
    margin-right: 10px;
    height: 24px;
  }
}
.regist {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
  span {
    margin-left: 10px;
    &:hover {
      cursor: pointer;
      color: $theme_color;
    }
  }
}
.foot {
  position: fixed;
  bottom: 1vh;
  width: 368px;
  left: calc(50% - 184px);
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  .help {
    margin: 0 auto;
    margin-bottom: 1vh;
    width: 60%;
    .item {
      color: rgba(0, 0, 0, 0.45);
    }
    :hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
.icon-hover {
  cursor: pointer;
}
</style>
