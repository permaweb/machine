# The Machine

The Machine is an atomic asset creator tool for deploying collections to the permaweb. To deploy a collection, you need a directory containing the following files:

* collection.json
* 1..X.png or 1..X.mp3 etc.
* banner.png
* thumbnail.png

## Usage

```sh
npm i @permaweb/machine
npx @permaweb/machine <collection> -w <arWalletFile>
```

## Example

create folder with assets 'mutants'
add a collection.json in folder along with the assets
drop you wallet.json file in the project folder

```sh
npm i @permaweb/machine
npx @permaweb/machine mutants -w ./wallet.json
```

## Docs

- Your asset files
- A `collection.json` file that describes your project
- (OPTIONAL) A `banner.png` file to provide a banner for your collection

Here is an example directory structure:

```
- assets
  - 0.png
  - 1.png
  - 2.png
  - collection.json
  - banner.png
```

The `banner.png` file should have dimensions of 1600x900 pixels.

> NOTE: If you want to add a description for each file, just include a `.txt` for each asset, so if you have asset-01.png, you would include asset-01.txt, etc.

## Collection JSON Schema

The `collection.json` file follows a specific schema to describe your collection. Here are the available properties:

| Property    | Description                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| name        | The name of your collection.                                                                                                             |
| title       | The title prefix, which will be appended to the filename. Usually, it is a number. If you want to use the filename as the title, then enter "FILENAME" as the value                                                      |
| description | The description that you want to appear on the collection and every asset.                                                               |
| topics      | Discoverable topics for your collection.                                                                                                 |
| licenseTags | Tags to define your license.                                                                                                             |
| owners      | A set of wallet addresses with the numeric amount of units for each wallet.                                                              |
| type        | The type of asset.                                                                                                                       |
| code        | An identifier for your collection. If left blank, a GUID will be created. This enables linking between the collection and manifest file. |
| creator | wallet address of the creator |

## Example collection.json

```json
{
  "name": "Cyber Raccoon collection",
  "title": "Cyber Raccoon #", 
  "description": "Cyber Raccoon collection",
  "topics": ["cyber", "animals", "permaweb"],
  "licenseTags": {
    "License": "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8",
    "Access": "public",
    "Derivation": "allowed-with-license-fee",
    "Derivation-Fee": "One-Time-0.1",
    "Commercial": "allowed",
    "Commercial-Fee": "One-Time-0.5",
    "Payment-Mode": "Global-Distribution"
  },
  "owners": {
    "vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI": 100
  },
  "type": "image",
  "code": "raccoon-collection",
  "creator": "vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI"
}
```

Please make sure to provide the necessary information in the `collection.json` file to accurately represent your collection.

Enjoy using The Machine to deploy your collections to the permaweb!
