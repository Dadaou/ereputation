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
