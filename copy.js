import fs from 'fs'

const memes = fs.readdirSync('assets')

memes.map((f, i) => fs.copyFileSync(`assets/${f}`, `permashade/${i + 1}.png`))
//memes.map((f, i) => console.log(f, i))