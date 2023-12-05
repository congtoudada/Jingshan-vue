import request from '@/utils/request'

//请求N页数据
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

//修改审核状态
export function updateStatus(id, status) {
  return request({
    url: '/article/update_status',
    method: 'post',
    params: { id, status }
  })
}

//删除记录
export function deleteArticle(id) {
  return request({
    url: '/article/delete',
    method: 'post',
    params: { id }
  })
}

// export function createArticle(data) {
//   return request({
//     url: '/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/article/update',
//     method: 'post',
//     data
//   })
// }
