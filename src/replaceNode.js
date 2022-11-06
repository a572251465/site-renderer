const path = require('path')
const fs = require('fs')

/**
 * @author lihh
 * @description 开始替换节点
 * @param options name/ cwd 等参数
 * @param arrData 构造后的数据
 */
const { getNavData } = require('./utils')
const replaceNode = (options, arrData) => {
  // 1. 替换 // <!-- import-components --> 节点
  const navData = getNavData()
  const refNames = navData.filter((item) => Reflect.has(item, 'refName')).map((item) => item.refName)

  const importNames = refNames.map((name) => `import ${name} from "./components/mdx/${name}.mdx";`)
  // 指定文件
  let assignFile = path.resolve(options.cwd, 'blob-page-template/src/App.vue')
  let content = fs.readFileSync(assignFile, 'utf-8').replace(`// <!-- import-components -->`, importNames.join(' '))

  // 2. 替换 // <!-- components-replace --> 节点
  const componentsTpl = `components: { ${refNames.concat('Header').join(',')} },`
  content = content.replace(`// <!-- components-replace -->`, componentsTpl)

  // 3. 替换 // <!-- mock-data --> 节点
  content = content.replace(`// <!-- mock-data -->`, `mockData = ${JSON.stringify(arrData)};`)
  fs.writeFileSync(assignFile, content, { encoding: 'utf-8' })

  // 4. 替换 <!--  js-replaces  --> 节点
  assignFile = path.resolve(options.cwd, 'blob-page-template/index.html')
  content = fs
    .readFileSync(assignFile, 'utf-8')
    .replace(`<!--  js-replaces  -->`, `<script type="application/javascript" src = "/global.js"></script>`)
  fs.writeFileSync(assignFile, content, { encoding: 'utf-8' })

  // 生成共同的文件
  assignFile = path.resolve(options.cwd, 'blob-page-template/public/global.js')
  const name = options.name || '始于清风'
  const url = options.url || ''
  fs.writeFileSync(
    assignFile,
    `
    window._selfField.name = "${name}";
    window._selfField.url = "${url}"
  `
  )
}

module.exports = {
  replaceNode
}
