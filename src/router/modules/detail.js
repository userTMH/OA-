import layout from '@/layout'
export default {
  path: '/detail',
  component: layout,
  children: [
    {
      path: '',
      name: 'employee/detail',
      component: () => import('@/views/detail'),
      meta: {
        title: '添加员工',
        icon: 'people'
      }
    }
  ]
}
