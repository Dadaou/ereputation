<template>
	<div class="publication-container">
		<div class="publication" :key="post.id">
			 <div class="post-info">
			 	<div class="post-head">
					<span class="post-source" :style="{
						color: `${colors[post.source]}`
					}">
          <i :class="`uil uil-${post.source}`" v-if="post.source !=='twitter' && post.source !=='tiktok'"></i>
        <Icon :icon="'devicon:twitter'" width="15" v-if="post.source == 'twitter'"></Icon>
        <Icon :icon="'logos:tiktok-icon'" width="15" v-if="post.source == 'tiktok'"></Icon>
          {{ post.author }}</span>
					<span class="post-date">{{ moment(post.published_at).format("DD MMM, YYYY") }}</span>
				</div>
				<div class="post-title">
					{{ post.title }}
				</div>
				<div class="post-footer">
					<ul>
						<li><i class="uil uil-thumbs-up"></i> {{ post.likes }}</li>
						<li class="post-btn-comment" @click="showComments(post.id)"><i class="uil uil-comment-alt"></i> {{ post.comments }}</li>
						<li><i class="uil uil-share"></i> {{ post.share }}</li>
					</ul>
				</div>
			 </div>
			<transition
			    name="fade">
			     <div class="comments" v-if="showComment">
			     		<socialComment v-for="(item, index) in comments" :key="index" :comment="item" v-if="!commentsLoaded"/>
			     		<div class="no-comment" v-if="comments.length == 0 && !commentsLoaded">No comment available!</div>
			     		
			            <div v-for="index in 2" :key="index" class="comment bg-gray-200 animate-pulse" v-if="commentsLoaded">
						    <!-- <span class="comment-date post-date">Loading...</span> -->
						    <div class="comment-text">
						        <p class="h-4 bg-gray-300 rounded w-3/4"></p>
						        <div>
						            <span class="emoji mx-1 h-4 bg-gray-300 rounded w-4"></span>
						            <p class="bg-gray-300 text-yellow-800 font-semibold text-sm inline-flex items-center px-3 py-1 rounded dark:bg-gray-200 dark:text-gray-800 h-4 bg-gray-300 rounded w-1/4"></p>
						        </div>
						    </div>
						    <div class="comment-meta">
						        <span class="comment-likes h-4 bg-gray-300 rounded w-1/4"></span>
						    </div>
						</div>
			    </div>
			</transition>
	    </div>
	</div>
</template>
<script setup>
import { inject, ref, defineAsyncComponent } from 'vue';
import moment from 'moment';
import services from '@Services/services.js';
import { Icon } from '@iconify/vue';

const socialComment = defineAsyncComponent(()=>import('@Components/utils/SocialPostCommentComponent.vue'))
const posts = inject('posts');
const commentsLoaded =ref(false)
const postLoaded = inject('postLoaded')
const commentsTemp = [
  {
    "comment": "This product exceeded my expectations!",
    "feeling": "positive",
    "score": 5,
    "confidence": 0.95,
    "likes": 30,
    "published_at": "2024-02-16T09:15:00Z",
    "source": "website"
  },
  {
    "comment": "I'm really impressed with the customer service.",
    "feeling": "positive",
    "score": 4,
    "confidence": 0.85,
    "likes": 20,
    "published_at": "2024-02-16T10:30:00Z",
    "source": "app"
  },
  {
    "comment": "I'm having some issues with the app crashing unexpectedly.",
    "feeling": "negative",
    "score": 2,
    "confidence": 0.6,
    "likes": 5,
    "published_at": "2024-02-15T14:20:00Z",
    "source": "social media"
  }
]

const comments = ref([])

const colors = {
        'facebook': '#1877F2',
        'instagram': '#E4405F',
        'linkedin': '#0A66C2',
        'tiktok': '#000000',
        'twitter': '#1DA1F2',
        'youtube': '#FF0000'
};
const props = defineProps(['post']);
const showComment = ref(false);

const showComments = async(id)=>{
	showComment.value = !showComment.value
	if(showComment){
		await loadComments(id);
	}
}

const loadComments = async(id)=>{
	commentsLoaded.value = true;
    let apiBase = 'establishment/socials/comments';
    let apiParams = `id=${id}`;

    const api = apiBase + '?' + apiParams;
   

    const response = await new Promise((resolve) => {
        services.get_Record(api, (response) => {
            resolve(response)
        });
    });
   
   console.log(api)
    if (response.status == 200) {
       comments.value = response.data.data
       // comments.value = commentsTemp
       commentsLoaded.value = false;
    }

};
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
  max-height: 500px; 
  overflow-y: auto; 
  transition: max-height 0.5s ease; 
}

.publication-container {
  max-width:  100% !important;
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

/* Animation fade pour les commentaires */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active dans <2.1.8 */ {
  opacity: 0;
}

.comment {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-left: 3px solid #ccc;
}

.comment-text {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 0.8rem;
  margin-top: 5px;
}

.comment-meta > span {
  margin-right: 10px;
  margin-bottom: 5px;
}

.comment-likes {
  display: flex;
  align-items: center;
}

.comment-likes i {
  margin-right: 5px;
}
</style>