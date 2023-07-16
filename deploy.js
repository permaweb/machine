import Bundlr from '@bundlr-network/client'
import { WarpFactory } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import fs from 'fs'

const ATOMIC_TOKEN_SRC = 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ'
const folder = process.argv.splice(2)[0]
const warp = WarpFactory.forMainnet().use(new DeployPlugin())
const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
const collection = JSON.parse(fs.readFileSync(`./${folder}/collection.json`, 'utf-8'))

async function main() {
  const bundlr = new Bundlr.default('https://node2.bundlr.network', 'arweave', jwk)
  const assets = fs.readdirSync(`./${folder}`)
    .filter(f => f !== 'collection.json')
    .filter(f => f !== 'banner.png')
    .map(f => {
      const n = f.split('.')[0]
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
        fileType: 'image/png',
        owners: collection.owners
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
  
  // Banner is optional
  let banner = ""
  const hasBanner = fs.fstatSync(`./${folder}/banner.png`)
  if (hasBanner) {
    banner = (await bundlr.uploadFile(`./${folder}/banner.png`)).id
  }
  // deploy banner.png
  

  // create collection manifest and upload manifest
  const result = await publishCollection(bundlr)({
    collection,
    banner,
    items
  })

  await new Promise(r => setTimeout(r, 1000))
  await warp.register(result, 'node2')

  console.log('Collection: ', result)
}

main()

function publishCollection(bundlr) {
  return async (input) => {
    const tags = [
      { name: 'Content-Type', value: 'application/json'},
      { name: 'Name', value: input.collection.name},
      { name: 'Data-Protocol', value: 'Collection'},
      { name: 'App-Name', value: 'SmartWeaveContract'},
      { name: 'App-Version', value: '0.3.0'},
      { name: 'Contract-Src', value: ATOMIC_TOKEN_SRC},
      { name: 'Contract-Manifest', value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}'},
      { name: 'Init-State', value: JSON.stringify({
        balances: input.collection.owners,
        name: input.collection.name,
        description: input.collection.description,
        ticker: 'ATOMIC',
        claimable: []
      })},
      { name: 'Title', value: input.collection.name },
      { name: 'Description', value: input.collection.description },
      { name: 'Type', value: 'Document' },
      { name: 'License', value: 'UDLicense' },
      { name: 'Banner', value: input.banner },
      { name: 'Collection-Code', value: input.collection.code}
    ]
    
    const result = await bundlr.upload(JSON.stringify({type: 'Collection', items: input.items}), {tags})
    
    return result.id
  }
}

function upload(bundlr) {
  return async (asset) => {
    let _tags = [
      { name: 'Content-Type', value: asset.fileType },
      { name: 'App-Name', value: 'SmartWeaveContract'},
      { name: 'App-Version', value: '0.3.0'},
      { name: 'Contract-Src', value: ATOMIC_TOKEN_SRC},
      { name: 'Contract-Manifest', value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}'},
      { name: 'Init-State', value: JSON.stringify({
        balances: asset.owners,
        name: asset.title,
        description: asset.description,
        ticker: 'ATOMIC',
        claimable: []
      })},
      { name: 'Title', value: asset.title },
      { name: 'Description', value: asset.description },
      { name: 'Type', value: asset.type },
      { name: 'License', value: asset.licenseTags.License },
      { name: 'Derivation', value: asset.licenseTags.Derivation },
      { name: 'Commercial', value: asset.licenseTags.Commercial },
      { name: 'License-Fee', value: asset.licenseTags['License-Fee']},
      { name: 'Payment-Mode', value: asset.licenseTags['Payment-Mode']},
      { name: 'Collection-Code', value: asset.code}
    ]
    
    _tags = _tags.concat(asset.topics.map(t => ({ name: `topic:${t}`, value: t})))
    
    //console.log(_tags)

    const result = await bundlr.uploadFile(`./${asset.folder}/${asset.filename}`, {
      tags: _tags})
    
    return result.id
  }
}