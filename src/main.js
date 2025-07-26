// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')




import { createApp } from 'vue'
import App from './App.vue'
import VanillaTilt from 'vanilla-tilt'

const app = createApp(App)

app.directive('tilt', {
  mounted(el, binding) {
    VanillaTilt.init(el, binding.value || {})
  },
  unmounted(el) {
    el.vanillaTilt?.destroy()
  }
})

app.mount('#app')
