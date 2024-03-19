import layout from '@/layout'
export default {
  path: '/permission',
  component: layout,
  lable: 'permission',
  children: [
    {
      path: '',
      name: 'permission',
      component: () => import('@/views/permission'),
      meta: {
        title: '权限',
        icon: 'lock'
      }
    }
  ]
}
