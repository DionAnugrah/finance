// scripts/generate-readme.js
const fs = require('fs')

const template = `
# My Project 🚀

Generated at: ${new Date().toISOString()}

## Files
${fs
  .readdirSync('.')
  .map((f) => `- ${f}`)
  .join('\n')}
`

fs.writeFileSync('README.md', template)
