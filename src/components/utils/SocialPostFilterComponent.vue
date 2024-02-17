<template>
	<ul class="social-filter">
       <li v-for="social in socials" :key="social" :class="[current==social?'current':'']"  @click="$emit('update', social)">
       	<i :class="`uil uil-${social}`"></i>
       </li>
   </ul>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
	current: {
		type: String,
		required: false,
		default: 'facebook'
	}
});
const emits = defineEmits(['update'])
const socials = ref(['facebook', 'instagram', 'twitter', 'youtube', 'linkedin']);

	
</script>
<style scoped>

.social-filter li:hover {
  transform: scale(1.1);
}

.social-filter li i {
  font-size:  1.2rem;
}

.current {
  border-radius:  0.25rem;
  box-shadow:  1px  2px  4px rgba(0,  0,  0,  0.1);
  transition: all  0.2s ease-in-out;
}

.current:hover {
  transform: scale(1.05);
}

ul {
    list-style: none;
    padding: 0;
}

.social-filter{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
}

.social-filter li{
    border-bottom: none;
    padding: 5px 25px;
    margin: 2px;
    font-size: 16px;
    cursor: pointer;
}

.uil-youtube {
    color: red;
}

.uil-linkedin {
    color: #0A66C2;
}

.uil-facebook {
    color: #1877F2;
}

.uil-twitter {
    color: #1DA1F2;
}

.uil-instagram {
    color: #BC2A8D;
}

.uil-comment {
    color: var(--color-danger);
}

.uil-thumbs-up {
    color: #1DA1F2;
}

.uil-share {
    color: #1DA1F2;
}
	
</style>