import service from '@/utils/request'

//员工列表
export function userApi(params) {
  return service({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
