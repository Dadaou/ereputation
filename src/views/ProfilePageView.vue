<template>
    <div class="main__container">
        <HeadComponent :page="page"></HeadComponent>
        <div class="breadcrumb__container">
            <BreadcrumbComponent :data="breadcrumbData" />
        </div>
        <div class="admin__container">
            <div class="admin__menu">
                <ul>
                    <li>
                        <router-link :to="{ name: 'Personal_details' }">
                            <i class="uil uil-building"></i><span>Personal details</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'Contact' }">
                            <i class="uil uil-envelope"></i> <span>Contacts</span>
                        </router-link>
                    </li>
                   <!--  <li>
                        <router-link :to="{ name: 'Account_security' }">
                            <i class="uil uil-lock"></i> <span>Security</span>
                        </router-link>
                    </li> -->
                    <li>
                        <router-link :to="{ name: 'Parameters' }">
                            <i class="uil uil-setting"></i> <span>Parameters</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="all__content">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import HeadComponent from '@Components/layouts/HeadComponent.vue';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';
import { useRoute } from "vue-router";


const page = ref({
    title1: "My",
    title2: "Profile",
    icon: "uil-user-square",
});
const route = useRoute();
const breadcrumbData = [
    {
        title: "Profile",
        path: `${route.path}`,
        isCurrent: true,
    },
];

</script>
<style scoped>
/* Styles existants */

.admin__container {
  height: inherit;
  display: flex;
  gap: 2rem;
  width: 95% !important;
  margin: auto;
}

.breadcrumb__container {
  width: 95%;
}

.admin__menu ul {
  margin-top: 50px;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.admin__menu li a:hover {
  background-color: var(--color-light);
  color: var(--color-bg1);
  cursor: pointer;
}

.admin__menu li a {
  padding: 10px 75px;
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  gap: 1rem;
  font-weight: 600;
  font-size: 14px;
  color: rgb(101, 101, 101);
}

.router-link-exact-active {
  background-color: var(--color-danger);
  color: var(--color-white) !important;
}

.admin__menu li .router-link-exact-active:hover {
  background-color: var(--color-danger);
  color: var(--color-white);
}

.all__content {
  flex: auto;
  width: calc(100% - 65px);
  padding-right: 8px;
}

/* Pour les tablettes */
@media screen and (max-width: 1225px) {
  .admin__menu li a {
    padding: 10px 50px;
  }
}

@media screen and (max-width: 1124px) {
  .breadcrumb__container {
    width: 95%;
  }

  .admin__menu li a span {
    display: none;
  }

  .admin__menu li a {
    font-size: 15px;
    padding: 10px 25px;
  }
}

/* Styles pour le menu sur les petits écrans */
.menu-toggle {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.menu-open .admin__menu ul {
  display: block; /* Affiche toujours la liste du menu sur les petits écrans */
}

/* Pour les petits écrans (par exemple, les téléphones mobiles) */
@media screen and (max-width: 800px) {
  .admin__container {
    flex-direction: column;
  }

  .admin__menu li a span {
    display: block;
  }

  ul {
    display: block; /* Affiche toujours la liste du menu sur les petits écrans */
  }

  .admin__menu li a {
    flex-direction: row;
  }
}
</style>