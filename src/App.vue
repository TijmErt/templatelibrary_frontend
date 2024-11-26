<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>TemplateLibrary</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <footer>
    created by 486333 (Tijm van Dongen)
  </footer>
</template>

<style scoped>
h1{
  font-size: 25px;
}
header {
  line-height: 1.5;
  max-height: 100vh;
  margin-bottom: 2em;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 25px;
  text-align: center;
  margin-bottom: 1rem;
  top: 0;
  position: sticky;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: block;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    /* flex-wrap: wrap; */
  }
  h1{
    font-size: 45px;
  }
  header nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    font-size: 35px;
    padding: 1rem 0;
    margin-top: 1rem;
    top: 0;
    position: sticky;
  }
}

</style>
