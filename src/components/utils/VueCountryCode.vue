<template>
  <div class="vue-country-select" :class="{ disabled: disabled }" :style="enabledPhoneNumbers?{'width':'22%'}:{'width': '100%'}">
    <div
      class="dropdown"
      @click="toggleDropdown"
      v-click-outside="clickedOutside"
      :class="{ open: open }"
      @keydown="keyboardNav"
      tabindex="0"
      @keydown.esc="reset"
    >
      <span class="current">
          <div class="current__content">
            <div
              v-if="enabledFlags"
              class="iti-flag"
              :class="activeCountry.iso2.toLowerCase()"
            ></div>
            <span v-if="enabledFlags && enabledPhoneNumbers==false">{{ getCountryName(activeCountry.name) }}</span>
          </div>
          <span v-if="enabledCountryCode || enabledPhoneNumbers" class="country-code"
          >+{{ activeCountry.dialCode }}</span>
          <span class="dropdown-arrow">{{ open ? "▲" : "▼" }}</span>
      </span>
      <ul v-show="open" ref="list" class="dropdown-list">
         <li 
          v-if="enableSearchField" 
          class="search-field" 
          @click.stop
          >
          <input 
            v-model="searchText"
            :placeholder="searchPlaceholderText"
            type="text" 
          >
        </li>
        <li
          class="dropdown-item"
          v-for="(pb, index) in sortedCountries"
          :key="pb.iso2 + (pb.preferred ? '-preferred' : '')"
          @click="choose(pb)"
          :class="getItemClass(index, pb.iso2)"
          @mousemove="selectedIndex = index"
        >
          <div
            class="iti-flag"
            v-if="enabledFlags"
            :class="pb.iso2.toLowerCase()"
          ></div>
          <span>{{ pb.name }}</span>
        </li>
      </ul>
    </div>
    <input v-if="enabledPhoneNumbers" type="tel" name="phoneNumber" class="phone__number">
  </div>
</template>

<script>
import allCountries from "@Components/utils/allCountries";
import getCountry from "@Components/utils/defaultCountry";

