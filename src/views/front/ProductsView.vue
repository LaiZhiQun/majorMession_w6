<template>
  這是產品列表頁面
  <table class="table">
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td class="align-middle">{{ product.title }}</td>
        <td><img :src="product.imageUrl" width="200" alt=""></td>
        <td class="align-middle">
          <RouterLink :to="`/product/${product.id}`">前往產品細節</RouterLink>
          <button @click.prevent="addToCart(product.id)" type="button" class="btn btn-outline-primary ms-3">加入購物車</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { RouterLink } from 'vue-router'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: []
    }
  },
  components: {
    RouterLink
  },
  methods: {
    getProducts () {
      const loader = this.$loading.show()
      this.$http({
        method: 'get',
        url: `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/products/all`
      }).then((res) => {
        // console.log(res)
        this.products = res.data.products
        loader.hide()
      })
    },
    addToCart (id) {
      const loader = this.$loading.show()
      const data = {
        product_id: id,
        qty: 1
      }
      this.$http({
        method: 'post',
        url: `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart`,
        data: { data }
      }).then((res) => {
        loader.hide()
        alert(res.data.message)
      })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
