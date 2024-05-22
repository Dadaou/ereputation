<template>
	<div class="md:items-center md:order-2">
		<div id="lang-btn" type="button"
			class="font-medium text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer dark:hover:text-white"
			@click="show = !show">
			<span v-html="selectedLanguage.svg"></span>
		</div>
		<transition name="fade" enter-active-class="animate__animated animate__fadeInRight"
			leave-active-class="animate__animated animate__fadeOutRight">
			<div class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700"
				id="language-dropdown" v-if="show">
				<ul class="py-2 font-medium" role="none">
					<li v-for="language in languages" :key="language" @click="chooseLanguage(language)">
						<a href="#"
							:class="[(selectedLanguage.code == language.code) ? 'bg-gray-100' : '', 'block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white']"
							role="menuitem">
							<div class="inline-flex items-center language__item">
								<span v-html="language.svg"></span> {{ language.name }}
							</div>
						</a>
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { languages } from '@Services/languages.js';

const props = defineProps({
	current: {
		type: Object,
		required: true
	},
	// isScrolling: {
	// 	type: Boolean,
	// 	required: true
	// }
});

const emits = defineEmits(['select'])

const show = ref(false);

const selectedLanguage = computed(() => props.current)

const chooseLanguage = (language) => {
	show.value = false;
	emits('select', language)
};

</script>
<style scoped>
#lang-btn {
	position: relative;
	left: -9px;
}

#language-dropdown {
	position: absolute;
	top: 3.5rem;
	right: 3rem;
	background: var(--color-white);
	z-index: 12;
	border-radius: 1rem;
	box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

#language-dropdown div {
	color: black !important;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>