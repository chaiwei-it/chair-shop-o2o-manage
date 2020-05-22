<template>
  <div class="user">
    <el-row class="spec-button">
      <el-input v-model="pager.username" placeholder="名称" class="name"></el-input>
      <el-button @click="getPager">查询</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" sortable> </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120" sortable> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="120" sortable> </el-table-column>
      <el-table-column prop="userNum" label="ID" width="100" sortable> </el-table-column>
      <el-table-column prop="level" label="层级" width="80" sortable> </el-table-column>
      <el-table-column prop="parent.username" label="上级名称" width="120" sortable> </el-table-column>
      <el-table-column prop="parent.userNum" label="上级ID" width="100" sortable> </el-table-column>
      <el-table-column prop="grade" label="级别" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.grade == 1" size="small" type="info">普通会员</el-tag>
          <el-tag v-if="scope.row.grade == 2" size="small" type="info">VIP会员</el-tag>
          <el-tag v-if="scope.row.grade == 3" size="small" type="">总代理</el-tag>
          <el-tag v-if="scope.row.grade == 4" size="small" type="warning">区级合伙人</el-tag>
          <el-tag v-if="scope.row.grade == 5" size="small" type="danger">市级合伙人</el-tag>
          <el-tag v-if="scope.row.grade == 6" size="small" type="success">省级合伙人</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额" width="100" sortable> </el-table-column>
      <el-table-column prop="createTime" label="加入时间" :formatter="toData" width="165"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toUpdateView(scope.row.id)">编辑</el-button>
          <!-- <el-button size="mini" type="danger" @click="delete(scope.row.id)">删除</el-button> -->
          <el-button size="mini" type="primary" @click="toChildrenView(scope.row.id)">下级</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="下级代理" :visible.sync="childrenView" width="1300px" lock-scroll>
      <el-row class="spec-button">
        <!-- <el-input v-model="pager.name" placeholder="名称" class="name"></el-input>
        <el-button @click="getChildrenList">查询</el-button> -->
        <el-select v-model="childList.num" placeholder="请选择" @change="getChildrenList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-table :data="childTableData" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" sortable> </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120" sortable> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="120" sortable> </el-table-column>
        <el-table-column prop="userNum" label="ID" width="100" sortable> </el-table-column>
        <el-table-column prop="level" label="层级" width="80" sortable> </el-table-column>
        <el-table-column prop="parent.username" label="上级名称" width="120" sortable> </el-table-column>
        <el-table-column prop="parent.userNum" label="上级ID" width="100" sortable> </el-table-column>
        <el-table-column prop="grade" label="级别" width="120" sortable> 
          <template slot-scope="scope">
            <el-tag v-if="scope.row.grade == 1" size="small" type="info">普通会员</el-tag>
            <el-tag v-if="scope.row.grade == 2" size="small" type="info">VIP会员</el-tag>
            <el-tag v-if="scope.row.grade == 3" size="small" type="">总代理</el-tag>
            <el-tag v-if="scope.row.grade == 4" size="small" type="warning">区级合伙人</el-tag>
            <el-tag v-if="scope.row.grade == 5" size="small" type="danger">市级合伙人</el-tag>
            <el-tag v-if="scope.row.grade == 6" size="small" type="success">省级合伙人</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="100" sortable> </el-table-column>
        <el-table-column prop="createTime" label="加入时间" :formatter="toData" width="165"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="updateView" width="500px">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="ID" prop="userNum">
          <el-input v-model="form.userNum"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="上级ID" prop="parentNum">
          <el-input v-model="form.parentNum"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance"></el-input>
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
  const { ajax, api, dateFormat } = lib
  export default {
    data() {
      return {
        tableData: [],
        childTableData: [],
        childrenView: false,
        updateView: false,
        pager: {
          username: '',
          email: '',
          moible: '',
          status: '',
          pageIndex: 0,
          pageSize: 10,
          orderBy: 'create_time desc'
        },
        childList: {
          username: '',
          parentId: '',
          num: 0
        },
        form: {
          username: '',
          email: '',
          mobile: '',
          userNum: '',
          parentNum: '',
          balance: ''
        },
        options: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '一级'
        }, {
          value: 2,
          label: '二级'
        }, {
          value: 3,
          label: '三级'
        }],
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { max: 16, message: '用户名最长为16位', trigger: 'blur' }
          ],
          userNum: [
            { required: true, message: '请输入用户编号', trigger: 'blur' },
            { max: 8, message: '用户编号最长为8位', trigger: 'blur' }
          ],
          parentNum: [
            { required: true, message: '请输入上级编号', trigger: 'blur' }
            // { max: 8, message: '上级编号最长为8位', trigger: 'blur' }
          ],
          balance: [
            { required: true, message: '请输入余额', trigger: 'blur' }
          ]
        },
        currentPage: 1,
        total: 0
      }
    },
    mounted() {
      this.getPager()
    },
    methods: {
      toData(row, column) {
        return dateFormat(row, column)
      },

      handleSizeChange(val) {
        console.log('每页' + val + '条')
        this.pager.pageSize = val
        this.getPager()
      },

      handleCurrentChange(val) {
        console.log('当前页: ' + val)
        this.pager.pageIndex = val
        this.getPager()
      },

      getPager() {
        const callback = (data) => {
          this.tableData = data.list
          this.total = data.total
        }
        ajax(api.userRebatePager, 'POST', this.pager, callback)
      },

      handleDelete(id) {
        this.$confirm('确认删除该用户吗?', '提示', {
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
          ajax(api.userDelete, 'POST', { id: id }, callback)
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

      toChildrenView(userId) {
        this.childTableData = []
        this.childList.parentId = userId
        this.childList.num = 0
        this.getChildrenList()
        this.childrenView = true
      },

      getChildrenList() {
        const callback = (data) => {
          this.childTableData = data.list
        }
        ajax(api.userRebateList, 'POST', this.childList, callback)
      },

      getDetails(id) {
        const callback = (data) => {
          this.form.id = data.id
          this.form.username = data.username
          this.form.userNum = data.userNum
          this.form.email = data.email
          this.form.mobile = data.mobile
          if (data.parent) {
            this.form.parentNum = data.parent.userNum
          } else {
            this.form.parentNum = 0
          }
          this.form.balance = data.balance
        }
        ajax(api.userSelect, 'POST', { id: id }, callback)
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
            ajax(api.userUpdate, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      vacant() {
        this.form.id = ''
        this.form.username = ''
        this.form.email = ''
        this.form.mobile = ''
        this.form.userNum = ''
        this.form.parentNum = ''
        this.form.status = ''
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