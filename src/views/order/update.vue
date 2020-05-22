<template>
  <div>
  	<el-form ref="details" :model="details" label-width="120px" :inline="true" style="margin-top: 20px">
      <div class="className"><div>基本信息</div></div>
      <!-- 基本信息 -->
      <el-form-item label="订单编号" prop="orderSn">
        <span>{{details.orderSn}}</span>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <span v-if="details.orderStatus==10">待支付</span>
        <span v-if="details.orderStatus==20">待发货</span>
        <span v-if="details.orderStatus==30">待发货</span>
        <span v-if="details.orderStatus==40">已确认</span>
        <span v-if="details.orderStatus==100">已取消</span>
      </el-form-item>
      <el-form-item label="商品金额" prop="orderStatus">
        <span>{{details.goodsPrice}}元</span>
      </el-form-item>
      <el-form-item label="支付金额" prop="orderStatus">
        <span>{{details.payPrice}}元</span>
      </el-form-item>
      <el-form-item label="优惠金额" prop="orderStatus">
        <span>{{details.discount}}元</span>
      </el-form-item>
      <el-form-item label="邮费" prop="orderStatus">
        <span>{{details.shippingPrice}}元</span>
      </el-form-item>
      <div class="className"><div>买家信息</div></div>
      <!-- 收货信息 -->
      <el-form-item label="用户名" prop="buyerName">
        <span>{{details.buyerName}}</span>
      </el-form-item>
      <el-form-item label="手机号" prop="buyerMobile">
        <span>{{details.buyerMobile}}</span>
      </el-form-item>
      <div class="className"><div>商品信息</div></div>
      <!-- 商品信息 -->
      <el-table :data="details.goodsList" border style="width: 100%">
        <el-table-column prop="goodsImage" label="缩略图" width="120" sortable> 
          <template slot-scope="scope"> 
            <img :src="scope.row.goodsImage" width="100" height="100"/> 
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="名称" width="200" sortable> </el-table-column>
        <el-table-column prop="goodsNum" label="数量" width="100" sortable> </el-table-column>
        <el-table-column prop="goodsPrice" label="单价" width="100" sortable> </el-table-column>
        <el-table-column prop="goodsPrice" label="总价" width="100" sortable> 
          <template slot-scope="scope"> 
            <span>{{scope.row.goodsPrice * scope.row.goodsNum}}</span> 
          </template>
        </el-table-column>
        <el-table-column prop="specInfo" label="规格" width="200" sortable> </el-table-column>
      </el-table>
      <div class="className"><div>收货信息</div></div>
      <!-- 收货信息 -->
      <el-form-item label="收货人" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="收货人手机号" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address"></el-input>
      </el-form-item>
      <div class="className"><div>发货信息</div></div>
      <!-- 发货信息 -->
      <el-form-item label="快递单号" prop="shippingCode">
        <el-input v-model="form.shippingCode"></el-input>
        </el-form-item>
      </el-form-item>
      <div style="width: 100%; height: 80px;"></div>
      <el-form-item label="">
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="update('form')">修改</el-button>
        <el-button @click="cancel">返回</el-button>
      </el-form-item>
      <div style="width: 100%; height: 80px;"></div>
    </el-form>
  </div>
</template>

<script src="./js/update.js">

</script>

<style scoped>
	.goodsAdd {
    /*width: 500px;*/
    /*margin: 50px auto;*/
  }

  .className {
    margin: 30px 0px;
    padding: 0 50px;
    height: 50px;
    background-color: #d9ebf8;
  }
  .className div{
    line-height: 50px;
    color: #0c65d2;
    font-size: 18px;
  }

  .form-left{
    width: 45%;
  }

  .el-form-item .el-form-item{
    width: 100%;
  }

  .el-form-item {
    width: 45%;
  }

  .el-form-item__content .el-input .el-input__inner {
    width: 400px;
  }
  .cell .el-input .el-input__inner {
    width: 100%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .thumbnailImage {
    width: 100px;
    height: 100px;
    display: block;
  }
  .oblongImage {
    width: 250px;
    height: 100px;
    display: block;
  }
  .exhibitionImage {
    width: 250px;
    height: 100px;
    display: block;
  }
/*  .detailImage {
    width: 750px;
    height: 300px;
    display: block;
  }*/

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
   
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
