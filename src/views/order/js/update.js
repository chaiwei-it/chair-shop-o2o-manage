import lib from '@/assets/js/lib.js'
const { ajax, api } = lib
export default {
  data() {
    return {
      id: '',
      form: {
        id: '',
        username: '',
        mobile: '',
        address: '',
        shippingCode: '',
      },
      details: {
        address: '',
      }
    }
  },

  mounted() {
    this.id = this.$route.query.id,
    this.getDetails()
  },

  methods: {

    getDetails() {
      const callback = (data) => {
        this.details = data
        this.form.id = data.id
        this.form.username = data.address.username
        this.form.mobile = data.address.mobile
        this.form.address = data.address.address
        this.form.shippingCode = data.shippingCode
      }
      ajax(api.orderSelect, 'POST', { id: this.id }, callback)
    },

    update() {
      const callback = (data) => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        window.history.go(-1)
      }
      ajax(api.orderUpdate, 'POST', this.form, callback)
    },

    // 取消返回上一页
    cancel() {
      window.history.go(-1)
    }

  }
}
