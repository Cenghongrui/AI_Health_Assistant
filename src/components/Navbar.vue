<template>
  <div class="navbar">
    <div class="flexbox">
      <el-button @click="handleCollapse">
        <el-icon>
          <Expand />
        </el-icon>
      </el-button>
      <p class="navbar-title">{{ currentPageName }}</p>
    </div>
    <div class="flexbox">
      <el-dropdown @command="handleCommand">
        <div class="flexbox">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <p>user</p>
          <el-icon><ArrowDown /></el-icon>
        </div>  
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore} from '@/stores/admin'
import { logout } from '@/api/admin'
import { ElMessage ,ElMessageBox } from 'element-plus'
import router from '@/router'



const props = defineProps({
  currentPageName: {
    type: String,
    default: '页面标题'
  }
})



const adminStore = useAdminStore()

const handleCollapse = () => {
  adminStore.toggleCollapse()
  console.log(adminStore.isCollapsed)
}

const handleCommand = (command: string) => {
  console.log(command)
  if (command === 'logout') {
    ElMessageBox.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logout().then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/auth/login')
      })
    })
  }
}
</script>


<style lang="scss" scoped>

  .navbar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;

    .flexbox {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .navbar-title {
      margin-left: 20px;
      font-size: 26px;
      font-weight: bold;
      color: black;
    }

  }
</style>
