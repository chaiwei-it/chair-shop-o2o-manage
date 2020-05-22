<template>
  <div class="spec">
    <el-row class="spec-button">
      <el-button type="primary" @click="toAddView">添加</el-button>
      <el-input v-model="pager.name" placeholder="名称" class="name"></el-input>
      <el-button @click="getPager">查询</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" label="名称" width="120" sortable> </el-table-column>
      <el-table-column prop="showStatus" label="是否展示" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.showStatus == 0" size="small" type="info">已停用</el-tag>
          <el-tag v-if="scope.row.showStatus == 1" size="small" type="">已启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sortNum" label="排序" width="100" sortable> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="toData" width="165"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toUpdateView(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="primary" @click="toValue(scope.row.id)">值</el-button>
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
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="是否展示">
          <!-- <el-input v-model="form.showStatus"></el-input> -->
          <el-switch v-model="form.showStatus" :active-value="1" :inactive-value="0"></el-switch>
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
    <el-dialog title="修改" :visible.sync="updateView" width="500px">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="是否展示">
          <el-switch v-model="form.showStatus" :active-value="1" :inactive-value="0"></el-switch>
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
  const { ajax, api, getOldPager, setOldPager, dateFormat } = lib
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
          name: '',
          showStatus: 1,
          sortNum: ''
        },
        total: 0
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
        ajax(api.specPager, 'POST', this.pager, callback)
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
          ajax(api.specDelete, 'POST', { id: id }, callback)
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
            ajax(api.specAdd, 'POST', this.form, callback)
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
            ajax(api.specUpdate, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      getDetails(id) {
        const callback = (data) => {
          this.form.id = data.id
          this.form.name = data.name
          this.form.showStatus = data.showStatus
          this.form.sortNum = data.sortNum
        }
        ajax(api.specSelect, 'POST', { id: id }, callback)
      },

      toValue(id) {
        setOldPager(this.pager)
        this.$router.push({ name: 'SpecValue', params: { id: id }})
      },

      vacant() {
        this.form.id = ''
        this.form.name = ''
        this.form.showStatus = 1
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
</style>