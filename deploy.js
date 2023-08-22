import Bundlr from '@bundlr-network/client'
import { WarpFactory } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import mime from 'mime'
import { validate } from './spec.js'

import fs from 'fs'

const ATOMIC_TOKEN_SRC = 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ'
const warp = WarpFactory.forMainnet().use(new DeployPlugin())


export async function main(folder, walletFile) {
  try {
    const jwk = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))
    const collection = validate(JSON.parse(fs.readFileSync(`./${folder}/collection.json`, 'utf-8')))

    const bundlr = new Bundlr.default('https://node2.bundlr.network', 'arweave', jwk)

    // Banner is optional
    let banner = ""

    if (fs.existsSync(`./${folder}/banner.png`)) {
      banner = (await bundlr.uploadFile(`./${folder}/banner.png`)).id
    }
    if (fs.existsSync(`./${folder}/banner.gif`)) {
      banner = (await bundlr.uploadFile(`./${folder}/banner.gif`)).id
    }

    // deploy thumbnail.png
    let thumbnail = ""
    if (fs.existsSync(`./${folder}/thumbnail.png`)) {
      thumbnail = (await bundlr.uploadFile(`./${folder}/thumbnail.png`)).id
    }
    if (fs.existsSync(`./${folder}/thumbnail.gif`)) {
      thumbnail = (await bundlr.uploadFile(`./${folder}/thumbnail.gif`)).id
    }

    const assets = fs.readdirSync(`./${folder}`)
      .filter(f => f !== 'collection.json')
      .filter(f => f !== 'banner.gif')
      .filter(f => f !== 'banner.png')
      .filter(f => f !== 'thumbnail.png')
      .map(f => {
        const [n, ext] = f.split('.')
        const fileType = mime.getType(ext)
        return {
          folder,
          n,
          title: `${collection.title}${n}`,
          description: collection.description,
          topics: collection.topics,
          licenseTags: collection.licenseTags,
          filename: f,
          type: collection.type || 'unknown',
          code: collection.code,
          fileType: fileType,
          owners: collection.owners,
          creator: collection.creator,
          renderer: collection.renderer || null,
          thumbnail: thumbnail === "" ? null : thumbnail,
        }

      })


    const publish = await upload(bundlr)
    const items = await Promise.all(assets.map(publish))
    // registering assets
    await Promise.all(items.map(async id => {
      await warp.register(id, 'node2')
      await new Promise(r => setTimeout(r, 1000))
      console.log(`Registering - ${id}`)
    }))

    // create collection manifest and upload manifest
    const result = await publishCollection(bundlr)({
      collection,
      banner,
      thumbnail,
      items
    })

    await new Promise(r => setTimeout(r, 1000))
    await warp.register(result, 'node2')

    console.log('Collection: ', result)
  } catch (e) {
    console.log('ERROR: ', e.message)
  }
}

//main()

function publishCollection(bundlr) {
  return async (input) => {
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Name', value: input.collection.name },
      { name: 'Data-Protocol', value: 'Collection' },
      { name: 'App-Name', value: 'SmartWeaveContract' },
      { name: 'App-Version', value: '0.3.0' },
      { name: 'Contract-Src', value: ATOMIC_TOKEN_SRC },
      { name: 'Contract-Manifest', value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}' },
      {
        name: 'Init-State', value: JSON.stringify({
          balances: input.collection.owners,
          name: input.collection.name,
          description: input.collection.description,
          ticker: 'ATOMIC',
          claimable: [],
          creator: input.collection.creator
        })
      },
      { name: 'Title', value: input.collection.name },
      { name: 'Description', value: input.collection.description },
      { name: 'Type', value: 'Document' },
      { name: 'License', value: input.collection.LicenseTags.License },
      { name: 'Banner', value: input.banner },
      { name: 'Thumbnail', value: input.thumbnail },
      { name: 'Collection-Code', value: input.collection.code },
      { name: 'Creator', value: input.collection.creator }
    ]

    const result = await bundlr.upload(JSON.stringify({ type: 'Collection', items: input.items }), { tags })

    return result.id
  }
}

function upload(bundlr) {
  return async (asset) => {
    let _tags = [
      { name: 'Content-Type', value: asset.fileType },
      { name: 'App-Name', value: 'SmartWeaveContract' },
      { name: 'App-Version', value: '0.3.0' },
      { name: 'Contract-Src', value: ATOMIC_TOKEN_SRC },
      { name: 'Contract-Manifest', value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}' },
      {
        name: 'Init-State', value: JSON.stringify({
          balances: asset.owners,
          name: asset.title,
          description: asset.description,
          ticker: 'ATOMIC',
          claimable: [],
          creator: asset.creator
        })
      },
      { name: 'Title', value: asset.title },
      { name: 'Description', value: asset.description },
      { name: 'Type', value: asset.type },
      { name: 'Collection-Code', value: asset.code },
      { name: 'Indexed-By', value: 'ucm' },
      { name: 'Creator', value: asset.creator }
    ]
    _tags = _tags.concat(Object.keys(asset.licenseTags).map(k => ({ name: k, value: asset.licenseTags[k] })))
    _tags = _tags.concat(asset.topics.map(t => ({ name: `topic:${t}`, value: t })))
    if (asset.renderer) {
      _tags = _tags.concat([{ name: 'Render-With', value: asset.renderer }])
    }
    if (asset.thumbnail && asset.type === 'audio') {
      _tags = _tags.concat([{ name: 'Thumbnail', value: asset.thumbnail }])
    }

    const result = await bundlr.uploadFile(`./${asset.folder}/${asset.filename}`, {
      tags: _tags
    })

    return result.id
  }
}