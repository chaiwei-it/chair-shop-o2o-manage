import lib from '@/assets/js/lib.js'
const { ajax, api } = lib
export default {
  data() {
    return {
      fileUrl: api.uploadImage,
      details: {
        id: this.$route.params.id
      },
      goodsType: [],
      exhibitionImage: '',
      specValueList: {},
      detailImage: '',
      form: {
        typeId: '',
        name: '',
        subtitle: '',
        costPrice: '',
        originalPrice: '',
        nowPrice: '',
        thumbnailImage: '',
        oblongImage: '',
        exhibitionImage: '',
        detailImage: '',
        goodsSpecStatus: false,
        specList: {},
        goodsSpecList: [],
        stock: 0,
        memberPrice: 0,
        vipPrice: 0,
        agentPrice: 0,
        areaPrice: 0,
        cityPrice: 0,
        provincePrice: 0
      },
      dialogVisible: false,
      dialogImageUrl: '',
      stockStatus: false,
      spec: [],
      rules: {
        typeId: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 16, message: '用户名最长为16位', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '请输入副标题', trigger: 'blur' }
        ],
        costPrice: [
          { required: true, message: '请属于成本价', trigger: 'blur' }
        ],
        originalPrice: [
          { required: true, message: '请属于原价', trigger: 'blur' }
        ],
        nowPrice: [
          { required: true, message: '请属于现价', trigger: 'blur' }
        ],
        thumbnailImage: [
          { required: true, message: '请上传缩略图', trigger: 'blur' }
        ],
        oblongImage: [
          { required: true, message: '请上传首页长图', trigger: 'blur' }
        ],
        detailImage: [
          { required: true, message: '请上传详情图', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ],
        memberPrice: [
          { required: true, message: '请输入普通会员返利', trigger: 'blur' }
        ],
        vipPrice: [
          { required: true, message: '请输入VIP会员返利', trigger: 'blur' }
        ],
        agentPrice: [
          { required: true, message: '请输入总代理返利', trigger: 'blur' }
        ],
        areaPrice: [
          { required: true, message: '请输入区域代理返利', trigger: 'blur' }
        ],
        cityPrice: [
          { required: true, message: '请输入市级代理返利', trigger: 'blur' }
        ],
        provincePrice: [
          { required: true, message: '请输入省级代理返利', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.getTypeList()
  },

  methods: {
    // 获取类型信息
    getTypeList() {
      const callback = (data) => {
        this.goodsType = data.list
      }
      ajax(api.goodsTypeList, 'POST', {}, callback)
    },

    // 跟新类型规格
    typeChange() {
      const callback = (data) => {
        this.spec = data.list
        this.form.specList = {}
        this.specValueList = {}
        for (var num in data.list) {
          this.form.specList[data.list[num].id] = []
          var specValueList = data.list[num].value
          for (var key in specValueList) {
            this.specValueList[specValueList[key].id] = specValueList[key]
          }
        }
        this.form.goodsSpecList = []
        console.log(this.specValueList)
      }
      ajax(api.typeSpecList, 'POST', { typeId: this.form.typeId }, callback)
    },

    // 跟新规格列表
    specChange() {
      var valueList = []
      for (var goodsSpecId in this.form.specList) {
        var specValueList = this.form.specList[goodsSpecId]
        if (specValueList.length > 0) {
          var oldList = valueList
          valueList = []
          console.log(specValueList)
          for (var i = 0; i < specValueList.length; i++) {
            var specValue = specValueList[i]
            if (oldList.length > 0) {
              for (var item in oldList) {
                var goodsSpecValue = {}
                goodsSpecValue.specIds = oldList[item].specIds + ',' + this.specValueList[specValue].id
                goodsSpecValue.specNames = oldList[item].specNames + ',' + this.specValueList[specValue].name
                valueList.push(goodsSpecValue)
              }
            } else {
              var goodsSpecValue2 = {}
              goodsSpecValue2.specIds = this.specValueList[specValue].id
              goodsSpecValue2.specNames = this.specValueList[specValue].name
              valueList.push(goodsSpecValue2)
            }
          }
        }
      }
      this.form.goodsSpecList = []
      for (var item2 in valueList) {
        var goodsSpec = {}
        goodsSpec.specIds = valueList[item2].specIds
        goodsSpec.specNames = valueList[item2].specNames
        goodsSpec.costPrice = 0
        goodsSpec.originalPrice = 0
        goodsSpec.nowPrice = 0
        goodsSpec.stock = 0
        this.form.goodsSpecList.push(goodsSpec)
      }
      if (valueList.length > 0) {
        this.stockStatus = true
      } else {
        this.stockStatus = false
      }
      
    },

    stockChange(scope) {
      console.log(this.form.goodsSpecList)
      var totalStock = 0
      for (var num = 0; num < this.form.goodsSpecList.length; num++) {
        var stock = this.form.goodsSpecList[num].stock
        totalStock = parseInt(totalStock) + parseInt(stock)
      }
      this.form.stock = totalStock
    },

    numInput(e) {
      this.val = e.replace(/[^\d]/g, '')
    },

    // 上传缩略图成功
    uploadThumbnailImageSuccess(response, file, fileList) {
      if (response.code === 20000) {
        this.form.thumbnailImage = response.url
      }
    },

    // 上传首页长图成功
    uploadOblongImageSuccess(response, file, fileList) {
      if (response.code === 20000) {
        this.form.oblongImage = response.url
      }
    },

    // 上传轮播长图成功
    uploadExhibitionImageSuccess(response, file, fileList) {
      console.log(fileList)
      if (response.code === 20000) {
        this.exhibitionImage = fileList
      }
    },

    // 上传详情成功
    uploadDetailImageSuccess(response, file, fileList) {
      if (response.code === 20000) {
        this.detailImage = fileList
      }
    },

    // 上传轮播长图删除
    uploadExhibitionImageRemove(file, fileList) {
      this.exhibitionImage = fileList
    },

    // 上传详情图删除
    uploadDetailImageRemove(file, fileList) {
      this.detailImage = fileList
    },

    // 上传格式化
    uploadImageFormat(fileList) {
      var url = ''
      for (var num = 0; num < fileList.length; num++) {
        var response = fileList[num].response
        if (num === 0) {
          url = response.url
        } else {
          url = url + ',' + response.url
        }
      }
      return url
    },

    // 打开详情
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 上传错误
    uploadError(response, file, fileList) {
      console.log('上传失败，请重试！')
    },

    // 上传前的判断
    beforeAvatarUpload(file) {
      console.log('上传前判断')
    },

    // 提交
    onSubmit(form) {
      this.form.exhibitionImage = this.uploadImageFormat(this.exhibitionImage)
      this.form.detailImage = this.uploadImageFormat(this.detailImage)
      this.form.specList = JSON.stringify(this.form.specList)
      this.$refs[form].validate((valid) => {
        if (valid) {
          const callback = (data) => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            window.history.go(-1)
          }
          ajax(api.goodsAdd, 'POST', this.form, callback)
        } else {
          this.$message({
            message: '请输入必填字段',
            type: 'error'
          })
          return false
        }
      })
    },

    // 取消返回上一页
    cancel() {
      window.history.go(-1)
    }
  }
}
