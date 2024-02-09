<template>
	<div class="publication-container">
		<div class="publication" :key="post.id">
			 <div class="post-info">
			 	<div class="post-head">
					<span class="post-source" :style="{
						color: `${colors[post.source]}`
					}"><i :class="`uil uil-${post.source}`"></i> {{ post.source }}</span>
					<span class="post-date">{{ moment(post.published_at).format("DD MMM, YYYY") }}</span>
				</div>
				<div class="post-title">
					{{ post.title }}
				</div>
				<div class="post-footer">
					<ul>
						<li><i class="uil uil-thumbs-up"></i> {{ post.likes }}</li>
						<li class="post-btn-comment" @click="showComment = !showComment"><i class="uil uil-comment-alt"></i> {{ post.comments }}</li>
						<li><i class="uil uil-share"></i> {{ post.share }}</li>
					</ul>
				</div>
			 </div>
			<transition
			    name="fade"
			    enter-active-class="animate__animated animate__fadeInDown"
			    leave-active-class="animate__animated animate__fadeOutUp">
			     <div class="comments" v-if="showComment">
			        <div v-for="(comment, index) in post.commentsData" :key="index" class="comment">
			            <p>{{ comment }}</p>
			        </div>
			    </div>
			</transition>
	    </div>
	</div>
</template>
<script setup>
import { inject, ref } from 'vue';
import moment from 'moment';

const posts = inject('posts');
const colors = {
        'facebook': '#1877F2',
        'instagram': '#E4405F',
        'linkedin': '#0A66C2',
        'tiktok': '#000000',
        'twitter': '#1DA1F2',
        'youtube': '#FF0000'
};
const showComment = ref(false);
const props = defineProps(['post']);
</script>
<style scoped>

.publication {
   margin-bottom: 20px;
   padding: 10px;
   transition: var(--transition);
   box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
   border-radius: 5px;
}

.comments {
    margin-top: 10px;
}

.comment {
    background-color: #f9f9f9;
    padding: 5px;
    margin-bottom: 5px;
    border-left: 3px solid #ccc;
}

.publication-container {
  max-width:  100%;
  margin:  0 auto;
 /* padding:  20px;*/
}

.publication {
  display: flex;
  flex-direction: column;
  margin-bottom:  20px;
}

.post-title{
	 background-color: #f7fbff;
	 padding: 15px;
	 margin-top: 10px;
	 font-size: 14px;
	 border-radius: 5px;
}

.post-head{
	display: flex;
	justify-content: space-between;
}

.post-footer{
	display: flex;
	justify-content: flex-end;
	font-size: 13px;
}

.post-footer ul{
	display: flex;
	gap: 0.5rem;
}

.post-date{
	font-size: 14px;
	font-weight: 600;
	color: var(--color-primary)
}

.post-btn-comment{
	cursor: pointer;
}

.post-info{
	z-index: 1
}

.animate__animated.animate__fadeInDown, .animate__animated.animate__fadeInOut {
  --animate-duration: 0.5s;
}


@media (max-width:  768px) {
  .publication {
    /* Adjust styles for smaller screens here */
  }
}

.comments {
  /* Styles for the comments section */
}
	
</style>