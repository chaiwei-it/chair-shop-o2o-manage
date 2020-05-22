<template>
  <div class="order">
    <el-row class="spec-button">
      <el-input v-model="pager.orderSn" placeholder="订单号" class="name"></el-input>
      <el-select v-model="pager.orderStatus" placeholder="请选择" @change="getPager">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getPager">查询</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="orderSn" label="订单号" width="200" sortable> </el-table-column>
      <el-table-column prop="buyerName" label="买家" width="120" sortable> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="toData" width="165"></el-table-column>
      <el-table-column prop="shouldPrice" label="订单总金额" width="120" sortable> </el-table-column>
      <el-table-column prop="payPrice" label="支付金额" width="120" sortable> </el-table-column>
      <el-table-column prop="paymentName" label="支付方式" width="100" sortable> </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" width="120" sortable> 
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus == 10" size="small" type="info">待付款</el-tag>
          <el-tag v-if="scope.row.orderStatus == 20" size="small" type="success">待发货</el-tag>
          <el-tag v-if="scope.row.orderStatus == 30" size="small" type="danger">待收货</el-tag>
          <el-tag v-if="scope.row.orderStatus == 40" size="small" type="danger">已确认</el-tag>
          <el-tag v-if="scope.row.orderStatus == 100" size="small" type="danger">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toDetailsView(scope.row.id)">查看</el-button>
          <el-button size="mini" type="success" @click="toUpdateView(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="success" v-if="scope.row.orderStatus == 20" @click="toShippingView(scope.row.id)">发货</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.orderStatus == 100" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="发货" :visible.sync="shippingView" width="500px">
      <el-form ref="form" :model="shippingForm" label-width="100px" size="small">
        <el-form-item label="收货人">
          <span>{{shippingForm.username}}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{shippingForm.mobile}}</span>
        </el-form-item>
        <el-form-item label="收货地址">
          <span>{{shippingForm.address}}</span>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="shippingForm.shippingCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="orderShipping('form')">发货</el-button>
          <el-button @click="shippingView = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import lib from '@/assets/js/lib.js'
const { ajax, api, setOldPager, getOldPager, dateFormat } = lib
export default {
  data() {
    return {
      tableData: [],
      currentPage: 2,
      total: 0,
      pager: {
        orderSn: '',
        orderStatus: '',
        pageIndex: 0,
        pageSize: 10,
        orderBy: 'create_time desc'
      },
      options: [{
        value: 10,
        label: '待支付'
      }, {
        value: 20,
        label: '待发货'
      }, {
        value: 30,
        label: '待收货'
      }, {
        value: 40,
        label: '已确认'
      }, {
        value: 100,
        label: '已取消'
      }],
      shippingView: false,
      shippingForm: {
        id: '',
        username: '',
        mobile: '',
        provinceName: '',
        cityName: '',
        areaName: '',
        address: '',
        shippingCode: ''
      }
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
      ajax(api.orderPager, 'POST', this.pager, callback)
    },

    toDetailsView(id) {
      setOldPager(this.pager)
      this.$router.push({ name: 'OrderDetails', query: { id: id }})
    },

    toUpdateView(id) {
      setOldPager(this.pager)
      this.$router.push({ name: 'OrderUpdate', query: { id: id }})
    },

    toShippingView(id) {
      this.getDetails(id)
      this.shippingView = true
    },

    getDetails(id) {
      const callback = (data) => {
        this.shippingForm.id = data.id
        this.shippingForm.username = data.address.username
        this.shippingForm.mobile = data.address.mobile
        this.shippingForm.provinceName = data.address.provinceName
        this.shippingForm.cityName = data.address.cityName
        this.shippingForm.areaName = data.address.areaName
        this.shippingForm.address = data.address.address
      }
      ajax(api.orderSelect, 'POST', { id: id }, callback)
    },

    orderShipping() {
      const callback = (data) => {
        this.getPager()
        this.shippingView = false
        this.$message({
          type: 'success',
          message: '发货成功!'
        })
      }
      ajax(api.orderShipping, 'POST', this.shippingForm, callback)
    },

    handleDelete(id) {
      this.$confirm('确认删除该订单吗?', '提示', {
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
        ajax(api.agentDelete, 'DELETE', { id: id }, callback)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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