const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const ProgressBar = require('progress')

// 表示解析 目录导航数据
const navData = []
// 表示组件编号
let componentRef = 1

// 表示生成随机的id
const genRandomKey = () => `_${(Math.random() * 10000) | 0}${+new Date()}`
// 表示生成组件编号
const genCompRef = () => `A${componentRef++}`

// 获取 或是 设置导航数据
const getNavData = () => navData
const setNavData = (item) => (!item ? (navData.length = 0) : navData.push(item))

// 读取文件 设置新的mdx
const setMdxFileData = (item) => {
  if (!item) return

  const { fileName, fileData } = item
  const newPath = path.join(process.cwd(), 'blob-page-template/src/components/mdx', `${fileName}.mdx`)

  // 开始写文件
  fs.writeFileSync(newPath, fileData, { encoding: 'utf-8' })
}

// 执行命令
const execCommand = (command, options = {}) => {
  if (!Reflect.has(options, 'cwd')) {
    options = { ...options, cwd: __dirname }
  }
  options = { ...options, shell: true }

  return new Promise((resolve, reject) => {
    exec(command, options, (error) => {
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}

// 进度条
const loading = () => {
  return new Promise((resolve) => {
    const bar = new ProgressBar('parsing [:bar] :percent :etas', { total: 50 })
    const timer = setInterval(function () {
      bar.tick()
      if (bar.complete) {
        clearInterval(timer)
        resolve()
      }
    }, 20)
  })
}

module.exports = {
  getNavData,
  setNavData,
  genCompRef,
  genRandomKey,
  setMdxFileData,
  execCommand,
  loading
}
