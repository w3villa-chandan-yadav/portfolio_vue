<template>
  <div :class="['app', theme]">
    <!-- Decorative blobs -->
    <div class="blob blob-1" :style="blobStyle(20, 15, 1.1)"></div>
    <div class="blob blob-2" :style="blobStyle(80, 75, 0.9)"></div>

    <!-- NAV -->
    <header class="nav" :class="{ scrolled: scrolled }">
      <div class="brand" @click="scrollTo('home')">
        <span class="dot"></span> {{ name }}
      </div>

      <nav>
        <a
          v-for="s in sections"
          :key="s.id"
          :href="'#' + s.id"
          :class="{ active: activeSection === s.id }"
          @click.prevent="scrollTo(s.id)"
        >
          {{ s.label }}
        </a>
      </nav>

      <button class="theme-toggle" @click="toggleTheme" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`">
        <span v-if="theme === 'dark'">🌞</span>
        <span v-else>🌙</span>
      </button>
    </header>

    <!-- MAIN -->
    <main @mousemove="onMouseMove">
      <!-- HERO -->
      <section id="home" class="section hero" v-reveal>
        <h1 class="gradient-text">Hi, I’m {{ name }}.</h1>
        <h2 class="typewriter">
          <span>{{ typewriterText }}</span><span class="caret">|</span>
        </h2>
        <p class="tagline">
          I design delightful interfaces, craft resilient frontends, and tell stories with code.
        </p>

        <div class="cta">
          <button @click="scrollTo('work')">See my work</button>
          <button class="ghost" @click="scrollTo('contact')">Get in touch</button>
        </div>

        <div class="socials">
          <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noreferrer">
            {{ s.label }}
          </a>
        </div>
      </section>

      <!-- ABOUT -->
      <section id="about" class="section about" v-reveal>
        <h3 class="section-title">About</h3>
        <p>
          I’m a creative developer who loves building immersive, accessible products. I care about
          performance, craft, and the tiny details that make people smile.
        </p>
        <ul class="chips">
          <li v-for="skill in topSkills" :key="skill">{{ skill }}</li>
        </ul>
      </section>

      <!-- WORK / PROJECTS -->
      <section id="work" class="section work" v-reveal>
        <h3 class="section-title">Selected Work</h3>

        <div class="grid">
          <article
            v-for="p in projects"
            :key="p.title"
            class="card"
            v-tilt
            tabindex="0"
            @keydown.enter="open(p.href)"
            @click="open(p.href)"
          >
            <div class="card-header">
              <h4>{{ p.title }}</h4>
              <span class="badge">{{ p.year }}</span>
            </div>
            <p class="desc">{{ p.description }}</p>
            <ul class="tags">
              <li v-for="t in p.tags" :key="t">{{ t }}</li>
            </ul>
          </article>
        </div>
      </section>

      <!-- TIMELINE -->
      <section id="timeline" class="section timeline" v-reveal>
        <h3 class="section-title">Timeline</h3>
        <ul class="tl">
          <li v-for="item in timeline" :key="item.when">
          <span class="dot"></span>
          <div class="content">
            <span class="when">{{ item.when }}</span>
            <h4>{{ item.title }}</h4>
            <p>{{ item.summary }}</p>
          </div>
          </li>
        </ul>
      </section>

      <!-- CONTACT -->
      <section id="contact" class="section contact" v-reveal>
        <h3 class="section-title">Contact</h3>
        <p>Have an opportunity, idea, or just want to say hi?</p>

        <button class="copy" @click="copyEmail">
          {{ email }}
          <span class="copy-hint" v-if="copied">Copied! 🎉</span>
        </button>

        <form class="mini-form" @submit.prevent="fakeSubmit">
          <input type="text" v-model="form.name" placeholder="Your name" required />
          <input type="email" v-model="form.email" placeholder="Email" required />
          <textarea v-model="form.message" placeholder="Message" required></textarea>
          <button type="submit">Send</button>
          <small v-if="sent" class="sent-msg">Thanks! I’ll get back to you soon.</small>
        </form>
      </section>

      <footer class="footer">
        <span>© {{ new Date().getFullYear() }} {{ name }} — Built with Vue 3</span>
      </footer>
    </main>

    <!-- Emoji confetti layer -->
    <div class="confetti-layer">
      <span
        v-for="c in confetti"
        :key="c.id"
        class="confetti"
        :style="{ left: c.x + 'px', top: c.y + 'px', animationDuration: c.duration + 'ms', fontSize: c.size + 'px' }"
      >{{ c.emoji }}</span>
    </div>
  </div>
</template>
<!-- 
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

/* ===========
   DATA
=============*/
const name = 'Your Name'
const email = 'hello@yourname.dev'

const roles = [
  'Frontend Engineer',
  'Creative Coder',
  'UI/UX Enthusiast',
  'Performance Tinkerer',
  'Open Source Lover'
]

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'contact', label: 'Contact' }
]

const socials = [
  { label: 'GitHub', href: 'https://github.com/yourname' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname' },
  { label: 'Twitter', href: 'https://twitter.com/yourname' }
]

const topSkills = ['Vue', 'TypeScript', 'Vite', 'GSAP', 'Accessibility', 'WebGL', 'CSS Art']

const projects = [
  {
    title: 'Nebula UI',
    year: 2024,
    description: 'A design system powering fast, accessible products.',
    tags: ['Vue 3', 'Vite', 'Storybook'],
    href: 'https://example.com'
  },
  {
    title: 'Sonic Maps',
    year: 2023,
    description: 'Audio-reactive maps to explore cities by sound.',
    tags: ['WebAudio', 'Mapbox GL', 'Canvas'],
    href: 'https://example.com'
  },
  {
    title: 'Fractal Playgrounds',
    year: 2022,
    description: 'Procedural, interactive art playgrounds in the browser.',
    tags: ['WebGL', 'ShaderToy', 'GLSL'],
    href: 'https://example.com'
  }
]

const timeline = [
  {
    when: '2024 — Now',
    title: 'Senior Frontend Engineer @ Stellar',
    summary: 'Leading the frontend platform, helping teams ship UI with confidence.'
  },
  {
    when: '2021 — 2024',
    title: 'Frontend Engineer @ Nimbus',
    summary: 'Built internal tooling, design systems, and microfrontends.'
  },
  {
    when: '2019 — 2021',
    title: 'Creative Developer (Freelance)',
    summary: 'Worked with agencies on immersive web experiences and installations.'
  }
]

/* ===========
   THEME
=============*/
const theme = ref(getInitialTheme())
function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  /  ? 'dark'
    : 'light'
}
watch(theme, t => localStorage.setItem('theme', t))
const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark')

/* ===========
   TYPEWRITER
=============*/
const typewriterText = ref('')
let roleIdx = 0
let charIdx = 0
let deleting = false
let typeTimer

function tickTypewriter() {
  const current = roles[roleIdx % roles.length]
  if (!deleting) {
    typewriterText.value = current.slice(0, ++charIdx)
    if (charIdx === current.length) {
      deleting = true
      typeTimer = setTimeout(tickTypewriter, 1500)
      return
    }
  } else {
    typewriterText.value = current.slice(0, --charIdx)
    if (charIdx === 0) {
      deleting = false
      roleIdx++
    }
  }
  typeTimer = setTimeout(tickTypewriter, deleting ? 40 : 80)
}

/* ===========
   SCROLL / SPY
=============*/
const activeSection = ref('home')
const scrolled = ref(false)
let observer

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function makeSpy() {
  const opts = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 }
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, opts)

  sections.forEach(s => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
}

/* ===========
   REVEAL DIRECTIVE
=============*/
const vReveal = {
  mounted(el) {
    el.classList.add('reveal')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('is-visible')
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(el)
  }
}

/* ===========
   TILT DIRECTIVE
=============*/
const vTilt = {
  mounted(el) {
    const dampen = 20
    const handleMove = e => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2
      const rx = -(y - cy) / dampen
      const ry = (x - cx) / dampen
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`
    }
    const reset = () => {
      el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)'
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', reset)
    el.addEventListener('blur', reset)
  }
}

