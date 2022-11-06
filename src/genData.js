const { getNavData } = require('./utils')
const genData = () => {
  // 解析导航数据
  const navData = getNavData()
  if (!Array.isArray(navData) || navData.length === 0) return ''

  const resultData = []
  let children = []
  navData.forEach((item) => {
    if (Array.isArray(item.children)) {
      resultData.push(item)
      children = item.children
    } else {
      children.push(item)
    }
  })

  return resultData
}

module.exports = {
  genData
}
