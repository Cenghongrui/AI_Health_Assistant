<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon>
          <Back />
        </el-icon>
        <router-link to="/home" style="color: black; font-weight: bold;">返回首页</router-link>
      </div>
      <div class="title-text">
        <h2>请登录您的账户</h2>
        <p>输入您的信息，开始您的心理健康之旅</p>
      </div>
    </div>

    <div class="form-container">
      <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-button class="primary-btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>

        <div class="footer">
          <p>还没有账号？<router-link to="/auth/register" type="primary">去注册</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Back } from '@element-plus/icons-vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginRequest } from '@/interface'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()

const formData = reactive<LoginRequest>({
  username: '',
  password: '',
})

const rules = reactive<FormRules<LoginRequest>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})

const submitForm = async (formEl?: FormInstance) => {
  if (!formEl) return

  const valid = await formEl.validate().catch(() => false)
  if (!valid) return

  const res = await login(formData)
  if (!res.token) {
    return console.error('登录失败')
  }

  localStorage.setItem('token', res.token)
  localStorage.setItem('userInfo', JSON.stringify(res.userInfo))

  if (res.userInfo.userType === 2) {
    router.push('/back/dashboard')
  } else {
    router.push('/home')
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 384px;

  .title {
    display: flex;
    flex-direction: column;

    .back-home {
      margin-bottom: 60px;
    }

    .title-text {
      text-align: center;
      margin-bottom: 40px;

      h2 {
        margin-bottom: 10px;
        font-size: 36px;
        font-weight: bold;
        color: #333;
      }

      p {
        font-size: 18px;
        color: #9b9393;
      }
    }
  }

  .form-container {
    width: 100%;

    .primary-btn {
      margin-top: 30px;
      width: 100%;
    }

    .footer {
      margin-top: 10px;
      text-align: center;
    }
  }
}
</style>