/* ===========
   PARALLAX BLOBS
=============*/
const mouse = ref({ x: 0, y: 0 })
function onMouseMove(e) {
  mouse.value = { x: e.clientX, y: e.clientY }
}
function blobStyle(px, py, factor) {
  const dx = (mouse.value.x / window.innerWidth - 0.5) * 30 * factor
  const dy = (mouse.value.y / window.innerHeight - 0.5) * 30 * factor
  return { transform: `translate(calc(${px}vw + ${dx}px), calc(${py}vh + ${dy}px))` }
}

/* ===========
   COPY EMAIL + CONFETTI
=============*/
const copied = ref(false)
const confetti = ref([])
function copyEmail() {
  navigator.clipboard.writeText(email)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
  burstConfetti()
}
function burstConfetti() {
  const emojis = ['🎉', '✨', '🎈', '💥', '💫', '🌟']
  const amount = 18
  const { innerWidth, innerHeight } = window
  for (let i = 0; i < amount; i++) {
    confetti.value.push({
      id: Date.now() + i,
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight / 2 + (Math.random() - 0.5) * 60,
      duration: 1200 + Math.random() * 800,
      size: 14 + Math.random() * 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    })
  }
  setTimeout(() => {
    confetti.value.splice(0, amount)
  }, 2200)
}

