# Web3.js Pyth Network Plugin

This is a [web3.js](https://github.com/web3/web3.js) `4.x` plugin for interacting with _Pyth Network_ Ethereum contracts.

## Prerequisites

- :gear: [NodeJS](https://nodejs.org/)
- :toolbox: [Yarn](https://yarnpkg.com/)

## Installation

```bash
yarn add web3.js-pythnet-plugin
```

## Using this plugin

### Installing Version `4.x` of `web3`

When adding the `web3` package to your project, make sure to use version `4.x`:

- `npm i -S web3@4.0.3`
- `yarn add web3@4.0.3`

> **_NOTE_**  
> If 4.x was already released, you are good to just use `web3` without appending anything to it.

To verify you have the correct `web3` version installed, after adding the package to your project (the above commands), look at the versions listed in your project's `package.json` under the `dependencies` section, it should contain version 4.x similar to:

```json
"dependencies": {
	"web3": "4.0.3"
}
```

### Registering the Plugin with a web3.js Instance

After importing `PythNetworkPlugin` from `web3.js-pythnet-plugin` and `Web3` from `web3`, register an instance of `PythNetworkPlugin` with an instance of `Web3` like so:

```typescript
import { PythNetworkPlugin } from '@chainsafe/web3-plugin-chainlink';
import { Web3 } from 'web3';

const web3 = new Web3('YOUR_PROVIDER_URL');
const plugin = new PythNetworkPlugin({ type: 'stable', contract: 'Arbitrum' });

web3.registerPlugin(plugin);
```

More information about registering web3.js plugins can be found [here](https://docs.web3js.org/docs/guides/web3_plugin_guide/plugin_users#registering-the-plugin).

### Plugin Methods

> [!WARNING]
> Not fully documented
