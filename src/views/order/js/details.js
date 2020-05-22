import lib from '@/assets/js/lib.js'
const { ajax, api } = lib
export default {
  data() {
    return {
      id: '',
      form: {
        shippingCode: '',
      },
      details: {
        address: {}
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
      }
      ajax(api.orderSelect, 'POST', { id: this.id }, callback)
    },

    // 取消返回上一页
    cancel() {
      window.history.go(-1)
    }

  }
}
