<template>
  <div class="extension">
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
      
      <el-table-column prop="keywords" label="类型" width="100" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.keywords == 'newest'" size="small" type="">最新商品</el-tag>
          <el-tag v-if="scope.row.keywords == 'hottest'" size="small" type="">最火商品</el-tag>
          <el-tag v-if="scope.row.keywords == 'recommend'" size="small" type="">推荐商品</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="thumbnailImage" label="商品图片" width="100" sortable> 
        <template slot-scope="scope"> 
          <img v-if="scope.row.goods" :src="scope.row.goods.thumbnailImage" width="80" height="80"/> 
        </template>
      </el-table-column>
      <el-table-column prop="goods.name" label="商品名称" width="200" sortable> </el-table-column>
      <!-- <el-table-column prop="notes" label="说明" width="150" sortable> </el-table-column> -->
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
        <el-form-item label="类型">
          <el-select v-model="form.keywords" placeholder="请选择">
            <el-option
              v-for="item in keywords"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="form.goodsId" placeholder="请选择">
            <el-option 
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        <el-form-item label="类型">
          <el-select v-model="form.keywords" placeholder="请选择">
            <el-option
              v-for="item in keywords"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="form.goodsId" placeholder="请选择">
            <el-option 
              v-for="item in goodsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
          goodsId: '',
          keywords: '',
          sortNum: ''
        },
        keywords: [{
          value: 'newest',
          label: '最新商品'
        }, {
          value: 'hottest',
          label: '最火商品'
        }, {
          value: 'recommend',
          label: '推荐商品'
        }],
        total: 0,
        fileUrl: api.uploadImage,
        dialogVisible: false,
        dialogImageUrl: '',
        goodsList: []
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
        ajax(api.extensionPager, 'POST', this.pager, callback)
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
          ajax(api.extensionDelete, 'POST', { id: id }, callback)
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
        this.getGoodList()
      },

      toAddView() {
        this.vacant()
        this.addView = true
        this.getGoodList()
      },

      // 获取商品列表
      getGoodList() {
        const callback = (data) => {
          this.goodsList = data.list
        }
        ajax(api.goodsList, 'POST', this.pager, callback)
      },

      add(form) {
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
            ajax(api.extensionAdd, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      update(form) {
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
            ajax(api.extensionUpdate, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      getDetails(id) {
        const callback = (data) => {
          this.form.id = data.id
          this.form.keywords = data.keywords
          this.form.goodsId = data.goodsId
          this.form.sortNum = data.sortNum
        }
        ajax(api.extensionSelect, 'POST', { id: id }, callback)
      },

      vacant() {
        this.form.id = ''
        this.form.keywords = ''
        this.form.goodsId = ''
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
