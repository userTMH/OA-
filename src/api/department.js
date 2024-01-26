import service from '@/utils/request'

//部门列表
export function departmentApi() {
  return service({
    url: '/company/department',
    method: 'GET'
  })
}

//新增
export function addDepartment(data) {
  return service({
    url: '/company/department',
    method: 'POST',
    data
  })
}

//数据详情
export function detailDepartment(id) {
  return service({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

//编辑
export function editDepartment(id, data) {
  return service({
    url: `/company/department/${id}`,
    method: 'PUT',
    data
  })
}

//删除
export function deleteDepartment(id) {
  return service({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
