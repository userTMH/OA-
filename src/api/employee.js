import service from '@/utils/request'

//员工列表
export function userApi(params) {
  return service({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

//excel导出
export function exportEmployeeApi() {
  return service({
    url: '/sys/user/export',
    method: 'GET',
    responseType: 'blob'
  })
}

//导出下载模版
export function getExportTemplateApi() {
  return service({
    url: '/sys/user/import/template',
    method: 'GET',
    responseType: 'blob'
  })
}

//批量-导入员工
export function importEmployeeApi(data) {
  return service({
    url: '/sys/user/import',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

//删除-员工
export function removeEmployeeApi(id) {
  return service({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

//新增-员工
export function addEmployeeApi(data) {
  return service({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

//获取-员工-基本信息
export function getEmployeeDetailApi(id) {
  return service({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

//修改-员工-基本信息
export function updateEmployeeDetailApi(id, data) {
  return service({
    url: `/sys/user/${id}`,
    method: 'PUT',
    data
  })
}

//获取员工基本信息
export function userListApi(id) {
  return service({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}
