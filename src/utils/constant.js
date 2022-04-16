/**
 * 常用的常量
 */

//品牌管理相关常量
const brandConstant = {
  brand_logo_folder_name: "/brand/logo/images/" //品牌logo文件夹路径前缀
}
//商品相关
const goodsConstant = {
  goods_folder_name: "/goods/images/",
  goods_sku_folder_name: "/goods/sku/images/" //商品规格详细信息绑定的图片路径
}
//用户相关
const adminUserConstant = {
  admin_user_avatar: "/admin/avatar/", //管理用户头像
  admin_qualification_materials: "/admin/qualificationMaterials/" //资质材料
}

//首页录播图
const homepageConstant = {
  homepage_carousel_folder_name: "/homepage/carousel/images/" //首页轮播图文件夹路径前缀
}


export {
  brandConstant,
  goodsConstant,
  adminUserConstant,
  homepageConstant
};
