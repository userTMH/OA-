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