/* ===========
   FAKE FORM
=============*/
const form = ref({ name: '', email: '', message: '' })
const sent = ref(false)
function fakeSubmit() {
  sent.value = true
  setTimeout(() => (sent.value = false), 2500)
  form.value = { name: '', email: '', message: '' }
}

/* ===========
   KEYBOARD NAV
=============*/
function onKeydown(e) {
  if (!e.altKey) return
  const ids = sections.map(s => s.id)
  let idx = ids.indexOf(activeSection.value)
  if (e.key === 'ArrowDown') {
    idx = Math.min(idx + 1, ids.length - 1)
    scrollTo(ids[idx])
  } else if (e.key === 'ArrowUp') {
    idx = Math.max(idx - 1, 0)
    scrollTo(ids[idx])
  }
}

/* ===========
   LIFECYCLE
=============*/
onMounted(() => {
  tickTypewriter()
  makeSpy()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  clearTimeout(typeTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  observer && observer.disconnect()
})

/* expose directives for <script setup> */
defineExpose()
</script> -->

<script>
export default {
  name: 'App',
  data() {
    return {
      name: 'Chandan',
      email: 'hello@Chandan.dev',
      roles: [
        'Frontend Engineer',
        'Creative Coder',
        'UI/UX Enthusiast',
        'Performance Tinkerer',
        'Open Source Lover'
      ],
      sections: [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'work', label: 'Work' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'contact', label: 'Contact' }
      ],
      socials: [
        { label: 'GitHub', href: 'https://github.com/yourname' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname' },
        { label: 'Twitter', href: 'https://twitter.com/yourname' }
      ],
      topSkills: ['Vue', 'TypeScript', 'Vite', 'GSAP', 'Accessibility', 'WebGL', 'CSS Art'],
      projects: [
        {
          title: 'Inter at salesine',
          year: 2024,
          description: 'A design system powering fast, accessible products.',
          tags: ['Vue 3', 'Vite', 'Storybook'],
          href: 'https://example.com'
        },
        {
          title: 'Wordpress devoloper at pace***',
          year: 2023,
          description: 'Audio-reactive maps to explore cities by sound.',
          tags: ['WebAudio', 'Mapbox GL', 'Canvas'],
          href: 'https://example.com'
        },
        {
          title: 'Inter Playgrounds',
          year: 2022,
          description: 'Procedural, interactive art playgrounds in the browser.',
          tags: ['WebGL', 'ShaderToy', 'GLSL'],
          href: 'https://example.com'
        }
      ],
      timeline: [
        {
          when: '2024 — Now',
          title: 'SDE tranee @w3villa',
          summary: 'Leading the frontend platform, helping teams ship UI with confidence.'
        },
        {
          when: '2025 — 2025',
          title: 'SDE tranee @w3villa',
          summary: 'Built internal tooling, design systems, and microfrontends.'
        },
        {
          when: '2019 — 2021',
          title: 'Creative Developer (Freelance)',
          summary: 'Worked with agencies on immersive web experiences and installations.'
        }
      ],
      theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
      typewriterText: '',
      roleIdx: 0,
      charIdx: 0,
      deleting: false,
      typeTimer: null,
      activeSection: 'home',
      scrolled: false,
      observer: null,
      copied: false,
      confetti: [],
      mouse: { x: 0, y: 0 },
      form: { name: '', email: '', message: '' },
      sent: false
    };
  },
  watch: {
    theme(newVal) {
      localStorage.setItem('theme', newVal);
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },
    tickTypewriter() {
      const current = this.roles[this.roleIdx % this.roles.length];
      if (!this.deleting) {
        this.charIdx++;
        this.typewriterText = current.slice(0, this.charIdx);
        if (this.charIdx === current.length) {
          this.deleting = true;
          this.typeTimer = setTimeout(this.tickTypewriter, 1500);
          return;
        }
      } else {
        this.charIdx--;
        this.typewriterText = current.slice(0, this.charIdx);
        if (this.charIdx === 0) {
          this.deleting = false;
          this.roleIdx++;
        }
      }
      this.typeTimer = setTimeout(this.tickTypewriter, this.deleting ? 40 : 80);
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    onScroll() {
      this.scrolled = window.scrollY > 24;
    },
    makeSpy() {
      const opts = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 };
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      }, opts);

      this.sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) this.observer.observe(el);
      });
    },
    onMouseMove(e) {
      this.mouse = { x: e.clientX, y: e.clientY };
    },
    blobStyle(px, py, factor) {
      const dx = (this.mouse.x / window.innerWidth - 0.5) * 30 * factor;
      const dy = (this.mouse.y / window.innerHeight - 0.5) * 30 * factor;
      return {
        transform: `translate(calc(${px}vw + ${dx}px), calc(${py}vh + ${dy}px))`
      };
    },
    copyEmail() {
      navigator.clipboard.writeText(this.email);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
      this.burstConfetti();
    },
    burstConfetti() {
      const emojis = ['🎉', '✨', '🎈', '💥', '💫', '🌟'];
      const amount = 18;
      const { innerWidth, innerHeight } = window;
      for (let i = 0; i < amount; i++) {
        this.confetti.push({
          id: Date.now() + i,
          x: innerWidth / 2 + (Math.random() - 0.5) * 120,
          y: innerHeight / 2 + (Math.random() - 0.5) * 60,
          duration: 1200 + Math.random() * 800,
          size: 14 + Math.random() * 10,
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        });
      }
      setTimeout(() => {
        this.confetti.splice(0, amount);
      }, 2200);
    },
    fakeSubmit() {
      this.sent = true;
      setTimeout(() => (this.sent = false), 2500);
      this.form = { name: '', email: '', message: '' };
    },
    onKeydown(e) {
      if (!e.altKey) return;
      const ids = this.sections.map(s => s.id);
      let idx = ids.indexOf(this.activeSection);
      if (e.key === 'ArrowDown') {
        idx = Math.min(idx + 1, ids.length - 1);
        this.scrollTo(ids[idx]);
      } else if (e.key === 'ArrowUp') {
        idx = Math.max(idx - 1, 0);
        this.scrollTo(ids[idx]);
      }
    }
  },
  mounted() {
    this.tickTypewriter();
    this.makeSpy();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    clearTimeout(this.typeTimer);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.onKeydown);
    if (this.observer) this.observer.disconnect();
  }
};
</script>


