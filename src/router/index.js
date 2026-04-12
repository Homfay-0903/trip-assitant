import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
    path: '/',
    redirect: '/login'
},
{
    name: 'login',
    path: '/login',
    component: () => import('@/views/Login/index.vue')
},
{
    name: 'home',
    path: '/home',
    component: () => import('@/views/home/index.vue')
},
{
    name: 'User',
    path: '/user',
    component: () => import('@/views/User/index.vue')
},
{
    name: 'TravelPlan',
    path: '/travel_plan',
    component: () => import('@/views/TravelPlan/index.vue')
},
{
    name: 'PlanPage',
    path: '/plan_page',
    component: () => import('@/views/PlanPage/index.vue')
},
{
    name: 'OverCountry',
    path: '/Over_Country',
    component: () => import('@/views/OverCountry/index.vue')
},
{
    name: 'MyTrips',
    path: '/my-trips',
    component: () => import('@/views/MyTrips/index.vue')
},
{
    name: 'TripDetail',
    path: '/trip/detail/:id',
    component: () => import('@/views/TripDetail/index.vue')
},
{
    name: 'TravelLogCreate',
    path: '/travel-log/create',
    component: () => import('@/views/TravelLog/Create.vue')
},
{
    name: 'TravelLogList',
    path: '/travel-log/list',
    component: () => import('@/views/TravelLog/List.vue')
},
{
    name: 'TravelLogDetail',
    path: '/travel-log/detail/:id',
    component: () => import('@/views/TravelLog/Detail.vue')
},
{
    name: 'MyFavorites',
    path: '/my-favorites',
    component: () => import('@/views/MyFavorites/index.vue')
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router