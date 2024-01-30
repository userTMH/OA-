import service from '@/utils/request'

//权限列表
export function permisApi() {
  return service({
    url: '/sys/permission',
    method: 'GET'
  })
}

//权限添加
export function addApi(data) {
  return service({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}

//权限详情
export function detailApi(id) {
  return service({
    url: `/sys/permission/${id}`,
    method: 'GET'
  })
}

//权限修改
export function reviseApi(id, data) {
  return service({
    url: `/sys/permission/${id}`,
    method: 'PUT',
    data
  })
}

//权限删除
export function deleteApi(id) {
  return service({
    url: `/sys/permission/${id}`,
    method: 'DELETE'
  })
}
