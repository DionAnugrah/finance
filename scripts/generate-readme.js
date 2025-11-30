import fs from 'fs'

const template = `
# Auto README

Generated: ${new Date().toISOString()}
`

fs.writeFileSync('README.md', template)

console.log('README updated ✔')
