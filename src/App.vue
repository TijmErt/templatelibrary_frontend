<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NotificationGroupBox from '../src/components/NotificationGroupBox.vue'
import ToggleUsers from '../src/components/ToggleUsers.vue'
import TempShowBookmarkList from '../src/components/TempShowBookmarkList.vue'
import TempShowMyPostsList from '../src/components/TempShowMyPostsList.vue'
</script>

<template>
  <header class="header textShadow">
    <h1>TemplateLibrary</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/Post/Creation">Post Creation</RouterLink>
      </nav>
    </div>

  </header>
  <NotificationGroupBox/>

  <RouterView />

  <footer>
    <div style="display: flex;
  justify-content: space-between; /* Optional: to add space between the components */
  align-items: center;">
      <ToggleUsers/>
      <TempShowBookmarkList/>
      <TempShowMyPostsList/>
    </div>
    created by 486333
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
  background-color: var(--color-background-box);
  border-radius: 0 0 5px 5px;
}
footer{
  margin-top: 4em;
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
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: block;
    place-items: center;
    padding: 0 1rem;
    box-shadow: 0px 10px 5px rgba(0, 0, 0, 0.1);
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
