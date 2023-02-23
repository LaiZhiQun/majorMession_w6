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
    <!-- 元件 -->
    <PaginationComponent :pages="page" :getProducts="getProductsList"></PaginationComponent>
    <DelComponent ref="DelComponent" @closeModal="closeModal" :tempProduct="tempProduct"
      :getProductsList="getProductsList"></DelComponent>
    <ProductModalComponent ref="productModal" @updateProduct="updateProduct" :product="tempProduct" @removeImage="removeImage">
    </ProductModalComponent>
  </div>
</template>

<script>
import PaginationComponent from '../../components/PaginationComponent.vue'
import DelComponent from '../../components/DelComponent.vue'
import ProductModalComponent from '../../components/ProductModalComponent.vue'
import { Modal } from 'bootstrap'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
// let delProductModal = {}
export default {
  data () {
    return {
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      isNew: false, // 確認是新增或編輯的判斷
      page: {},
      delProductModal: {},
      productModal: {}
    }
  },
  components: {
    PaginationComponent,
    DelComponent,
    ProductModalComponent
  },
  methods: {
    updateProduct () {
      if (!this.isNew) {
        // 編輯資料 put
        const loader = this.$loading.show()
        this.$http({
          method: 'put',
          url: `${VITE_APP_URL}api/${VITE_APP_PATH}/admin/product/${this.tempProduct.id}`,
          data: {
            data: this.tempProduct
          }
        }).then(res => {
          loader.hide()
          alert(res.data.message)
          this.$refs.productModal.hideModal()
          this.getProductsList()
        })
          .catch(err => {
            alert(err.data.message)
          })
      } else {
        // 新增資料 post
        const loader = this.$loading.show()
        this.$http({
          method: 'post',
          url: `${VITE_APP_URL}api/${VITE_APP_PATH}/admin/product`,
          data: {
            data: this.tempProduct
          }
        }).then(res => {
          loader.hide()
          alert(res.data.message)
          this.$refs.productModal.hideModal()
          this.getProductsList()
        }).catch(err => {
          alert(err.data.message)
        })
      }
    },
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
    openModal (isNew, item) {
      if (isNew === 'edit') {
        this.tempProduct = { ...item }
        this.isNew = false
        this.$refs.productModal.openModal()
      } else if (isNew === 'delete') { // 為了顯示 title，需先將資料帶入 tempProduct
        this.tempProduct = { ...item }
        this.delProductModal.show()
      } else if (isNew === 'new') { // 新增時，則清空 tempProduct
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        this.$refs.productModal.openModal()
      }
    },
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
    },
    closeModal (state) {
      if (state === 'del') {
        this.delProductModal.hide()
      }
    }
  },
  mounted () {
    // 選取 產品 Modal
    // this.productModal = new Modal(this.$refs.ProductModal.$refs.productModal)
    this.delProductModal = new Modal(this.$refs.DelComponent.$refs.delProductModal)
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = token
    this.checkLogin()
  }
}
</script>
