import { defineStore } from 'pinia'
import { ref } from 'vue'
import services from '@Services/services.js'
// import moment from 'moment'

export const useChartsStore = defineStore(
  'charts',
  () => {
    const byDays = ref({})
    const byWeeks = ref({})
    const byMonths = ref({})
    const byQuarters = ref({})
    const bySemesters = ref({})

    const fetchData = async (tags, type, from, to, platform, next) => {
      // console.log(from, to)
      let apiBase = `/charts/comparaison`
      let apiParams = `tags=${tags}&type=${type}`
      if (from !== 'Invalid Date' && to !== 'Invalid Date') {
        apiParams += `&from=${from}&to=${to}`
      }

      // let url = `/charts/comparaison?tags=${tags}&type=${type}&from=${from}&to=${to}`

      if (platform && platform != 'global') {
        apiParams += `&platform=${platform}`
      }

      const api = apiBase + '?' + apiParams
      console.log(api)
      await services.get_Record(api, (response) => {
        if (response && response.status == 200) {
          next(response)
        }
      })
    }

    // const getFirstAndLastDayOfWeek = (d) => {
    //   const day = d.getDay()
    //   const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    //   const first = new Date(d.setDate(diff))
    //   const last = new Date(first.valueOf())
    //   last.setDate(last.getDate() + 6)

    //   return [first, last]
    // }

    // const getDatesBetween = (start, end, type) => {
    //   const currentDate = new Date(start)
    //   const endDate = new Date(end)
    //   const dates = []
    //   switch (type) {
    //     case 'days': {
    //       while (currentDate <= endDate) {
    //         dates.push(new Date(currentDate).toLocaleDateString('en-GB'))
    //         currentDate.setDate(currentDate.getDate() + 1)
    //       }
    //       break
    //     }
    //     case 'months': {
    //       while (currentDate.getMonth() <= endDate.getMonth()) {
    //         dates.push(`${moment(currentDate).format('MM-YYYY')}`)
    //         currentDate.setMonth(currentDate.getMonth() + 1)
    //       }
    //       break
    //     }
    //     case 'weeks': {
    //       while (currentDate <= endDate) {
    //         // dates.push(`${moment(currentDate).format('MM-YYYY')}`)
    //         const days = getFirstAndLastDayOfWeek(currentDate)
    //         dates.push(
    //           `w${moment(days[0]).week()}/${moment(days[1]).format('YYYY-MM')} ${
    //             days[0].getDate() >= 10 ? days[0].getDate() : '0' + days[0].getDate()
    //           }-${days[1].getDate() >= 10 ? days[1].getDate() : '0' + days[1].getDate()}`
    //         )
    //         currentDate.setDate(currentDate.getDate() + 7)
    //       }
    //       break
    //     }
    //     case 'quarters': {
    //       while (currentDate.getFullYear() <= endDate.getFullYear()) {
    //         let d = 1
    //         let f = 3
    //         for (let i = 1; i <= 4; i++) {
    //           dates.push(
    //             `Q${i} ${d < 10 ? '0' + d : d}/${currentDate.getFullYear()}-${
    //               f < 10 ? '0' + f : f
    //             }/${currentDate.getFullYear()}`
    //           )
    //           d += 3
    //           f += 3
    //         }
    //         currentDate.setFullYear(currentDate.getFullYear() + 1)
    //       }
    //       break
    //     }
    //     case 'semesters': {
    //       while (currentDate.getFullYear() <= endDate.getFullYear()) {
    //         let d = 1
    //         let f = 6
    //         for (let i = 1; i <= 2; i++) {
    //           dates.push(
    //             `S${i} ${d < 10 ? '0' + d : d}/${currentDate.getFullYear()}-${
    //               f < 10 ? '0' + f : f
    //             }/${currentDate.getFullYear()}`
    //           )
    //           d += 6
    //           f += 6
    //         }
    //         currentDate.setFullYear(currentDate.getFullYear() + 1)
    //       }
    //       break
    //     }
    //   }

    //   return dates
    // }

    const loadData = async (tag, type, from, to, platform, formatedDates = true) => {
      let fFrom = from
      let fTo = to

      if (!formatedDates) {
        const tFrom = from.split('/')
        const tTo = to.split('/')
        fFrom = `${tFrom[2]}-${tFrom[1]}-${tFrom[0]}`
        fTo = `${tTo[2]}-${tTo[1]}-${tTo[0]}`
      }

      let result = []

      await fetchData(tag.join(','), type.toLowerCase(), fFrom, fTo, platform, (response) => {
        let data = response.data.data
        if (data.length) {
          let items = data.length
          Object.keys(data[0].data).forEach((key) => {
            let tmp = { name: key }
            for (let i = 0; i < items; i++) {
              tmp[data[i].name] = data[i].data[key]
            }
            result.push(tmp)
          })
        }
      })

      return result
    }

    // const updateData = async (tag, type, from, to, platform, formatedDates = true) => {
    //   let fFrom = from
    //   let fTo = to

    //   if (!formatedDates) {
    //     const tFrom = from.split('/')
    //     const tTo = to.split('/')
    //     fFrom = `${tFrom[2]}-${tFrom[1]}-${tFrom[0]}`
    //     fTo = `${tTo[2]}-${tTo[1]}-${tTo[0]}`
    //   }

    //   await fetchData(tag.join(','), type, fFrom, fTo, platform, (response) => {
    //     const data = response.data
    //     switch (type) {
    //       case 'days': {
    //         data.forEach((r) => {
    //           if (Object.keys(byDays.value).includes(r.tag)) {
    //             const newDatas = { ...byDays.value[r.tag][platform], ...r.data }
    //             const name = byDays.value[r.tag].name

    //             let tmp = { name: name }
    //             tmp[platform] = newDatas

    //             byDays.value[r.tag] = { ...byDays.value[r.tag], ...tmp }
    //           } else {
    //             let tmp = { name: r.name }
    //             tmp[platform] = r.data

    //             byDays.value[r.tag] = { ...tmp }
    //           }
    //         })
    //         break
    //       }

    //       case 'weeks':
    //         data.forEach((r) => {
    //           if (Object.keys(byWeeks.value).includes(r.tag)) {
    //             const newDatas = { ...byWeeks.value[r.tag][platform], ...r.data }
    //             const name = byWeeks.value[r.tag].name

    //             let tmp = { name: name }
    //             tmp[platform] = newDatas

    //             byWeeks.value[r.tag] = { ...byWeeks.value[r.tag], ...tmp }
    //           } else {
    //             let tmp = { name: r.name }
    //             tmp[platform] = r.data
    //             byWeeks.value[r.tag] = { ...tmp }
    //           }
    //         })
    //         break
    //       case 'months': {
    //         data.forEach((r) => {
    //           if (Object.keys(byMonths.value).includes(r.tag)) {
    //             const newDatas = { ...byMonths.value[r.tag][platform], ...r.data }
    //             const name = byMonths.value[r.tag].name

    //             let tmp = { name: name }
    //             tmp[platform] = newDatas

    //             byMonths.value[r.tag] = { ...byMonths.value[r.tag], ...tmp }
    //           } else {
    //             let tmp = { name: r.name }
    //             tmp[platform] = r.data

    //             byMonths.value[r.tag] = { ...tmp }
    //           }
    //         })
    //         break
    //       }
    //       case 'quarters':
    //         data.forEach((r) => {
    //           if (Object.keys(byQuarters.value).includes(r.tag)) {
    //             const newDatas = { ...byQuarters.value[r.tag][platform], ...r.data }
    //             const name = byQuarters.value[r.tag].name

    //             let tmp = { name: name }
    //             tmp[platform] = newDatas

    //             byQuarters.value[r.tag] = { ...byQuarters.value[r.tag], ...tmp }
    //           } else {
    //             let tmp = { name: r.name }
    //             tmp[platform] = r.data

    //             byQuarters.value[r.tag] = { ...tmp }
    //           }
    //         })
    //         break
    //       case 'semesters':
    //         data.forEach((r) => {
    //           if (Object.keys(bySemesters.value).includes(r.tag)) {
    //             const newDatas = { ...bySemesters.value[r.tag][platform], ...r.data }
    //             const name = bySemesters.value[r.tag].name

    //             let tmp = { name: name }
    //             tmp[platform] = newDatas

    //             bySemesters.value[r.tag] = { ...bySemesters.value[r.tag], ...tmp }
    //           } else {
    //             let tmp = { name: r.name }
    //             tmp[platform] = r.data

    //             bySemesters.value[r.tag] = { ...tmp }
    //           }
    //         })
    //         break
    //     }
    //   })
    // }

    // const sortDates = (dates) => {
    //   dates.sort(function (a, b) {
    //     a = a.split('/').reverse().join('')
    //     b = b.split('/').reverse().join('')
    //     return a > b ? 1 : a < b ? -1 : 0
    //     // return a.localeCompare(b);         // <-- alternative
    //   })
    //   return dates
    // }

    // const getData = (tags, type, from, to, platform) => {
    //   // setTimeout(() => {
    //     const dayList = getDatesBetween(from, to, type.toLowerCase())
    //     const results = []
    //     let sources = {}
    //     switch (type) {
    //       case 'days': {
    //         sources = byDays.value
    //         break
    //       }
    //       case 'weeks': {
    //         sources = byWeeks.value
    //         break
    //       }
    //       case 'months': {
    //         sources = byMonths.value
    //         break
    //       }
    //       case 'quarters': {
    //         sources = byQuarters.value
    //         break
    //       }
    //       case 'semesters': {
    //         sources = bySemesters.value
    //         break
    //       }
    //     }

    //     console.log(sources)
    //     dayList.forEach((day) => {
    //       const tmpObj = {
    //         name: day
    //       }
    //       tags.forEach((tag) => {
    //         console.log(sources[tag])
    //         console.log(sources[tag].name)
    //       })
    //     })
    //     //   const tmpObj = {
    //     //     name: day
    //     //   }
    //     //   tags.forEach((tag) => {
    //     //     tmpObj[sources[tag].name] = sources[tag][platform][day]
    //     //   })
    //     //   results.push(tmpObj)
    //     // })
    //     return results
    //   // }, 2000)
    // }

    // const checkData = async (tags, type, from, to, platform = 'global') => {
    //   const dayList = getDatesBetween(from, to, type.toLowerCase())

    //   switch (type.toLowerCase()) {
    //     case 'days': {
    //       let dates = []
    //       for (let i = 0; i < tags.length; i++) {
    //         let tag = tags[i]
    //         const data = byDays.value[tag] && byDays.value[tag][platform]
    //         if (data) {
    //           dayList.forEach((date) => {
    //             if (!Object.keys(data).includes(date)) {
    //               dates.push(date)
    //             }
    //           })
    //         }
    //       }
    //       if (dates.length) {
    //         dates = sortDates(dates)
    //         await updateData(tags, 'days', dates[0], dates.pop(), platform, false)
    //       } else {
    //         await updateData(tags, 'days', from, to, platform)
    //       }
    //       break
    //     }
    //     case 'weeks': {
    //       let update = false
    //       for (let i = 0; i < tags.length; i++) {
    //         let tag = tags[i]
    //         const data = byWeeks.value[tag] && byWeeks.value[tag][platform]
    //         if (data) {
    //           dayList.forEach((date) => {
    //             if (!Object.keys(data).includes(date)) {
    //               update = true
    //             }
    //           })
    //         } else {
    //           update = true
    //         }
    //       }
    //       if (update) {
    //         await updateData(tags, 'weeks', from, to, platform)
    //       }
    //       break
    //     }
    //     case 'months': {
    //       let dates = []
    //       for (let i = 0; i < tags.length; i++) {
    //         let tag = tags[i]
    //         const data = byMonths.value[tag] && byMonths.value[tag][platform]
    //         if (data) {
    //           dayList.forEach((date) => {
    //             if (!Object.keys(data).includes(date)) {
    //               dates.push(date)
    //             }
    //           })
    //         }
    //       }
    //       if (dates.length) {
    //         dates = dates.sort(function (a, b) {
    //           return a > b ? 1 : a < b ? -1 : 0
    //         })
    //         const tFrom = dates[0].split('-')
    //         const tTo = dates.pop().split('-')
    //         await updateData(
    //           tags,
    //           'months',
    //           `${tFrom[1]}-${tFrom[0]}-01`,
    //           `${tTo[1]}-${tTo[0]}-01`,
    //           platform,
    //           true
    //         )
    //       } else {
    //         await updateData(tags, 'months', from, to, platform)
    //       }
    //       break
    //     }
    //     case 'quarters': {
    //       let update = false
    //       for (let i = 0; i < tags.length; i++) {
    //         let tag = tags[i]
    //         const data = byQuarters.value[tag] && byQuarters.value[tag][platform]
    //         if (data) {
    //           const dayList = getDatesBetween(from, to, 'quarters')
    //           if (!Object.keys(data).includes(dayList[0])) {
    //             update = true
    //           }
    //         } else {
    //           update = true
    //         }
    //       }
    //       if (update) {
    //         await updateData(tags, 'quarters', from, to, platform)
    //       }
    //       break
    //     }
    //     case 'semesters': {
    //       let update = false
    //       for (let i = 0; i < tags.length; i++) {
    //         let tag = tags[i]
    //         const data = bySemesters.value[tag] && bySemesters.value[tag][platform]
    //         if (data) {
    //           const dayList = getDatesBetween(from, to, 'semesters')
    //           if (!Object.keys(data).includes(dayList[0])) {
    //             update = true
    //           }
    //         } else {
    //           update = true
    //         }
    //       }
    //       if (update) {
    //         await updateData(tags, 'semesters', from, to, platform)
    //       }
    //       break
    //     }
    //   }

    //   return getData(tags, type.toLowerCase(), from, to, platform)
    //   // return []
    // }

    return {
      byDays,
      byWeeks,
      byMonths,
      byQuarters,
      bySemesters,
      // updateData,
      // checkData,
      fetchData,
      loadData
    }
  }
  // {
  //   persist: true
  // }
)
