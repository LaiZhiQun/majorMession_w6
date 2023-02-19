<template>
  購物車頁面
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th class="text-end">總價</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="cart.carts">
        <tr v-for="item in cart.carts" :key="item.id">
          <td>
            <!-- :disabled="item.id === loadingItem" -->
            <button @click="deleteCartItem(item)" type="button" class="btn btn-outline-danger btn-sm">
              <!-- <i class="fas fa-spinner fa-pulse"></i> -->
              x
            </button>
          </td>
          <td>
            {{ item.product.title }}
          </td>
          <td>
            <div class="input-group input-group-sm">
              <!-- :disabled="item.id === loadingItem" -->
              <select @change="updateCartItem(item)" name="" id="" class="form-select" v-model="item.qty">
                <option v-for="i in 20" :key="`${i}34`" :value="i">{{ i }}</option>
              </select>
            </div>
          </td>
          <td class="text-end">
            {{ item.total }}
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="text-end">總計</td>
        <td class="text-end">{{ cart.final_total }}</td>
      </tr>
      <tr>
        <td colspan="3" class="text-end text-success">折扣價</td>
        <td class="text-end text-success">{{ cart.final_total }}</td>
      </tr>
    </tfoot>
  </table>
  這是表單
  <hr>
  <div class="my-5 row justify-content-center">
    <VForm ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <VField id="email" name="email" type="email" class="form-control" :class="{ 'is-invalid': errors['email'] }"
          placeholder="請輸入 Email" rules="email|required" v-model="form.user.email"></VField>
        <error-message name="email" class="invalid-feedback"></error-message>
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <VField id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
          placeholder="請輸入姓名" rules="required" v-model="form.user.name"></VField>
        <error-message name="姓名" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <VField id="tel" name="電話" type="text" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
          placeholder="請輸入電話" rules="required|min:8|max:10" v-model="form.user.tel"></VField>
        <error-message name="電話" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <VField id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
          placeholder="請輸入地址" rules="required" v-model="form.user.address"></VField>
        <error-message name="地址" class="invalid-feedback"></error-message>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea name="" id="message" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger">送出訂單</button>
      </div>
    </VForm>
  </div>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      products: [],
      productId: '',
      cart: {},
      loadingItem: '', // 存購物車 id
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getCarts () {
      this.$http({
        method: 'get',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/cart`
      }).then(res => {
        this.cart = res.data.data
      })
    },
    updateCartItem (item) { // 分別要帶入購物車 id 與 產品 id
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      // 點擊時，將購物車 id 先存起來
      this.$http({
        method: 'put',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${item.id}`,
        data: { data }
      }).then(res => {
        this.getCarts()
      })
    },
    deleteCartItem (item) {
      this.$http({
        method: 'delete',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${item.id}`
      }).then(res => {
        this.getCarts()
      })
    },
    createOrder () {
      const order = this.form
      this.$http({
        method: 'post',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/order`,
        data: { data: order }
      }).then((response) => {
        alert(response.data.message)
        this.$refs.form.resetForm()
        this.getCarts()
        this.form.message = ''
      })
    },
    deleteAllCarts () {
      this.$http({
        method: 'delete',
        url: `${VITE_APP_URL}api/${VITE_APP_PATH}/carts`
      }).then(res => {
        this.getCarts()
      })
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>
