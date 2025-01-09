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
      path:"/Post/Update/:id",
      name:"TemplatePost Update",
      component: () => import("../views/TemplatePost/TemplatePostUpdate.vue")
    }
  ],
})

export default router