export default {
  name: "vue-country-code",
  props: {
    searchPlaceholderText: {
      type: String,
      default: 'Search country',
    },
    enableSearchField: {
      type: Boolean,
      default: false,
    },
    disabledFetchingCountry: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledFormatting: {
      type: Boolean,
      default: false,
    },
    defaultCountry: {
      // Default country code, ie: 'AU'
      // Will override the current country of user
      type: String,
      default: "",
    },
    enabledCountryCode: {
      type: Boolean,
      default: false,
    },
    enabledFlags: {
      type: Boolean,
      default: true,
    },
    preferredCountries: {
      type: Array,
      default: () => [],
    },
    onlyCountries: {
      type: Array,
      default: () => [],
    },
    ignoredCountries: {
      type: Array,
      default: () => [],
    },
    dropdownOptions: {
      type: Object,
      default: () => ({})
    },
    selectedCountryCode: {
      type: Boolean,
      default: false,
    },
    enabledPhoneNumbers: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    this.initializeCountry();
    this.$emit("onSelect", this.activeCountry);
  },
  data() {
    return {
      activeCountry: { iso2: "" },
      open: false,
      selectedIndex: null,
      typeToFindInput: "",
      typeToFindTimer: null,
      searchText: '',
    };
  },
  computed: {
    filteredCountries() {
      // List countries after filtered
      if(this.searchText.length){
        return allCountries.filter(country => {
          return country.name.toLowerCase().includes(this.searchText.toLowerCase())
        });
      }

      if (this.onlyCountries.length) {
        return this.getCountries(this.onlyCountries);
      }

      if (this.ignoredCountries.length) {
        return allCountries.filter(
          ({ iso2 }) =>
            !this.ignoredCountries.includes(iso2.toUpperCase()) &&
            !this.ignoredCountries.includes(iso2.toLowerCase())
        );
      }
      return allCountries;
    },
    sortedCountries() {
      // Sort the list countries: from preferred countries to all countries
      const preferredCountries = this.getCountries(
        this.preferredCountries
      ).map(country => ({ ...country, preferred: true }));

      return [...preferredCountries, ...this.filteredCountries];
    },
  },
  watch: {
    defaultCountry: function(){
      this.initializeCountry();
    }
  },
  methods: {
    initializeCountry() {
      /**
       * 1. Use default country if passed from parent
       */
      if (this.defaultCountry) {
        const defaultCountry = this.findCountry(this.defaultCountry);
        if (defaultCountry) {
          this.activeCountry = defaultCountry;
          return;
        }
      }
      /**
       * 2. Use the first country from preferred list (if available) or all countries list
       */
      this.activeCountry =
        this.findCountry(this.preferredCountries[0]) ||
        this.filteredCountries[0];
      /**
       * 3. Check if fetching country based on user's IP is allowed, set it as the default country
       */
      if (!this.disabledFetchingCountry) {
        getCountry().then(res => {
          this.choose(this.findCountry(res) || this.activeCountry);
        });
      }
    },
    /**
     * Get the list of countries from the list of iso2 code
     */
    getCountries(list = []) {
      return list
        .map(countryCode => this.findCountry(countryCode))
        .filter(Boolean);
    },
    findCountry(iso = "") {
      return allCountries.find(country => country.iso2 === iso.toUpperCase());
    },
    getItemClass(index, iso2) {
      const highlighted = this.selectedIndex === index;
      const lastPreferred = index === this.preferredCountries.length - 1;
      const preferred = !!~this.preferredCountries
        .map(c => c.toUpperCase())
        .indexOf(iso2);
      return {
        highlighted,
        "last-preferred": lastPreferred,
        preferred
      };
    },
    choose(country) {
      this.activeCountry = country;
      this.$emit("onSelect", this.activeCountry);
    },
    toggleDropdown() {
      if (this.disabled) {
        return;
      }
      this.open = !this.open;
    },
    clickedOutside() {
      this.open = false;
    },
    keyboardNav(e) {
      if (e.keyCode === 40) {
        // down arrow
        this.open = true;
        if (this.selectedIndex === null) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex = Math.min(
            this.sortedCountries.length - 1,
            this.selectedIndex + 1
          );
        }
        let selEle = this.$refs.list.children[this.selectedIndex];
        if (
          selEle.offsetTop + selEle.clientHeight >
          this.$refs.list.scrollTop + this.$refs.list.clientHeight
        )
          this.$refs.list.scrollTop =
            selEle.offsetTop -
            this.$refs.list.clientHeight +
            selEle.clientHeight;
      } else if (e.keyCode === 38) {
        // up arrow
        this.open = true;
        if (this.selectedIndex === null) {
          this.selectedIndex = this.sortedCountries.length - 1;
        } else {
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        }
        let selEle = this.$refs.list.children[this.selectedIndex];
        if (selEle.offsetTop < this.$refs.list.scrollTop)
          this.$refs.list.scrollTop = selEle.offsetTop;
      } else if (e.keyCode === 13) {
        // enter key
        if (this.selectedIndex !== null) {
          this.choose(this.sortedCountries[this.selectedIndex]);
        }
        this.open = !this.open;
      } else {
        // typing a country's name
        this.typeToFindInput += e.key;
        clearTimeout(this.typeToFindTimer);
        this.typeToFindTimer = setTimeout(() => {
          this.typeToFindInput = "";
        }, 700);
        // don't include preferred countries so we jump to the right place in the alphabet
        let typedCountryI = this.sortedCountries
          .slice(this.preferredCountries.length)
          .findIndex(c =>
            c.name.toLowerCase().startsWith(this.typeToFindInput)
          );
        if (~typedCountryI) {
          this.selectedIndex = this.preferredCountries.length + typedCountryI;
          let selEle = this.$refs.list.children[this.selectedIndex];
          if (
            selEle.offsetTop < this.$refs.list.scrollTop ||
            selEle.offsetTop + selEle.clientHeight >
              this.$refs.list.scrollTop + this.$refs.list.clientHeight
          ) {
            this.$refs.list.scrollTop =
              selEle.offsetTop - this.$refs.list.clientHeight / 2;
          }
        }
      }
    },
    reset() {
      this.selectedIndex = this.sortedCountries
        .map(c => c.iso2)
        .indexOf(this.activeCountry.iso2);
      this.open = false;
    },
    getCountryName(country) {
      const countryName = String(country);
      const regex = /\([^)]*\)/g;
      const countryWithoutParentheses = countryName.replace(regex, "");
      return countryWithoutParentheses
    } 
  },
  directives: {
    // Click-outside from BosNaufal: https://github.com/BosNaufal/vue-click-outside
    "click-outside": {
      bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== "function") {
          var compName = vNode.context.name;
          var warn =
            "[Vue-click-outside:] provided expression " +
            binding.expression +
            " is not a function, but has to be";
          if (compName) {
            warn += "Found in component " + compName;
          }
          console.warn(warn);
        }
        // Define Handler and cache it on the element
        var bubble = binding.modifiers.bubble;
        var handler = function(e) {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        // add Event Listeners
        document.addEventListener("click", handler);
      },
      unbind: function(el) {
        // Remove Event Listeners
        document.removeEventListener("click", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  }
};
</script>

<style scoped>
@import '@Assets/css/sprite.css';
@import '@Assets/css/base.css';

.vue-country-select {
    height: 40px;
    border: 1px solid var(--light-color-bg2);
    border-radius: 5px;
    padding: 7px 10px;
    position: relative;
}

.phone__number{
  position: absolute;
  left: 7rem;
  top: 0rem; 
  width: 200px !important;
  margin: 0;
  padding: 0;
  font-size: 15px;
}

.vue-country-select .current {
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.vue-country-select .dropdown-arrow {
  cursor: pointer;
}

.vue-country-select .dropdown-list {
  z-index: 1;
  padding: 0;
  margin: 0;
  text-align: left;
  list-style: none;
  max-height: 200px;
  overflow-y: scroll;
  position: relative;
  top: 100%;
  left: -1px;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 300px;
}

.vue-country-select .dropdown-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 4px 15px;
  transition: var(--transition);
}

.vue-country-select .dropdown-item:hover {
  background-color: var(--light-color-bg1);
}

.current__content{
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
