<template>
    <div class="frontend-layout">
        <div class="navbar-container">
            <div class="brand-section">
                <el-image :src="robotUrl" alt="logo" style="width: 40px; height: 40px;" />
                <h1 class="brand-name">AI心理健康助手</h1>
            </div>
            <div class="nav-section" v-if="isLoggedIn">
                <router-link class="nav-link" to="/home">首页</router-link>
                <router-link class="nav-link" to="/consultation">AI咨询</router-link>
                <router-link class="nav-link" to="/emotion-diary">情绪日记</router-link>
                <router-link class="nav-link" to="/knowledge">知识库</router-link>
                <el-button class="logout-btn" size="medium" @click="handleLogout">退出登录</el-button>
            </div>
            <div class="nav-section" v-else>
                <router-link class="nav-link" to="/home">首页</router-link>
                <router-link class="nav-link" to="/knowledge">知识库</router-link>
                <router-link class="nav-link" to="/auth/login">登录</router-link>
                <router-link class="nav-link" to="/auth/register">注册</router-link>
            </div>
        </div>
        <div class="main-container">
            <router-view></router-view>
        </div>
        <div class="footer-container">
            <p class="footer-bottom">AI心理健康助手</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { logout } from '@/api/admin'
    import { ElMessage, ElMessageBox } from 'element-plus'
    const router = useRouter()


    const robotUrl = new URL('@/assets/images/robot.png', import.meta.url).href

    const isLoggedIn = ref(false)

    const handleLogout = () => {
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

    onMounted(() => {
        isLoggedIn.value = localStorage.getItem('token') !== null
    })
</script>

<style scoped lang="scss">
    .frontend-layout {
        background-color: white;

        .navbar-container {
            max-width: 1200px;
            height: 100%;
            margin: 0 auto;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;

            .brand-section {
                display: flex;
                align-items: center;

                .brand-name {
                    margin-left: 10px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                }
            }

            .nav-section {
                display: flex;
                align-items: center;
                gap: 40px;

                .nav-link {
                    color: #4b5563;
                    font-size: 16px;
                    font-weight: 500;

                    &:hover {
                        color: #4A90E2;
                    }
                }
            }
        }

        .footer-container {
            background: #1f2937;
            color: white;
            padding: 15px 0;
            margin-top: auto;

            .footer-bottom {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 10px;
                text-align: center;
            }
        }
    }
</style>
