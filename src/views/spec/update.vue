<template>
  <div class="specEdit">
    <el-form ref="form" :model="form" label-width="80px">
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
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib.js'
  const { ajax, api } = lib
  export default {
    data() {
      return {
        details: {
          id: this.$route.params.id
        },
        value5: '100',
        form: {
          id: '',
          name: '',
          showStatus: '',
          sortNum: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 16, message: '用户名最长为16位', trigger: 'blur' }
          ],
          showStatus: [
            { required: true, message: '请选择是否显示', trigger: 'blur' }
          ],
          sortNum: [
            { required: true, message: '请输入排序编号', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.getDetails()
    },
    methods: {
      getDetails() {
        const callback = (data) => {
          this.form.id = data.id
          this.form.name = data.name
          this.form.showStatus = data.showStatus
          this.form.sortNum = data.sortNum
        }
        ajax(api.specSelect, 'POST', this.details, callback)
      },

      test(val) {
        console.log(val)
      },

      onSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const callback = (data) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              window.history.go(-1)
            }
            console.log(this.form.showStatus)
            ajax(api.specUpdate, 'PUT', this.form, callback)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      cancel() {
        window.history.go(-1)
      }
    }
  }
</script>

<style>
.specEdit {
  width: 400px;
  margin: 50px auto;
}
</style>