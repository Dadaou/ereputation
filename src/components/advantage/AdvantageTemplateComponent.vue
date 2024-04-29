<template>
	<div class="offers-list">
    <span>Use a pre-formatted template</span>
    <div
      v-for="(offer, index) in offers"
      :key="index"
      class="offer-item"
      @click="selectOffer(offer)"
    >
      <div class="offer-title">{{ offer.Title }}</div>
    </div>
  </div>
</template>
<script setup>

function generateOffer(title, category, name, discountPercentage, validityDays = null, giftExpiredAt = null, lotteryFrom = null, lotteryTo = null, lotteryLimit = null, lotteryDescription = null) {
 const currentDate = new Date();
 const oneMonthLater = new Date();
 oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

 // Function to map synonyms to categories
 function mapSynonymToCategory(synonym) {
    const synonymMap = {
      "discount": "discount",
      "off": "discount",
      "sale": "discount",
      "markdown": "discount",
      "free": "free",
      "complimentary": "free",
      "gift": "gift",
      "present": "gift",
      "prize": "gift",
      "lottery": "lottery",
      "raffle": "lottery",
      "win": "lottery",
      "contest": "lottery"
    };
    return synonymMap[synonym.toLowerCase()] || "unknown";
 }

 // Function to extract category and name from title using synonyms
 function extractCategoryAndName(title) {
    const words = title.toLowerCase().split(" ");
    let categoryFromTitle = "unknown";
    let nameFromTitle = title.trim();
    words.forEach(word => {
      const mappedCategory = mapSynonymToCategory(word);
      if (mappedCategory !== "unknown") {
        categoryFromTitle = mappedCategory;
        if (word.toLowerCase() !== "win") { // Exclude "win" from name if it's not mapped to "lottery"
          nameFromTitle = nameFromTitle.replace(new RegExp(word, 'gi'), "").trim();
        }
      }
    });
    return { "Category": categoryFromTitle, "Name": nameFromTitle };
 }

 const { Category: categoryFromTitle, Name: nameFromTitle } = extractCategoryAndName(title);

 // Simplify the construction of offerData by using a more direct approach
 const offerData = {
    "Title": title,
    "Name": name || nameFromTitle,
    "Category": category || categoryFromTitle,
    "Amount": discountPercentage || 0,
    "Metric": discountPercentage ? "percent" : (validityDays ? "amount" : null),
    "Scope": discountPercentage ? "bill" : (validityDays ? "individual" : null),
    "Expired_at": discountPercentage ? oneMonthLater.toISOString().slice(0, 10) : (giftExpiredAt || (lotteryTo ? lotteryTo : null)),
    "Validity": validityDays || null,
    "From": lotteryFrom || null,
    "To": lotteryTo || null,
    "Limit": lotteryLimit || null,
    "description": lotteryDescription || null
 };

 return offerData;
}

const offers = [
  generateOffer("Discount 20% off on bill next month",null, "20% off on bill", 20, null, null, null, null, null, null),
  generateOffer("Discount 5$ off on ticket within the next 7 days", null, "5$ off on ticket",7, 7, null, null, null, null, null),
  generateOffer("Free coffee", null, "Free coffee"),
  generateOffer("Free t-shirt with every order placed before 31/12/2024", "gift","Free t-shirt", null, null, "2024-12-31", null, null, null, null),
  generateOffer("Win 3 free weekends in Paris in November 2024", "lottery", "Win 3 free weekends in Paris", null, null, null, "2024-11-01", "2024-11-30", 3, "Random draw on 2024-10-01 up to 3")
];

console.log(JSON.stringify(offers, null, 2));

const emits = defineEmits(['select']);	

const selectOffer = (offer) => {
    emits('select', offer)
};
</script>
<style scoped>
.offers-list {
  max-height: 500px;
  overflow-y: auto;
  margin-top: 10px; 
}

.offers-list span{
  margin: auto;
}

.offer-item {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.offer-item:hover {
  background-color: #f5f5f5;
}

.offer-title {
  font-weight: bold;
  font-size: 14px;
}
</style>