import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref([])
  const startDate = moment().subtract(30, 'days').format('YYYY-M-DD')
  const endDate = moment().format('YYYY-M-DD')

  const IsValueOkay = (value) =>
    value == '' || value == 'Global' || value == 0 || value == null || value == undefined
      ? false
      : true
  const loadReviews = async (
    establishment,
    page,
    limit,
    current,
    dateStart,
    dateEnd,
    source,
    stars,
    language,
    category,
    feeling
  ) => {
    // options.value.current = current;
    // options.value.page = page;
    // reviewsLoading.value = true

    let apiBase = '/review/by_establishment'
    let apiParams = `tag=${establishment}&page=${page}&limit=${limit}`

    if (IsValueOkay(dateStart) && IsValueOkay(dateEnd)) {
      dateStart = moment(dateStart).format('YYYY-MM-DD')
      dateEnd = moment(dateEnd).format('YYYY-MM-DD')
      apiParams += `&from=${dateStart}&to=${dateEnd}`
    }

    if (IsValueOkay(source)) {
      source = source == 'App (Private)' ? 'App (Private)' : source.toLowerCase()
      apiParams += `&platform=${source}`
    }

    if (IsValueOkay(stars)) {
      apiParams += `&star=${stars}`
    }

    if (IsValueOkay(language)) {
      apiParams += `&language=${language}`
    }

    if (IsValueOkay(feeling) && feeling != 'All') {
      apiParams += `&feeling=${feeling.toLowerCase()}`
    }

    const api = apiBase + '?' + apiParams

    // loadDatasets();
    // await loadFeelingData(tag, dateStart, dateEnd, source);
    // await loadStarData(tag, dateStart, dateEnd, source);
    // await loadIndiceData(tag, dateStart, dateEnd);
    const response = await new Promise((resolve) => {
      services.get_Record(api, (response) => {
        resolve(response)
      })
    })

    if (response.status == 200) {
      // reviewsLoading.value = false;
      reviews.value = response.data['data']
      // if (response.data['count'] <= 100) options.value.max = response.data['count'];
      // else options.value.max = 100;
      // all_items.value.reviews.value = response.data['count'];
      // all_items.value.rating.value = response.data['rating'];
      // all_items.value.global.value = response.data['global'];
    }
  }
  return {}
})
