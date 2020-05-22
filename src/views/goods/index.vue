<template>
  <div>
    <el-row class="spec-button">
      <el-button type="primary" @click="toAddView">添加</el-button>
      <el-input v-model="pager.name" placeholder="名称" class="name"></el-input>
      <el-select v-model="pager.classId" clearable placeholder="全部" @change="getPager">
        <el-option
          v-for="item in goodsClass"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="pager.status" clearable placeholder="全部" @change="getPager">
        <el-option
          v-for="item in status"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getPager">查询</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="thumbnailImage" label="缩略图" width="120" sortable> 
        <template slot-scope="scope"> 
          <img :src="scope.row.thumbnailImage" width="100" height="100"/> 
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="120" sortable> </el-table-column>
      <el-table-column prop="className" label="分类" width="80" sortable> </el-table-column>
      <el-table-column prop="typeName" label="类型" width="80" sortable> </el-table-column>
      <el-table-column prop="status" label="是否展示" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" size="small" type="info">即将发售</el-tag>
          <el-tag v-if="scope.row.status == 2" size="small" type="">正在售卖</el-tag>
          <el-tag v-if="scope.row.status == 3" size="small" type="">已下架</el-tag>
          <!-- <el-tag v-if="scope.row.status == 4" size="small" type="">已下架</el-tag>
          <el-tag v-if="scope.row.status == 5" size="small" type="">违规</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="成本" width="100" sortable> </el-table-column>
      <el-table-column prop="originalPrice" label="原价" width="100" sortable> </el-table-column>
      <el-table-column prop="nowPrice" label="现价" width="100" sortable> </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" sortable> </el-table-column>
      <el-table-column prop="sales" label="销量" width="100" sortable> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="toData" width="165"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toUpdateView(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.status == 1" size="mini" @click="toUpdateStatus(scope.row.id, 2)">上架</el-button>
          <el-button v-if="scope.row.status == 2" size="mini" @click="toUpdateStatus(scope.row.id, 3)">下架</el-button>
          <el-button v-if="scope.row.status == 3" size="mini" @click="toUpdateStatus(scope.row.id, 2)">上架</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <!-- <el-button size="mini" type="primary" @click="toValue(scope.row.id)">值</el-button> -->
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
  </div>
</template>

<script>
  import lib from '@/assets/js/lib.js'
  const { ajax, api, getOldPager, dateFormat } = lib
  export default {
    data() {
      return {
        tableData: [],
        pager: {
          name: '',
          classId: '',
          status: '',
          pageIndex: 1,
          pageSize: 10,
          orderBy: 'create_time desc'
        },
        goodsClass: [],
        status: [{
          value: 1,
          label: '即将发售'
        }, {
          value: 2,
          label: '正在售卖'
        }, {
          value: 3,
          label: '已下架'
        }],
        form: {
          id: '',
          name: '',
          classId: '',
          specIds: [],
          showStatus: '',
          sortNum: ''
        },
        specList: [],
        total: 0
      }
    },

    mounted() {
      var pager = getOldPager()
      if (pager != null && pager !== '') {
        this.pager = pager
      }
      this.getPager()
      this.getClassList()
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
        ajax(api.goodsPager, 'POST', this.pager, callback)
      },

      getClassList() {
        const callback = (data) => {
          this.goodsClass = data.list
        }
        ajax(api.goodsClassList, 'POST', {}, callback)
      },

      handleDelete(id) {
        this.$confirm('确认删除该类型吗?', '提示', {
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
          ajax(api.goodsDelete, 'POST', { id: id }, callback)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      toUpdateStatus(id, status) {
        const form = ({
          id: id,
          status: status
        })
        const callback = (data) => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getPager()
        }
        ajax(api.goodsUpdateStatus, 'POST', form, callback)
      },

      toUpdateView(id) {
        this.$router.push({ name: 'GoodsUpdate', params: { id: id }})
      },

      toAddView() {
        this.$router.push({ name: 'GoodsAdd' })
      },

      toDetailsView(id) {
        this.$router.push({ name: 'GoodsDetails', params: { id: id }})
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