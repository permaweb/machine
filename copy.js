import fs from 'fs'

const memes = fs.readdirSync('assets')

const folder = process.argv[2]

fs.mkdirSync(folder)
memes.map((f, i) => fs.copyFileSync(`assets/${f}`, `${folder}/${i + 1}.png`))
//memes.map((f, i) => console.log(f, i))