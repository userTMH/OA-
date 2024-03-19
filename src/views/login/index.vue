<template>
  <div class="login-container">
    <div class="box-left">
    </div>
    <div class="box-right">
      <el-form ref="form" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="mobile">
          <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox v-model="ruleForm.isAgree">
            ⽤户平台使⽤协议
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : '',
        isAgree: process.env.NODE_ENV === 'development'
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '⼿机号格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 5, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        isArray: [
          {
            validator: (rule, value, callback) => {
              value ? callback() : callback(new Error('没有勾选用户平台协议'))
            }
          }
        ]
      }
    }
  },
  watch: {},
  methods: {
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch('user/login', this.ruleForm)
          this.$router.push('/')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;

  .box-left {
    width: 70%;
    height: 100vh;
    background-image: url(../../assets/common/login_back.png);
    background-size: 100% 100%;
  }

  .box-right {
    width: 30%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
