<template>
  <div class="agent">
    <el-row class="spec-button">
      <el-input v-model="pager.username" placeholder="名称" class="name"></el-input>
      <el-select v-model="pager.agentStatus" placeholder="请选择" @change="getPager">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="pager.payStatus" placeholder="请选择" @change="getPager">
        <el-option
          v-for="item in payStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getPager">查询</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" sortable> </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120" sortable> </el-table-column>
      <el-table-column prop="province" label="省" width="70" sortable> </el-table-column>
      <el-table-column prop="city" label="市" width="70" sortable> </el-table-column>
      <el-table-column prop="area" label="区" width="70" sortable> </el-table-column>
      <el-table-column prop="grade" label="级别" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.grade == 1" size="small" type="">普通会员</el-tag>
          <el-tag v-if="scope.row.grade == 2" size="small" type="info">VIP会员</el-tag>
          <el-tag v-if="scope.row.grade == 3" size="small" type="">总代理</el-tag>
          <el-tag v-if="scope.row.grade == 4" size="small" type="warning">区级合伙人</el-tag>
          <el-tag v-if="scope.row.grade == 5" size="small" type="danger">市级合伙人</el-tag>
          <el-tag v-if="scope.row.grade == 6" size="small" type="success">省级合伙人</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="agentStatus" label="状态" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.agentStatus == 1" size="small" type="info">待审核</el-tag>
          <el-tag v-if="scope.row.agentStatus == 2" size="small" type="success">已审核</el-tag>
          <el-tag v-if="scope.row.agentStatus == 3" size="small" type="danger">审核不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="加入时间" :formatter="toData" width="165"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toUpdateView(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="success" v-if="scope.row.agentStatus == 1" @click="toExamineView(scope.row.id)">审核</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.agentStatus == 3" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="审核" :visible.sync="examineView" width="400px">
      <el-form ref="form" :model="examineForm" label-width="100px" size="small">
        <el-form-item label="是否通过">
          <el-switch v-model="examineForm.agentStatus" :active-value="2" :inactive-value="3"></el-switch>
        </el-form-item>
        <el-form-item label="是否返利" v-if="examineForm.agentStatus == 2">
          <el-switch v-model="examineForm.rebateStatus" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="不通过原因" v-if="examineForm.agentStatus == 3">
          <el-input v-model="examineForm.reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="examine('form')">确定</el-button>
          <el-button @click="examineView = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="updateView" width="500px">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.grade" placeholder="请选择">
            <el-option
              v-for="item in grade"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        pager: {
          username: '',
          agentStatus: 0,
          payStatus: 1,
          pageIndex: 0,
          pageSize: 10,
          orderBy: 'create_time desc'
        },
        updateView: false,
        form: {
          username: '',
          mobile: '',
          grade: ''
        },
        grade: [{
          value: 1,
          label: '普通会员'
        }, {
          value: 2,
          label: 'VIP会员'
        }, {
          value: 3,
          label: '总代理'
        }, {
          value: 4,
          label: '区级合伙人'
        }, {
          value: 5,
          label: '市级合伙人'
        }, {
          value: 6,
          label: '省级合伙人'
        }],
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { max: 16, message: '用户名最长为16位', trigger: 'blur' }
          ]
        },
        payStatus: [{
          value: 0,
          label: '待支付'
        }, {
          value: 1,
          label: '已支付'
        }],
        options: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '待审核'
        }, {
          value: 2,
          label: '审核通过'
        }, {
          value: 3,
          label: '审核不通过'
        }],
        examineView: false,
        examineForm: {
          id: '',
          agentStatus: 2,
          rebateStatus: 1,
          reason: ''
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
        ajax(api.agentPager, 'POST', this.pager, callback)
      },

      toUpdateView(id) {
        this.vacant()
        this.getDetails(id)
        this.updateView = true
      },

      getDetails(id) {
        const callback = (data) => {
          this.form.id = data.id
          this.form.username = data.username
          this.form.mobile = data.mobile
          this.form.grade = data.grade
        }
        ajax(api.agentSelect, 'POST', { id: id }, callback)
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
            ajax(api.agentUpdate, 'POST', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      toExamineView(id) {
        this.examineView = true
        this.examineForm.id = id
      },

      examine() {
        const callback = (data) => {
          this.examineView = false
          this.getPager()
          this.$message({
            message: '审核成功',
            type: 'success'
          })
        }
        ajax(api.agentUpdate, 'POST', this.examineForm, callback)
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
          ajax(api.agentDelete, 'POST', { id: id }, callback)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      vacant() {
        this.form.id = ''
        this.form.username = ''
        this.form.mobile = ''
        this.form.grade = ''
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