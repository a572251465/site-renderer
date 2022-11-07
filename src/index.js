const { program } = require('commander')
const { downloadTpl } = require('./downloadTpl')
const { makeData } = require('./makeData')
const { replaceNode } = require('./replaceNode')
const { compileFile } = require('./compileFile')
const { genData } = require('./genData')
const { setNavData, loading } = require('./utils')

;(async () => {
  program
    .option('-n, --name <name>', 'please input blob name', ',')
    .option('-l, --url <url>', 'please input github address', ',')

  program.parse(process.argv)

  // 选择查询到参数结果
  const options = { ...program.opts(), cwd: process.cwd() }
  if (options.name === ',') options.name = ''
  if (options.url === ',') options.url = ''

  // 每次初期化数据
  setNavData(null)

  // 下载模板
  await downloadTpl(options)
  await loading()
  console.log('√ 1. template download succeeded')
  // 构建数据 读取md文件 在指定编译目录下重新生成mdx
  makeData()
  console.log('√ 2. read the md (x) file and generate a new file')
  // 构建json对象的数据
  const arrData = genData()
  console.log('√ 3. format data successfully')
  // 替换节点
  replaceNode(options, arrData)
  console.log('√ 4. template keyword replaced successfully')
  // 编译文件
  compileFile()
  console.log('√ 5. resource compilation succeeded')

  console.log('end of execution')
})()
