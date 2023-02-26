<template>
  這是後台訂單列表
  <hr>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, key) in orders" :key="key">
        <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
          <td>{{ $filters.date(item.create_at) }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" :id="`paidSwitch${item.id}`" v-model="item.is_paid"
                @change="updatePaid(item)" />
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" type="button" @click="openModal(item)">
                檢視
              </button>
              <button class="btn btn-outline-danger btn-sm" type="button" @click="openDelOrderModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"></OrderModal>
  <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"></DelModal>
  <PaginationComponent :pages="pagination" @emitPages="getOrders"></PaginationComponent>
  <ToastMessages></ToastMessages>
</template>

<script>
import PaginationComponent from '../../components/PaginationComponent.vue'
import DelModal from '../../components/DelOrderModal.vue'
import OrderModal from '../../components/OrderModal.vue'
import ToastMessages from '../../components/ToastMessages.vue'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      orders: {},
      isNew: false,
      pagination: {},
      tempOrder: {},
      currentPage: 1
    }
  },
  components: {
    PaginationComponent,
    DelModal,
    OrderModal,
    ToastMessages
  },
  methods: {
    // 避免在後台訂單頁面直接重新整理(F5)時，getOrders在驗證登入前就預先載入導致吃不到資料，所以先驗證登入狀態
    checkLogin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
      this.$http.defaults.headers.common.Authorization = token
      this.$http({
        method: 'post',
        url: `${VITE_APP_URL}api/user/check`
      }).then(res => {
        if (!res.data.success) {
          this.$router.push('/login')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getOrders (currentPage = 1) {
      this.currentPage = currentPage
      const loader = this.$loading.show()
      this.$http({
        method: 'get',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/admin/orders?page=${currentPage}`
      }).then((res) => {
        this.orders = res.data.orders
        this.pagination = res.data.pagination
        loader.hide()
      }).catch((error) => {
        alert(error.response)
      })
    },
    openModal (item) {
      this.tempOrder = { ...item }
      this.isNew = false
      this.$refs.orderModal.openModal()
    },
    // 打開刪除的 modal
    openDelOrderModal (item) {
      this.tempOrder = { ...item }
      this.$refs.delModal.openModal()
    },
    // 更改付款狀態
    updatePaid (item) {
      const loader = this.$loading.show()
      const paid = {
        is_paid: item.is_paid
      }
      this.$http({
        method: 'put',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/admin/order/${item.id}`,
        data: { data: paid }
      }).then(res => {
        this.$refs.orderModal.hideModal()
        this.getOrders(this.currentPage)
        loader.hide()
        // 將參數帶到 pushMessageState.js 的函式
        this.$httpMessageState(res, '更新付款狀態')
      }).catch((err) => {
        alert(err.response)
      })
    },
    // 按下確認刪除後觸發此函式
    delOrder () {
      const loader = this.$loading.show()
      this.$http({
        method: 'delete',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/admin/order/${this.tempOrder.id}`
      }).then(res => {
        this.$refs.delModal.hideModal()
        loader.hide()
        this.getOrders(this.currentPage)
      }).catch(err => {
        console.log(err)
        alert(err.response)
      })
    }
  },
  mounted () {
    this.checkLogin()
    this.getOrders()
  }
}
// ToastMessages:
</script>
