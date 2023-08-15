import fs from 'fs'

const mfers = fs.readdirSync('assets')

mfers.map(f => fs.copyFileSync(`assets/${f}`, `mfers/${f.replace('permaweb-mfer-', '')}`))
