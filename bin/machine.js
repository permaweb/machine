#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { main } from '../deploy.js'

yargs(hideBin(process.argv))
  .usage('Usage: $0 <assets> -w [walletFile]')
  .demandOption(['w'])
  .command('$0', 'publish assets', () => {}, argv => {
    main(argv._[0], argv.w)
  })
  .argv
