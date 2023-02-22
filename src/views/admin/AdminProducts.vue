<template>
  後台產品列表
  <hr>
  <div class="container">
    <div class="text-end mt-4">
      <button @click="openModal('new')" class="btn btn-primary">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">{{ item.origin_price }}</td>
          <td class="text-end">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button @click="openModal('edit', item)" type="button" class="btn btn-outline-primary btn-sm">
                編輯
              </button>
              <button @click="openModal('delete', item)" type="button" class="btn btn-outline-danger btn-sm">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁元件 -->
    <PaginationComponent :pages="page" :getProducts="getProductsList"></PaginationComponent>
  </div>
</template>

<script>
import PaginationComponent from '../../components/PaginationComponent.vue'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      isNew: false, // 確認是新增或編輯的判斷
      page: {}
    }
  },
  components: {
    PaginationComponent
    // delComponent
  },
  methods: {
    checkLogin () {
      const loader = this.$loading.show()
      this.$http({
        method: 'post',
        url: `${VITE_APP_URL}api/user/check`
      }).then(res => {
        // 若為登入狀態，則顯示產品列表
        this.getProductsList()
        loader.hide()
      }).catch(err => {
        // 若登入失敗，則回到登入頁面
        alert(err.data.message)
        this.$router.push('/login')
      })
    },
    // 選擇打開 modal 視窗的種類
    // 編輯時，將資料帶進 tempProduct，productModal 的 input 欄位與資料雙向綁定，即可看到原先資料
    // openModal (isNew, item) {
    //   if (isNew === 'edit') {
    //     this.tempProduct = { ...item }
    //     this.isNew = false
    //     productModal.show()
    //   }
    //   // 為了顯示 title，需先將資料帶入 tempProduct
    //   else if (isNew === 'delete') {
    //     this.tempProduct = { ...item }
    //     delProductModal.show()
    //   }
    //   // 新增時，則清空 tempProduct
    //   else if (isNew === 'new') {
    //     this.tempProduct = {
    //       imagesUrl: []
    //     }
    //     this.isNew = true
    //     productModal.show()
    //   }
    // },
    getProductsList (page = 1) { // 預設第一頁
      const loader = this.$loading.show()
      this.$http({
        method: 'get',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/admin/products/?page=${page}`
      }).then(res => {
        this.products = res.data.products
        this.page = res.data.pagination
        loader.hide()
      }).catch(err => {
        alert(err.data.message)
      })
    },
    removeImage (key) {
      this.tempProduct.imagesUrl.splice(key, 1)
    }
    // closeModal (state) {
    //   if (state === 'del') {
    //     delProductModal.hide()
    //   }
    // }
  },
  mounted () {
    // 選取 產品 Modal
    // productModal = new bootstrap.Modal(document.querySelector('#productModal'))
    // delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'))
    // this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = token
    this.checkLogin()
  }
}
</script>
