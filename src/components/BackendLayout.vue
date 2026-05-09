<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar />
      <el-container>
        <el-header>
          <Navbar :currentPageName="(route.meta.title as string | undefined)" />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container "></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts"> 
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import {useRoute} from "vue-router";

const route = useRoute()
console.log(route,'router')


</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .el-header {
    height: 70px !important;
  }
  .main-container {
    height: 100%; 
    .content-container {
      min-height: calc(100% - 74px);
      padding: 20px;
      background-color: white;
    }
  }
}
</style>