<style scoped>
/* ===== CSS RESET-ish ===== */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body, #app, .app { height: 100%; scroll-behavior: smooth; }
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, sans-serif; }

/* ===== THEME ===== */
.app {
  --bg: #0e0e11;
  --fg: #e8e8f0;
  --muted: #a0a0b8;
  --accent: #6c5ce7;
  --accent-2: #00d4ff;
  --card: rgba(255,255,255,0.04);
  --border: rgba(255,255,255,0.08);
  --shadow: rgba(0,0,0,0.2);
  background: var(--bg);
  color: var(--fg);
  overflow-x: hidden;
  position: relative;
}
.app.light {
  --bg: #fafafa;
  --fg: #111;
  --muted: #555;
  --accent: #6c5ce7;
  --accent-2: #0ea5e9;
  --card: #fff;
  --border: rgba(0,0,0,0.08);
  --shadow: rgba(0,0,0,0.08);
  background: var(--bg);
  color: var(--fg);
}
.gradient-text {
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== BLOBS ===== */
.blob {
  position: fixed;
  width: 40vw;
  height: 40vw;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  z-index: -1;
  background: radial-gradient(circle at 30% 30%, var(--accent), transparent 70%);
  transition: transform 0.12s linear;
}
.blob-2 {
  background: radial-gradient(circle at 60% 60%, var(--accent-2), transparent 70%);
  width: 30vw;
  height: 30vw;
}

/* ===== NAV ===== */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  backdrop-filter: blur(12px);
  background: transparent;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.nav.scrolled {
  background: rgba(0,0,0,0.25);
  box-shadow: 0 2px 10px var(--shadow);
}
.app.light .nav.scrolled {
  background: rgba(255,255,255,0.6);
}
.brand {
  font-weight: 600;
  letter-spacing: .2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: .5rem;
}
.brand .dot {
  width: .6rem; height: .6rem; border-radius: 50%; background: var(--accent);
}
.nav nav {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}
.nav a {
  position: relative;
  padding: .25rem .5rem;
  border-radius: .375rem;
  text-decoration: none;
  color: var(--muted);
  transition: color .15s ease;
}
.nav a:hover { color: var(--fg); }
.nav a.active {
  color: var(--fg);
}
.nav a.active::after {
  content: '';
  position: absolute;
  height: 2px;
  left: 0; right: 0; bottom: -2px;
  background: var(--accent);
}
.theme-toggle {
  margin-left: 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: .25rem .5rem;
  cursor: pointer;
}

/* ===== SECTIONS ===== */
.section {
  max-width: 920px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
}
.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero {
  min-height: 80vh;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  gap: 1.25rem;
}
.hero h1 {
  font-size: clamp(2.4rem, 7vw, 4.5rem);
  line-height: 1.1;
}
.hero h2 {
  font-size: clamp(1.2rem, 3.3vw, 1.8rem);
  color: var(--muted);
}
.caret {
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
.tagline {
  max-width: 40ch;
  color: var(--muted);
}
.cta { display: flex; gap: .75rem; margin-top: .5rem; }
.cta button {
  border: none;
  padding: .75rem 1.1rem;
  border-radius: .5rem;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 8px 20px -12px var(--shadow);
  background: var(--accent);
  color: white;
}
.cta button.ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--fg);
}
.socials {
  display: flex; gap: 1rem; margin-top: 1.5rem;
}
.socials a {
  color: var(--muted);
  text-decoration: none;
}
.socials a:hover { color: var(--fg); }

