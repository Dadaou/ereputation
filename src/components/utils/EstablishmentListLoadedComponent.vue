<template>
	<div class="society__list">
        <div class="list__item" v-for="index in nb">
            <div class="society__info__container  animate-pulse">
                <div 
                	role="status" 
                	class="society__logo flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                >
                    <svg 
                    	class="w-10 h-10 text-gray-200 dark:text-gray-600" 
                    	aria-hidden="true" 
                    	xmlns="http://www.w3.org/2000/svg" 
                    	fill="currentColor" 
                    	viewBox="0 0 16 20"
                    >
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
             	<div class="list__main__content">
                    <div class="list__main__info">
                        <div class="society__item">
                            <div class="society__item">
                                <div class="society__main__info">
                                    <div class="item__head">
                                        <div class="society__info">
                                          	<label class="society__name">
                                            	<div class="h-2 bg-gray-300 rounded-full dark:bg-gray-600 w-64 mb-2.5"></div>
                                            </label>
                                            <div class="society__category">
                                                <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                            </div>
                                            <div class="society__location">
                                                <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                                <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="h-7 bg-gray-300 dark:bg-gray-700 w-7"></div>
                    </div>
                    <div class="list__actions">
                        <div class="h-7 bg-gray-300 dark:bg-gray-700 w-20"></div>
                    </div>
                </div>
            </div>
        </div>
   	</div>
</template>
<script setup>

const props = defineProps({
	nb:{
		type: Number,
		required: true
	}
});
	
</script>
<style scoped>
.list__item{
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
    border: 2px solid var(--light-color-bg1);
    transition: var(--transition);
}

.society__info__container{
    display: flex;
    gap: 1rem;
    font-size: 15px;
    color: var(--color-bg2);
    justify-content: space-between;
    flex-direction: row;
    transition: var(--transition);
}

.society__logo{
   width: 200px;
   height: 95px;
   z-index: 0;
   transform: var(--transition);
}

.society__logo img{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.society__logo svg{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.list__main__content{
    width: 600px;
    transition: var(--transition);
}

.list__main__info{
    display: flex;
    justify-content: space-between;
}

.society__item {
    display: flex;
    gap: 2rem;
}

.society__main__info{
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.society__item div{
    font-size: 13px;
    font-weight: 500;
}

.society__item i{
    color: var(--color-danger);
    margin-right: 5px;
}

.item__head{
    display: flex;
    justify-content: space-between;
}

.society__item label{
    font-size: 14px;
    font-weight: bold;
    color: var(--color-primary)
}

.rating__content{
    align-self: center;
}

.list__actions{
    display: flex;
    justify-content: flex-end;
}

.list__actions button{
    border: 1px solid var(--light-color-bg1);
    transition: var(--transition);
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    padding: 2px 6px;
    transition: var(--transition);
}

.list__actions button:hover{
    background-color: var(--color-primary);
}

@media screen and (max-width:779px) {
    .society__item label{
        font-size: 13px;
    }

    .society__item div{
        font-size: 12px;
    }
}

@media screen and (max-width:600px) {
    .society__info__container{
        flex-direction: column;
    }

    .list__main__content{
        width: inherit;
    }

    .society__logo{
        width: 100%;
        height: 150px;
    }

    .list__actions button{
        flex-grow: 1;
        margin: 10px 0px 0px 0px;
        padding: 5px 0px;
        background-color: var(--color-primary);
        color: white;
    }

    .society__location{
        display: flex;
    }
    .society__location span{
        display: block;
        flex-basis: 225px;
        line-height: 1.2;
    }

    .society__item label{
        font-size: 14px;
    }
}
</style>