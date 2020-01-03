export default {
  data() {
    return {
      homeTop: 0
    }
  },

  activated() {
    document.getElementById('app').scrollTop = this.homeTop || 0
  },

  beforeRouteEnter (to, from, next) {
    console.log(to.meta.keepAlive,'enter')
    // if (from.name != 'shopDetail') to.meta.keepAlive = false
    next()
  },

  beforeRouteLeave(to, from, next) {
    console.log(to.name,from.name,'leave')
    // if (to.name == 'shopDetail') from.meta.keepAlive = true
    let app = document.getElementById('app')
    this.homeTop = app.scrollTop || 0
    next()
  }
}