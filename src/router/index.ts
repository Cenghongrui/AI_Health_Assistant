import { createRouter, createWebHistory } from 'vue-router'


// 后台管理路由
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: () => import('@/components/BackendLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'Reading',
        },
      },
      {
        path: 'consultations',
        component: () => import('@/views/Consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
        },
      },
      {
        path: 'emotional',
        component: () => import('@/views/Emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/components/AuthorLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'register',
        component: () => import('@/views/Register.vue'),
        meta: {
          title: '注册',
        },
      },
    ],
  },
]

// 前台用户路由
const frontendRoutes = [
  {
    path: '/',
    component: () => import('@/components/FrontendLayout.vue'),
        redirect: '/home',  // 默认跳转到首页
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'consultation',
        component: () => import('@/views/Consultation.vue'),
        meta: {
          title: 'AI咨询',
        },
      },
      {
        path: 'emotion-diary',  // 修正路径，与导航链接一致
        component: () => import('@/views/Emotiondiary.vue'),
        meta: {
          title: '情绪日记',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/FrontendKnowledge.vue'),
        meta: {
          title: '知识库',
        },
      },
      {
        path: 'knowledge/article/:id',
        component: () => import('@/views/ArticleDetail.vue'),
        meta: {
          title: '文章详情',
        },
        props: true, // 能接收到URL上传递的参数 
      },
    ],
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 检查是否有token,即当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    //如果是后台用户,则直接放行
    if (userInfo.userType === 2) {
      if (to.path.startsWith('/back')) {
        next()
      }
      else {
        next('/back/dashboard')
      }
    }
    else if(userInfo.userType === 1){
      //前台用户
      if(to.path.startsWith('/back')||to.path.startsWith('/auth')){
        next('/')
      }
      else {
        next()
      }
    }

  }
  else {
    if (to.path.startsWith('/back')) {
      //如果访问的路径是后台管理路径,则跳转到登录页
      next('/auth/login')
    }
    else {
      next()
    }
  }
})

export default router
