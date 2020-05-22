<template>
  <div class="banner">
  	<el-row class="spec-button">
      <el-button type="primary" @click="toAddView">添加</el-button>
      <el-select v-model="pager.keywords" placeholder="请选择" @change="getPager">
        <el-option
          v-for="item in keywords"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getPager">查询</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="thumbnailImage" label="展示图" width="180" sortable> 
        <template slot-scope="scope"> 
          <img :src="scope.row.imageUrl" width="150" height="56"/> 
        </template>
      </el-table-column>
      <el-table-column prop="keywords" label="位置" width="80" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.keywords == 'index'" size="small" type="info">首页</el-tag>
          <!-- <el-tag v-if="scope.row.showStatus == 1" size="small" type="">已启用</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="relation" label="关联类型" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.relation == 1" size="small" type="">商品</el-tag>
          <el-tag v-if="scope.row.relation == 2" size="small" type="">页面</el-tag>
          <el-tag v-if="scope.row.relation == 3" size="small" type="">图片</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="关联内容" width="200" sortable> </el-table-column>
      <el-table-column prop="notes" label="说明" width="150" sortable> </el-table-column>
      <el-table-column prop="sortNum" label="排序" width="100" sortable> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toUpdateView(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page.sync="pager.pageIndex"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="添加" :visible.sync="addView" width="500px">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="展示图">
          <el-upload
            class="avatar-uploader"
            :action="fileUrl"
            multiple
            name="files"
            :show-file-list="false"
            :onError="uploadError"
            :onSuccess="uploadImageSuccess"
            :beforeUpload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="form.keywords" placeholder="请选择">
            <el-option
              v-for="item in keywords"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联类型">
          <el-select v-model="form.relation" placeholder="请选择" @change="typeChange">
            <el-option
              v-for="item in relation"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联内容">
          <el-select v-model="form.content" placeholder="请选择" v-if="form.relation == 1">
            <el-option 
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="form.content" placeholder="请选择" v-else-if="form.relation == 2">
            <el-option 
              v-for="item in pageList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-upload v-else-if="form.relation == 3"
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
          <el-input v-model="form.content" v-else></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.notes"></el-input>
        </el-form-item>
        <el-form-item label="排序编号">
          <el-input v-model="form.sortNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add('form')">添加</el-button>
          <el-button @click="addView = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="修改" :visible.sync="updateView" width="500px">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="展示图">
          <el-upload
            class="avatar-uploader"
            :action="fileUrl"
            multiple
            name="files"
            :show-file-list="false"
            :onError="uploadError"
            :onSuccess="uploadImageSuccess"
            :beforeUpload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="form.keywords" placeholder="请选择">
            <el-option
              v-for="item in keywords"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联类型">
          <el-select v-model="form.relation" placeholder="请选择" @change="typeChange">
            <el-option
              v-for="item in relation"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联内容">
          <el-select v-model="form.content" placeholder="请选择" v-if="form.relation == 1">
            <el-option 
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="form.content" placeholder="请选择" v-else-if="form.relation == 2">
            <el-option 
              v-for="item in pageList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-upload v-else-if="form.relation == 3"
            :action="fileUrl"
            multiple
            name="files"
            :file-list="content"
            list-type="picture-card"
            :onError="uploadError"
            :onSuccess="uploadDetailImageSuccess"
            :beforeUpload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="uploadDetailImageRemove">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-input v-model="form.content" v-else></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.notes"></el-input>
        </el-form-item>
        <el-form-item label="排序编号">
          <el-input v-model="form.sortNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update('form')">修改</el-button>
          <el-button @click="updateView = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib.js'
  const { ajax, api, getOldPager, dateFormat } = lib
  export default {
    data() {
      return {
        tableData: [],
        addView: false,
        updateView: false,
        pager: {
          name: '',
          pageIndex: 1,
          pageSize: 10,
          orderBy: 'sort_num asc'
        },
        form: {
          id: '',
          imageUrl: '',
          notes: '',
          content: '',
          keywords: '',
          relation: '',
          sortNum: ''
        },
        keywords: [{
          value: 'index',
          label: '首页'
        }, {
          value: '2',
          label: '其它'
        }],
        relation: [{
          value: 1,
          label: '商品'
        }, {
          value: 2,
          label: '页面'
        }, {
          value: 3,
          label: '图片'
        }],
        total: 0,
        fileUrl: api.uploadImage,
        dialogVisible: false,
        dialogImageUrl: '',
        goodsList: [],
        pageList: [{
          id: '/pages/partner/index',
          name: '会员升级'
        }],
        content: []
      }
    },
    mounted() {
      var pager = getOldPager()
      if (pager != null && pager !== '') {
        this.pager = pager
      }
      this.getPager()
    },
    methods: {
      toData(row, column) {
        return dateFormat(row, column)
      },

      handleSizeChange(val) {
        this.pager.pageSize = val
        this.getPager()
      },

      handleCurrentChange(val) {
        this.pager.pageIndex = val
        this.getPager()
      },

      getPager() {
        const callback = (data) => {
          this.tableData = data.list
          this.total = data.total
          this.pager.pageIndex = data.pageIndex
          if (data.pageIndex > data.maxPages) {
            this.pager.pageIndex = data.maxPages
            this.getPager()
          }
        }
        ajax(api.bannerPager, 'POST', this.pager, callback)
      },

      handleDelete(id) {
        this.$confirm('确认删除该规格吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const callback = (data) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPager()
          }
          ajax(api.bannerDelete, 'POST', { id: id }, callback)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      toUpdateView(id) {
        this.vacant()
        this.getDetails(id)
        this.updateView = true
      },

      toAddView() {
        this.vacant()
        this.addView = true
      },

      // 上传前的判断
      beforeAvatarUpload(file) {
        console.log('上传前判断')
      },

      // 上传错误
      uploadError(response, file, fileList) {
        console.log('上传失败，请重试！')
      },

      // 打开详情
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      // 上传展示图成功
      uploadImageSuccess(response, file, fileList) {
        if (response.code === 20000) {
          this.form.imageUrl = response.url
        }
      },

      // 上传详情成功
      uploadDetailImageSuccess(response, file, fileList) {
        if (response.code === 20000) {
          this.content = fileList
        }
      },

      // 详情图删除
      uploadDetailImageRemove(file, fileList) {
        this.content = fileList
      },

      // 上传格式化
      uploadImageFormat(fileList) {
        var url = ''
        for (var num = 0; num < fileList.length; num++) {
          console.log(fileList[num])
          var response = fileList[num].response
          if (num === 0) {
            url = response.url
          } else {
            url = url + ',' + response.url
          }
        }
        return url
      },

      // 跟新类型规格
      typeChange() {
        console.log(this.form.relation)
        if (this.form.relation === 1) {
          const callback = (data) => {
            this.goodsList = data.list
          }
          ajax(api.goodsList, 'POST', this.pager, callback)
        }
      },

      add(form) {
        if (this.form.relation === 3) {
          this.form.content = this.uploadImageFormat(this.content)
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
            const callback = (data) => {
              this.addView = false
              this.getPager()
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            ajax(api.bannerAdd, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      update(form) {
        if (this.form.relation === 3) {
          this.form.content = this.uploadImageFormat(this.content)
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
            const callback = (data) => {
              this.updateView = false
              this.getPager()
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
            ajax(api.bannerUpdate, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      getDetails(id) {
        const callback = (data) => {
          this.form.id = data.id
          this.form.imageUrl = data.imageUrl
          this.form.keywords = data.keywords
          this.form.relation = data.relation
          this.form.notes = data.notes
          this.form.sortNum = data.sortNum
          if (this.form.relation === 1) {
            const callback = (data) => {
              this.goodsList = data.list
            }
            ajax(api.goodsList, 'POST', this.pager, callback)
          }
          if (this.form.relation === 3) {
            var detailImageList = data.content.split(',')
            for (var key in detailImageList) {
              var response = {}
              response.url = detailImageList[key]
              var detailImage = {}
              detailImage.url = detailImageList[key]
              detailImage.response = response
              this.content.push(detailImage)
            }
          } else {
            this.form.content = data.content
          }
          console.log(this.content)
        }
        ajax(api.bannerSelect, 'POST', { id: id }, callback)
      },

      vacant() {
        this.form.id = ''
        this.form.imageUrl = ''
        this.form.keywords = ''
        this.form.relation = ''
        this.form.notes = ''
        this.form.content = ''
        this.content = []
        this.form.sortNum = ''
      }
    }
  }
</script>

<style>
.spec-button{
  height: 60px;
  padding: 10px;
}
.name{
  width: 200px;
  margin-left: 50px;
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
  width: 146px;
  height: 146px;
  line-height: 146px;
  text-align: center;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
}
</style>
