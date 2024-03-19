import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  lable: 'employee',
  children: [
    {
      path: '',
      name: 'employee',
      component: () => import('@/views/employee'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id?',
      name: 'detail',
      hidden: true,
      component: () => import('@/views/employee/detail'),
      meta: {
        title: '员工详情'
      }
    }
  ]
}
