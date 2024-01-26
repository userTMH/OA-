import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [
    {
      path: '',
      name: 'employee',
      component: () => import('@/views/employee'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    }
    // {
    //   path: '',
    //   name: 'detail',
    //   hidden: true,
    //   component: () => import('@/views/detail'),
    //   meta: {
    //     title: '添加员工',
    //     icon: 'people'
    //   }
    // }
  ]
}
