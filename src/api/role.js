import service from '@/utils/request'

//表格数据
export function listApi(params) {
  return service({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

//添加
export function addApi(data) {
  return service({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

//编辑
export function editApi(id, data) {
  return service({
    url: `/sys/role/${id}`,
    method: 'PUT',
    data
  })
}

//删除
export function deltetApi(id) {
  return service({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
