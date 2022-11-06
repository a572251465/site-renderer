const { execCommand } = require('./utils')
const { removeSync } = require('fs-extra')
const path = require("path")

const downloadTpl = async (options) => {
  const rootPath = options.cwd
  // 先删除指定文件
  removeSync(path.join(rootPath, "blob-page-template"))

  await execCommand('git clone https://gitee.com/li_haohao_1/blob-page-template.git', {
    cwd: rootPath
  })
}

module.exports = {
  downloadTpl
}
