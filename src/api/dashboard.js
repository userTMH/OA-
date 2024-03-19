import service from '@/utils/request'

export function homeDataApi() {
  return service({
    url: '/home/data',
    method: 'GET'
  })
}
