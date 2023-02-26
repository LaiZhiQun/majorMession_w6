<template>
  <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <!-- 判斷是否為新增產品 -->
            <span v-if="isNew">新增店家</span>
            <span v-else>編輯店家</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">

              <div class="mb-3">
                <label for="imageUrl" class="form-label">主要圖片</label>
                <input v-model="tempProduct.imageUrl" type="text" class="form-control mb-2" placeholder="請輸入圖片連結">
                <!-- 顯示放入 tempProduct.imageUrl 的圖片 -->
                <img class="img-fluid" :src="tempProduct.imageUrl">
              </div>
              <div>
                <!-- 以新增空值的方式，點擊後新增圖片欄位 -->
                <!-- :disabled="tempProduct.imagesUrl[tempProduct.imagesUrl.length-1]==''" -->
                <button :disabled="isDisabled" class="btn btn-outline-primary btn-sm d-block w-100" @click="addMoreImage">
                  新增更多圖片
                </button>
              </div>
              <!-- 新增的圖片欄位 -->
              <div class="mb-2" v-for="(imgUrl, key) in tempProduct.imagesUrl" :key="key">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label mt-3">輸入圖片網址</label>
                  <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl[key]">
                </div>
                <img class="img-fluid" :src="imgUrl" :alt="imgUrl">
                <button class="btn btn-outline-danger btn-sm d-block w-100" @click="$emit('removeImage', key)">
                  刪除
                </button>
              </div>

            </div>
            <!-- 表單 -->
            <!-- 將所有欄位與 tempProduct 雙向綁定 -->
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">店家</label>
                <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">城市</label>
                  <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                    placeholder="請輸入分類">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input id="origin_price" v-model.number="tempProduct.origin_price" type="number" min="0"
                    class="form-control" placeholder="請輸入原價">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input id="price" v-model.number="tempProduct.price" type="number" min="0" class="form-control"
                    placeholder="請輸入售價">
                </div>
              </div>
              <hr>

              <div class="mb-3">
                <label for="description" class="form-label">蝦池種類</label>
                <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
                  placeholder="請輸入產品描述">
                          </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">地址</label>
                <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
                  placeholder="請輸入說明內容">
                          </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                    :true-value="1" :false-value="0">
                  <label class="form-check-label" for="is_enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="$emit('updateProduct', tempProduct)">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '../mixins/modalMixin'
// const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  props: ['product', 'isNew'],
  data () {
    return {
      tempProduct: {}
    }
  },
  watch: {
    product () {
      this.tempProduct = this.product
    }
  },
  mixins: [modalMixin],
  emits: ['updateProduct', 'removeImage'],
  computed: {
    isDisabled () {
      // 判斷是否為陣列
      if (!Array.isArray(this.tempProduct.imagesUrl)) {
        return false
      }
      // 判斷陣列最後一個值是否為空字串
      return this.tempProduct.imagesUrl.slice(-1)[0] === ''
    }
  },
  methods: {
    addMoreImage () {
      this.tempProduct.imagesUrl = Array.isArray(this.tempProduct.imagesUrl) ? this.tempProduct.imagesUrl : []
      this.tempProduct.imagesUrl.push('')
    }
  }
}
</script>