.about p {
  color: var(--muted);
  max-width: 60ch;
  margin-bottom: 1.25rem;
}
.chips {
  list-style: none; display: flex; flex-wrap: wrap; gap: .5rem; padding: 0;
}
.chips li {
  background: var(--card);
  border: 1px solid var(--border);
  padding: .4rem .7rem; border-radius: 999px; font-size: .85rem;
}

.work .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 1.2rem;
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: .75rem;
  padding: 1.1rem 1rem 1rem;
  box-shadow: 0 1px 2px var(--shadow);
  transition: transform .15s ease, box-shadow .15s ease;
  cursor: pointer;
  outline: none;
}
.card:hover, .card:focus {
  box-shadow: 0 10px 30px -20px var(--shadow);
}
.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: .5rem;
}
.badge {
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  color: #fff;
  padding: .15rem .5rem;
  font-size: .75rem;
  border-radius: .35rem;
}
.desc {
  color: var(--muted);
  margin-bottom: .6rem;
}
.tags {
  list-style: none; display: flex; gap: .35rem; flex-wrap: wrap; padding: 0;
}
.tags li {
  font-size: .75rem;
  color: var(--muted);
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--border);
  border-radius: .35rem;
  padding: .2rem .4rem;
}
.app.light .tags li {
  background: rgba(0,0,0,0.03);
}

.timeline .tl {
  list-style: none; margin: 0; padding: 0; position: relative;
}
.timeline .tl::before {
  content: '';
  position: absolute; left: .5rem; top: .35rem; bottom: .35rem;
  width: 2px; background: var(--border);
}
.timeline .tl li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1.5rem;
}
.timeline .dot {
  position: absolute; left: -.1rem; top: .35rem;
  width: .8rem; height: .8rem; border-radius: 50%; background: var(--accent);
}
.timeline .when {
  font-size: .85rem; color: var(--muted);
}

.contact p { color: var(--muted); margin-bottom: 1rem; }
.copy {
  display: inline-flex; align-items: center; gap: .5rem;
  border: 1px dashed var(--border);
  background: transparent; color: var(--fg);
  border-radius: .5rem; padding: .6rem .9rem; cursor: pointer;
  margin-bottom: 1.2rem;
}
.copy-hint { margin-left: .5rem; }
.mini-form {
  display: grid; gap: .6rem; max-width: 520px;
}
.mini-form input, .mini-form textarea {
  width: 100%;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: .4rem;
  padding: .6rem .7rem;
  color: var(--fg);
  font: inherit;
}
.mini-form textarea { min-height: 140px; resize: vertical; }
.mini-form button[type="submit"] {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: .4rem;
  padding: .6rem .9rem;
  cursor: pointer;
  font-weight: 600;
}
.sent-msg {
  color: var(--accent);
  margin-top: .25rem;
}

.footer {
  text-align: center;
  color: var(--muted);
  padding: 4rem 1rem 2rem;
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Confetti */
.confetti-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
.confetti {
  position: absolute;
  animation: fly 1.8s ease-out forwards;
}
@keyframes fly {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + (var(--dx, 0px))), calc(-50% + 120px)) rotate(600deg) scale(0.8); opacity: 0; }
}

/* Responsiveness tweaks */
@media (max-width: 640px) {
  .nav { padding: .9rem 1rem; }
  .nav nav { display: none; }
  .section { padding: 6rem 1rem 3rem; }
}
</style>
