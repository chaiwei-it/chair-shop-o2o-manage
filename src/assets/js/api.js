
const api = {
  uploadImage: '/api/v1/upload/image',

  login: '/api/v1/login',                           // --- 进行登录

  userRebatePager: '/api/v1/userRebate/pager', 
  userRebateList: '/api/v1/userRebate/list',                 // --- 用户分页
  userSelect: '/api/v1/userRebate/select',                // --- 用户详情
  userUpdate: '/api/v1/userRebate/update',                 // --- 用户修改
  userDelete: '/api/v1/userRebate/delete',                 // --- 用户删除

  putforwardPager: '/api/v1/putforward/pager', 
  putforwardSelect: '/api/v1/putforward/selete',
  putforwardUpdate: '/api/v1/putforward/update',
  putforwardDelete: '/api/v1/putforward/delete',

  agentPager: '/api/v1/agent/pager',                  // --- 代理分页
  agentUpdate: '/api/v1/agent/update',
  agentSelect: '/api/v1/agent/select',
  agentDelete: '/api/v1/agent/delete',

  specPager: '/api/v1/spec/pager',                  // --- 代理分页
  specSelect: '/api/v1/spec/select',                  // --- 代理分页
  specUpdate: '/api/v1/spec/update',                  // --- 代理分页
  specAdd: '/api/v1/spec',                  // --- 代理分页
  specDelete: '/api/v1/spec/delete',                  // --- 代理分页
  specList: '/api/v1/spec/list',
  typeSpecList: '/api/v1/spec/typeSpecList',

  specValuePager: '/api/v1/specValue/pager',                  // --- 代理分页
  specValueSelect: '/api/v1/specValue/select',                  // --- 代理分页
  specValueUpdate: '/api/v1/specValue/update',                  // --- 代理分页
  specValueAdd: '/api/v1/specValue',                  // --- 代理分页
  specValueDelete: '/api/v1/specValue/delete',                  // --- 代理分页

  goodsClassPager: '/api/v1/goodsClass/pager',                  // --- 代理分页
  goodsClassSelect: '/api/v1/goodsClass/select',                  // --- 代理分页
  goodsClassUpdate: '/api/v1/goodsClass/update',                  // --- 代理分页
  goodsClassAdd: '/api/v1/goodsClass',                  // --- 代理分页
  goodsClassDelete: '/api/v1/goodsClass/delete',
  goodsClassList: '/api/v1/goodsClass/list',

  goodsTypePager: '/api/v1/goodsType/pager',                  // --- 代理分页
  goodsTypeSelect: '/api/v1/goodsType/select',                  // --- 代理分页
  goodsTypeUpdate: '/api/v1/goodsType/update',                  // --- 代理分页
  goodsTypeAdd: '/api/v1/goodsType',                  // --- 代理分页
  goodsTypeDelete: '/api/v1/goodsType/delete',
  goodsTypeList: '/api/v1/goodsType/list',

  goodsPager: '/api/v1/goods/pager',                  // --- 代理分页
  goodsSelect: '/api/v1/goods/select',                  // --- 代理分页
  goodsUpdate: '/api/v1/goods/update',                  // --- 代理分页
  goodsAdd: '/api/v1/goods',                  // --- 代理分页
  goodsDelete: '/api/v1/goods/delete',
  goodsList: '/api/v1/goods/list', 
  goodsUpdateStatus: '/api/v1/goods/updateStatus',

  orderPager: '/api/v1/order/pager',                  // --- 代理分页
  orderSelect: '/api/v1/order/select',                  // --- 代理分页
  orderUpdate: '/api/v1/order/update',                  // --- 代理分页
  orderAdd: '/api/v1/order',                  // --- 代理分页
  orderDelete: '/api/v1/order/delete',
  orderShipping: '/api/v1/order/shipping',

  bannerPager: '/api/v1/banner/pager',                  // --- 代理分页
  bannerSelect: '/api/v1/banner/select',                  // --- 代理分页
  bannerUpdate: '/api/v1/banner/update',                  // --- 代理分页
  bannerAdd: '/api/v1/banner',                  // --- 代理分页
  bannerDelete: '/api/v1/banner/delete',

  extensionPager: '/api/v1/extension/pager',                  // --- 代理分页
  extensionSelect: '/api/v1/extension/select',                  // --- 代理分页
  extensionUpdate: '/api/v1/extension/update',                  // --- 代理分页
  extensionAdd: '/api/v1/extension',                  // --- 代理分页
  extensionDelete: '/api/v1/extension/delete'
}
export default api
