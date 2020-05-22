<template>
  <div class="goodsAdd">
  	<el-form ref="form" :rules="rules" :model="form" label-width="120px" :inline="true" style="margin-top: 20px">
      <div class="className"><div>基本信息</div></div>
      <!-- 基本信息 -->
      <el-form-item label="类型" prop="typeId">
        <el-select v-model="form.typeId" placeholder="请选择" @change="typeChange">
          <el-option
            v-for="item in goodsType"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input v-model="form.subtitle"></el-input>
      </el-form-item>
      <!-- 价格信息 -->
      <div class="className"><div>价格信息</div></div>
      <el-form-item label="成本价" prop="costPrice">
        <el-input v-model="form.costPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="原价（市场价）" prop="originalPrice">
        <el-input v-model="form.originalPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="现价" prop="nowPrice">
        <el-input v-model="form.nowPrice" type="number"></el-input>
      </el-form-item>
      <!-- 图片信息 -->
      <div class="className"><div>图片信息</div></div>
       <el-form-item label="缩略图" prop="thumbnailImage">
        <el-upload
          class="avatar-uploader"
          :action="fileUrl"
          multiple
          name="files"
          :show-file-list="false"
          :onError="uploadError"
          :onSuccess="uploadThumbnailImageSuccess"
          :beforeUpload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview">
          <img v-if="form.thumbnailImage" :src="form.thumbnailImage" class="thumbnailImage">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="首页长图" prop="oblongImage">
        <el-upload
          class="avatar-uploader"
          :action="fileUrl"
          multiple
          name="files"
          :show-file-list="false"
          :onError="uploadError"
          :onSuccess="uploadOblongImageSuccess"
          :beforeUpload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview">
          <img v-if="form.oblongImage" :src="form.oblongImage" class="oblongImage">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="轮播图">
        <el-upload
          :action="fileUrl"
          multiple
          name="files"
          list-type="picture-card"
          :onError="uploadError"
          :onSuccess="uploadExhibitionImageSuccess"
          :beforeUpload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="uploadExhibitionImageRemove">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情图" prop="detailImage">
        <el-upload
          :action="fileUrl"
          multiple
          name="files"
          list-type="picture-card"
          :onError="uploadError"
          :onSuccess="uploadDetailImageSuccess"
          :beforeUpload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="uploadDetailImageRemove">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        
      </el-form-item>
      <div class="className"><div>规格信息</div></div>
      <!-- 规格信息 -->
      <el-form-item label="是否启用规格">
          <el-switch v-model="form.goodsSpecStatus"></el-switch>
        </el-form-item>
      <!-- 库存信息 -->
      <el-form-item label="库存" prop="stock">
        <el-input v-model="form.stock" v-if="form.goodsSpecStatus" :disabled="stockStatus"></el-input>
        <el-input v-model="form.stock" v-else></el-input>
      </el-form-item>
      <div class="el-form-item">
        <el-form-item v-if="form.goodsSpecStatus" v-for="specItem in spec" :label="specItem.name" :key="specItem.id">
          <el-checkbox-group v-model="form.specList[specItem.id]" @change="specChange">
            <el-checkbox :label="valueItem.id" :key="valueItem.id" v-model="valueItem.id" 
            v-for="valueItem in specItem.value">{{valueItem.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <el-form-item label="规格" v-if="form.goodsSpecStatus">
        <el-table :data="form.goodsSpecList" border style="">
          <el-table-column prop="specNames" label="规格信息" width="120"> 
            <template slot-scope="scope">
              <el-input v-model="scope.row.specNames"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="costPrice" label="成本价" width="120"> 
            <template slot-scope="scope">
              <el-input v-model="scope.row.costPrice" type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="originalPrice" label="原价（市场价）" width="120"> 
            <template slot-scope="scope">
              <el-input v-model="scope.row.originalPrice" type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="nowPrice" label="现价" width="120"> 
            <template slot-scope="scope">
              <el-input v-model="scope.row.nowPrice" type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="120"> 
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" type="number" @change="stockChange(scope)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 返利信息 -->
      <div class="className"><div>返利信息</div></div>
      <el-form-item label="普通会员" prop="memberPrice">
        <el-input v-model="form.memberPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="VIP会员" prop="vipPrice">
        <el-input v-model="form.vipPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="总代理" prop="agentPrice">
        <el-input v-model="form.agentPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="区域代理" prop="areaPrice">
        <el-input v-model="form.areaPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="市级代理" prop="cityPrice">
        <el-input v-model="form.cityPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="省级代理" prop="provincePrice">
        <el-input v-model="form.provincePrice" type="number"></el-input>
      </el-form-item>
      <div style="width: 100%; height: 80px;"></div>
      <el-form-item label="">
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit('form')">添加</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
      <div style="width: 100%; height: 80px;"></div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script src="./js/add.js">

</script>

<style>
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
