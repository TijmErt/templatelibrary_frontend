import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/TemplatePost/TemplatePostOverview.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/Post/:id',
      name: 'TemplatePost View',
      component: () => import('../views/TemplatePost/TemplatePostView.vue'),
    },
    {
      path:'/Post/Creation',
      name:'TemplatePost Creator',
      component: () => import("../views/TemplatePost/TemplatePostCreate.vue")
    },
    {
      path:'/Websocket',
      name:'Websocket test',
      component: () => import("../views/WebSocketTest.vue")
    },
    {
      path:'/Websocket/enh',
      name:'Websocket test Enhanced',
      component: () => import("../views/EnhancedWebSocketTest.vue")
    }
  ],
})

export default router
