import papa from 'papaparse'
import * as XLSX from 'xlsx'
import services from '@Services/services.js'

function downloadCSV(data, filename) {
  const blob = new Blob([data], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}

function convertCSVToExcel(csvData, filename) {
  const csvArray = csvData.split('\n').map((row) => row.split(','))
  const workbook = XLSX.utils.book_new()
  workbook.SheetNames.push('Sheet1')
  const worksheet = XLSX.utils.aoa_to_sheet(csvArray)
  workbook.Sheets['Sheet1'] = worksheet
  const excelBinary = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'binary'
  })
  const excelBlob = new Blob([s2ab(excelBinary)], {
    type: 'application/octet-stream'
  })
  const excelUrl = URL.createObjectURL(excelBlob)
  const a = document.createElement('a')

  a.style.display = 'none'
  a.href = excelUrl
  a.download = `${filename}.xlsx`
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(excelUrl)
}

const exportContact = async (type, filename, api, headers) => {
  const response = await new Promise((resolve, reject) => {
    services.get_Record(api, (response) => {
      resolve(response)
    })
  })

  if (response.status == 200) {
    let data = response.data

    data = data.map((item) => {
      let gender = 'M'
      if (item.gender == 'female') gender = 'F'

      let tmp = {
        Id: item.id,
        Firstname : item.firstname,
        Lastname : item.lastname,
        Gender: gender,
        Email: item.email,
        Establishment: item.establishment_name,
        Date: item.created_at
      }
      return tmp
    })

    const jsonStr = JSON.stringify(data)
    var csv = papa.unparse({
      fields: headers,
      data: jsonStr
    })

    if (type == 'csv') downloadCSV(csv, filename)
    else convertCSVToExcel(csv, filename)
  }
}
export default {
  exportContact
}
