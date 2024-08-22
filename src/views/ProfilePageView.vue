<template>
  <div class="main__container">
    <div class="breadcrumb__container">
      <BreadcrumbComponent :data="breadcrumbData" />
    </div>
    <div class="admin__container" >
      <button class="menu-toggle" @click="toggleMenu">
        <i class="uil uil-bars"></i>
        <span v-if="selectedMenu" class="text-sm font-medium text-gray-700 dark:text-gray-400"> {{ selectedMenu }}</span>
      </button>
      <div class="admin__menu" :class="{ 'menu-open': isMenuOpen }">
        
          <li>
            <router-link :to="{ name: 'Personal_details' }"  @click.native="selectMenu('Account')">
              <i class="uil uil-user"></i><span>Account</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Subscription' }" active-class="active"  @click.native="selectMenu('Subscription')">
              <i class="uil uil-book"></i> <span>Subscription</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'QRCodes' }" active-class="active"  @click.native="selectMenu('My QRCodes')">
              <i class="uil uil-qrcode-scan"></i> <span>My QRCodes</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Screen' }" active-class="active"  @click.native="selectMenu('My Screen')">
              <i class="uil uil-presentation"></i> <span>My Screen</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Advantage' }"  @click.native="selectMenu('Advantages')">
              <i class="uil uil-bill"></i> <span>Advantages</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Partnership' }"  @click.native="selectMenu('Partnership')">
              <i class="uil uil-users-alt"></i> <span>Partnership</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Contact' }"  @click.native="selectMenu('Contacts')">
              <i class="uil uil-envelope"></i> <span>Contacts</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Discount_coupons' }"  @click.native="selectMenu('Discount coupons')">
              <i class="uil uil-bill"></i> <span>Discount coupons</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Parameters', params:{tag: route.params.tag, tab: 'establishments', sub_tab:'establishments_list' } }" active-class="active"  @click.native="selectMenu('Parameters')" :class="{ active: isActive('Parameters') }">
              <i class="uil uil-setting"></i> <span>Parameters</span>
            </router-link>
          </li>
   
      </div>
      <div class="all__content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, watch } from 'vue';
import { RouterView, useRoute, useRouter} from 'vue-router';
import BreadcrumbComponent from '@Components/utils/BreadcrumbComponent.vue';

const isMenuOpen = ref(true);
const selectedMenu = ref('');

const route = useRoute();
const router = useRouter();

const menuMap = {
  "Personal_details": "Account",
  "Subscription": "Subscription",
  "QRCodes": "My QRCodes",
  "Advantage": "Advantages",
  "Partnership": "Partnership",
  "Contact": "Contacts",
  "Discount_coupons": "Discount coupons",
  "Parameters": "Parameters",
  "Screen": "My Screen"
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = true;
};

const selectMenu = (menuName) => {
  selectedMenu.value = menuName;
  closeMenu();
};

const isActive = (menuName) => {
  if (menuName === 'Parameters') {
    return ['establishments','urls', 'competitors', 'staffs', 'services', 'events', 'categories'].includes(route.params.tab);
  }
  return route.name === menuName;
};

const page = computed(() => {
  let data = {
    "Personal_details": {
      title1: "",
      title2: "Personal details",
      icon: "uil-user",
    },
    "Subscription": {
      title1: "",
      title2: "Subscriptions",
      icon: "uil-book",
    },
    "Subscription_list": {
      title1: "",
      title2: "Subscriptions",
      icon: "uil-book",
    },
    "new_subscription": {
      title1: "",
      title2: "Subscriptions",
      icon: "uil-book",
    },
    "Contact": {
      title1: "",
      title2: "Contact",
      icon: "uil-envelope",
    },
    "Discount_coupons": {
      title1: "",
      title2: "Discount",
      icon: "uil-bill",
    },
    "Parameters": {
      title1: "",
      title2: "Parameters",
      icon: "uil-setting",
    },
    "Advantage": {
      title1: "",
      title2: "Advantage",
      icon: "uil-bill",
    },
    "Partnership": {
      title1: "",
      title2: "Partnership",
      icon: "uil-users-alt",
    },
    "QRCodes": {
      title1: "",
      title2: "My QRCode",
      icon: "uil-qrcode-scan",
    },
    "Screen": {
      title1: "",
      title2: "My Screen",
      icon: "uil-screen",
    }
  }

  return data[route.name]
})

const breadcrumbData = [
  {
    title: "Profile",
    path: `${route.path}`,
    isCurrent: true,
  },
];

watch(route, (newRoute) => {
  selectedMenu.value = menuMap[newRoute.name] || '';
});

</script>
<style scoped>
/* Styles existants */
.admin__container {
  height: inherit;
  display: flex;
  gap: 2rem;
  width: 95% !important;
  margin: auto;
  overflow-x: hidden;
  
}

.breadcrumb__container {
  width: 95%;
}

.admin__menu {
  margin-top: 50px;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.admin__menu li a:hover {
  background-color: var(--color-light);
  color: var(--color-bg1);
  cursor: pointer;
}

.admin__menu li a {
  padding: 10px 15px;
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  gap: 1rem;
  font-weight: 600;
  font-size: 14px;
  color: rgb(101, 101, 101);
}

.admin__menu span {
  width: 200px;
}

.router-link-active,
.active {
  background-color: var(--color-danger);
  color: var(--color-white) !important;
}

.admin__menu li .router-link-active:hover,
.admin__menu li .active:hover {
  background-color: var(--color-danger);
  color: var(--color-white);
}

.all__content {
  flex: auto;
  width: 65%;
  padding-right: 8px;
  margin-top: 0px;
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

  .all__content {
    margin-top: 50px;
  }
}

/* Styles pour le menu sur les petits écrans */
.menu-toggle {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.menu-open  {
  display: block;
  /* Affiche toujours la liste du menu sur les petits écrans */
}

.erep__app {
  position: absolute;
  top: -5em;
}

/* Pour les petits écrans (par exemple, les téléphones mobiles) */
@media screen and (max-width: 800px) {
  
  .admin__menu {
    position: auto;
    padding-bottom: 1%;
    margin-top: -10%;
}

  .admin__menu.menu-open {
    display: none; 
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: 2.5rem;
    margin-right: 100%;
  }

  .all__content {
    margin-top: -25px;
    width: 115%;
  }

  .admin__container {
    flex-direction: column;
    margin-bottom: 20%;
    padding-bottom: 20px;
  }

  .admin__menu li a span {
    display: block;
  }

  .admin__menu {
    margin-top: -30px;
  }

  ul {
    display: block;
    /* Affiche toujours la liste du menu sur les petits écrans */
  }

  .admin__menu li a {
    flex-direction: row;
  }
  
  .menu-toggle span {
    margin-left: 8px;
    font-size: 0.9rem;
    white-space: nowrap;
  
  }
 /* .menu-toggle i {
    font-size: 1.5rem;
  }*/

}
</style>