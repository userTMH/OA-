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

//详情
export function getRoleDetailApi(id) {
  return service({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

//权限数据
export function assignPremApi(data) {
  return service({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data
  })
}

//获取已启用的角色列表
export function enabledApi() {
  return service({
    url: '/sys/role/list/enabled',
    method: 'GET'
  })
}
