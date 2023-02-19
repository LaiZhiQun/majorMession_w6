<template>
  這是登入畫面
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal">
        請先登入
      </h1>
      <div class="col-8">
        <form id="form" class="form-signin">
          <div class="form-floating mb-3">
            <input v-model="username" type="email" class="form-control" id="username" placeholder="name@example.com"
              required autofocus>
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
            <label for="password">Password</label>
          </div>
          <button @click.prevent="login" class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">
      &copy; 2021~∞ - 六角學院
    </p>
  </div>
</template>

<script>
const { VITE_APP_URL } = import.meta.env
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$http({
        method: 'post',
        url: `${VITE_APP_URL}admin/signin`,
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        const { token, expired } = res.data
        document.cookie = `myToken=${token};expires=${new Date(expired)}; path=/`
        alert(res.data.message)
        this.$router.push('/admin/products')
      }).catch(err => {
        alert(err.response.data.message)
      })
    }
  }
}
</script>
