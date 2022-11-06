const fs = require('fs')
const path = require('path')
const { genCompRef, setNavData, setMdxFileData, genRandomKey } = require('./utils')

// 表示当前工作空间
let _cwd = null

const nextDir = (basePath) => {
  const dirs = fs.readdirSync(basePath)

  // 读这一层目录 直接就是组件
  dirs.forEach((dirName) => {
    const newPath = path.resolve(basePath, dirName)

    // 只识别 目录 以及md/ mdx
    const fileStat = fs.statSync(newPath)
    if (fileStat.isFile() && !['.mdx', '.md'].includes(path.extname(newPath))) return

    // 判断是否是文件
    if (fileStat.isFile()) {
      const compName = genCompRef()
      setNavData({ label: dirName.replace(/\.(md|mdx)/gi, ''), value: compName, refName: compName })

      // 读取文件内容
      const fileData = fs.readFileSync(newPath, 'utf-8')
      setMdxFileData({ fileName: compName, fileData })
      return
    }

    // 开始读取下一层目录
    nextDir(newPath)
  })
}

const makeData = () => {
  _cwd = process.cwd()

  const dirs = fs.readdirSync(_cwd)
  if (dirs.length <= 0) {
    process.exit(1)
    return
  }

  const excludeNames = ['node_modules', '.git', '.gitignore']
  dirs.forEach((dirName) => {
    const newPath = path.resolve(_cwd, dirName)
    const pathAttr = fs.statSync(newPath)
    // 如果是排除的目录 或是 文件的话 直接跳过
    if (excludeNames.includes(dirName) || pathAttr.isFile()) return

    // 添加读取的指定数据
    setNavData({ label: dirName, value: genRandomKey(), children: [] })

    // 开始读取下一层目录
    nextDir(newPath)
  })
}

module.exports = {
  makeData
}
