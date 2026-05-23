<template>
  <el-aside :width="isCollapsed ? '64px' : '264px'">
    <el-menu
      :collapse="isCollapsed"
      :collapse-transition="false"
      default-active="2"
      class="el-menu-vertical-demo menu-style"
    >
      <div class="brand">
        <el-image
          :src="iconUrl"
          fit="contain"
          style="width: 50px; height: 50px;margin-right: 10px;"
        />
        <div v-show="!isCollapsed" class="info-card">
          <h1 class="brand-title">AI心理健康助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item
        @click="selectMenu(item.path)"
        v-for="item in backendMenuItems"
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from "vue-router";
import { useAdminStore } from '@/stores/admin'
import type { RouteRecordRaw } from 'vue-router'

const adminStore = useAdminStore()

const router = useRouter();
const iconUrl = new URL("@/assets/images/robot.png", import.meta.url).href;

const isCollapsed = computed(() => adminStore.isCollapsed)

interface BackendMenuItem {
  path: string
  meta: {
    title: string
    icon: string
  }
}

const isBackendMenuItem = (route: RouteRecordRaw): route is BackendMenuItem & RouteRecordRaw => {
  return typeof route.path === 'string'
    && typeof route.meta?.title === 'string'
    && typeof route.meta?.icon === 'string'
}

const backendMenuItems = computed<BackendMenuItem[]>(() => {
  const backendRoute = router.options.routes.find((route) => route.path === '/back')
  return (backendRoute?.children ?? []).filter(isBackendMenuItem)
})

const selectMenu = (path: string) => {
  router.push(`/back/${path}`)
}

</script>

<style lang="scss" scoped>
.menu-style {
  height: 100%;
  .brand {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px;
  .info-card {
    .brand-title {
      font-size: 20px;
      font-weight: bold;
      color: black;
      margin-bottom: 5px;
    }
    .brand-subtitle {
      font-size: 14px;
      font-weight: normal;
      color: #606266;
    }
  }
}
}

</style>
