# The Machine

The Machine is a tool for deploying collections to the permaweb. To deploy a collection, you need a directory containing the following files:

## Usage

`npx @permaweb/machine myAtomicAssets`

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

## Collection JSON Schema

The `collection.json` file follows a specific schema to describe your collection. Here are the available properties:

| Property    | Description                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| name        | The name of your collection.                                                                                                             |
| title       | The title prefix, which will be appended to the filename. Usually, it is a number.                                                       |
| description | The description that you want to appear on the collection and every asset.                                                               |
| topics      | Discoverable topics for your collection.                                                                                                 |
| licenseTags | Tags to define your license.                                                                                                             |
| owners      | A set of wallet addresses with the numeric amount of units for each wallet.                                                              |
| type        | The type of asset.                                                                                                                       |
| code        | An identifier for your collection. If left blank, a GUID will be created. This enables linking between the collection and manifest file. |
| price       | Unit price for each item to list                                                                                                         |
| qty         | Qty from 0 - 100 of each item to list, eg 90 for 90%                                                                                     |

Please make sure to provide the necessary information in the `collection.json` file to accurately represent your collection.

Enjoy using The Machine to deploy your collections to the permaweb!
