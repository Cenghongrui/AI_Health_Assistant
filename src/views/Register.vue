<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写您的注册信息</p>
      </div>
    </div>

    <div class="form-container">
      <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" size="large" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" size="large" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" size="large" placeholder="请输入手机号（可选）" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" size="large" placeholder="请确认密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button class="btn" size="large" @click="submitForm(ruleFormRef)">创建账户</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <p>已有账号？<router-link to="/auth/login" type="primary">去登录</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { register } from '@/api/frontEnd'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import type { RegisterRequest } from '@/interface'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()

const formData = reactive<RegisterRequest>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  userType: 1,
  nickname: '',
})

const rules = reactive<FormRules<RegisterRequest>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
  ],
})

const submitForm = async (formEl?: FormInstance) => {
  if (!formEl) return

  const valid = await formEl.validate().catch(() => false)
  if (!valid) return

  await register(formData)
  ElMessage.success('注册成功')
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.container {
  width: 384px;

  .flex-box {
    display: flex;
    align-items: center;
  }

  .title {
    .title-text {
      text-align: center;

      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }

  .form-container {
    margin-top: 30px;

    .btn {
      margin-top: 20px;
      width: 100%;
    }
  }

  .footer {
    padding: 10px;
    text-align: center;
  }
}
</style>
