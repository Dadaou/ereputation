const setCssVariable = (item, value) => {
  const r = document.querySelector(':root')
  r.style.setProperty(item, value)
}

export const refreshTheme = (back_color, font_color, title_color) => {
  setCssVariable('--color-bgp', back_color)
  setCssVariable('--color-danger', title_color)
  setCssVariable('--color-bg2', font_color)
  setCssVariable('--color-primary', back_color)
  setCssVariable('--light-color-bg2', `color-mix(in srgb, ${back_color} 70%, white)`)
  setCssVariable('--light-color-danger', `color-mix(in srgb, ${title_color} 25%, white)`)
  setCssVariable('--el-color-primary', back_color)
}

const hexToRgb = (hex) => {
  // Retirer le caractère # si présent
  hex = hex.replace(/^#/, '')

  // Si le format est court (e.g. #03F), étendre à la forme longue (e.g. #0033FF)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  // Convertir les composants HEX en valeurs RGB
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r, g, b]
}

// Exemple d'utilisation
console.log(hexToRgb('#ff5733')) // Output: [255, 87, 51]

const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255

  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin

  let h = 0,
    s = 0,
    l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)
  if (h < 0) h += 360

  l = (cmax + cmin) / 2

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return [h, s, l]
}

const hslToRgb = (h, s, l) => {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return [r, g, b]
}

const rgbToHex = (r, g, b) => {
  const componentToHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

const rgbaToHex = (rgba) => {
  // var parts = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d(?:\.\d+)?))?\)$/)
  // delete parts[0]
  const parts = []
  for (var i = 0; i <= 3; ++i) {
    parts[i] = parseInt(rgba[i]).toString(16)
    if (parts[i].length == 1) parts[i] = '0' + parts[i]
  }
  return '#' + parts.join('')
}

export const generateShadedPaletteByLight = (hexColor, numberOfShades = 5) => {
  let [r, g, b] = hexToRgb(hexColor)
  let [h, s, l] = rgbToHsl(r, g, b)

  let shades = []
  // const step = l / numberOfShades
  const step = 25 / numberOfShades
  // const initialL = l

  console.log('number: ', numberOfShades)
  console.log('step:', step)

  let i = 1

  while (shades.length < numberOfShades) {
    let newL = step * i

    console.log('newL: ', newL)

    if (newL > l && newL >= 60) {
      let [newR, newG, newB] = hslToRgb(h, s, newL)
      shades.push(rgbToHex(newR, newG, newB))
    }

    i++
  }

  console.log('Results: ' + shades)

  return shades
}

export const generateShadedPaletteByOpacity = (hexColor, numberOfShades = 5) => {
  let [r, g, b] = hexToRgb(hexColor)
  // let [h, s, l] = rgbToHsl(r, g, b)

  let shades = []
  // const step = l / numberOfShades
  const step = 150 / numberOfShades
  // const initialL = l

  console.log('number: ', numberOfShades)
  console.log('step:', step)

  let i = numberOfShades

  while (shades.length < numberOfShades) {
    let newO = step * i

    if (newO <= 150) {
      console.log('newO: ', newO)
      shades.push(rgbaToHex([r, g, b, newO]))
    }

    i--
  }

  console.log('Results: ' + shades)

  return shades
}

// Exemple d'utilisation
// let rgbColor = #000000 // couleur de départ
// let shadedPalette = generateShadedPalette(rgbColor, 5)
// console.log(shadedPalette) // Output: [ '#000000', '#021b14', '#043728', '#06523d', '#086e51', '#0a8964' ]
