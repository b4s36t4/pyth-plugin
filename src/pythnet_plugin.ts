import { Contract, Web3PluginBase, validator, utils } from 'web3';
import { PythAbi } from './pyth_abi';
import { BetaNetworks, Networks, PriceFeedIDs } from './types';

interface Options {
  pluginNameSpace?: string;
  defaultAggregatorABI?: typeof PythAbi;
  type: 'stable' | 'beta';
  contract: BetaNetwork | StableNetwork;
}

type BetaNetwork = keyof typeof BetaNetworks;
type StableNetwork = keyof typeof Networks;
type PriceFeedID = keyof typeof PriceFeedIDs;

// Doc: https://docs.pyth.network/evm
class PythNetworkPlugin extends Web3PluginBase {
  public pluginNamespace: string;
  public defaultAggregatorABI: typeof PythAbi;
  public contract: Contract<typeof PythAbi>;

  constructor(options: Options) {
    super();

    let contractAddress;

    if (options.type === 'beta') {
      contractAddress = BetaNetworks[options.contract as BetaNetwork];
    }

    if (options.type === 'stable') {
      contractAddress = Networks[options.contract as StableNetwork];
    }

    if (!contractAddress) {
      throw new Error('Please provide the correct network name');
    }

    this.pluginNamespace = options?.pluginNameSpace || 'PythNetwork';
    this.defaultAggregatorABI = options?.defaultAggregatorABI || PythAbi;

    this.contract = new Contract<typeof PythAbi>(
      this.defaultAggregatorABI,
      contractAddress
    );

    this.contract.link(this);
  }

  private validate(priceIdKey: PriceFeedID) {
    const priceId = PriceFeedIDs[priceIdKey];

    if (!priceId) {
      throw new Error(
        `Provided ${priceIdKey} is invalid, please raise a bug report for the following`
      );
    }

    // If the priceId is not a valid 32byte string
    // Ex: referencehttps://docs.pyth.network/evm/get-price
    if (!validator.isHexString32Bytes(priceId)) {
      throw new Error(
        `Provided ${priceIdKey} is not an address, please raise a bug report for the following`
      );
    }

    return priceId;
  }

  /**
   * calls the `getPrice` method from  pyth contract
   * Doc: https://docs.pyth.network/evm/get-price
   * @param {PriceFeedID} priceIdKey
   */
  public async getPrice(priceIdKey: PriceFeedID) {
    const priceId = this.validate(priceIdKey);
    return await this.contract.methods.getPrice(priceId).call();
  }

  /**
   * Calls getPriceUnSafe method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-price-unsafe
   * @param {PriceFeedID} priceIdKey
   */
  public async getPriceUnsafe(priceIdKey: PriceFeedID) {
    const priceId = this.validate(priceIdKey);
    return await this.contract.methods.getPriceUnsafe(priceId).call();
  }

  /**
   * Calls getPriceNoOlderThan method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-price-no-older-than
   * @param {PriceFeedID} priceIdKey
   * @param {number} age
   */
  public async getPriceNoOlderThan(priceIdKey: PriceFeedID, age: number) {
    const priceId = this.validate(priceIdKey);
    return await this.contract.methods
      .getEmaPriceNoOlderThan(priceId, age)
      .call();
  }

  /**
   * Calls getEmaPrice method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-price-unsafe
   * @param {PriceFeedID} priceIdKey
   */
  public async getEmaPrice(priceIdKey: PriceFeedID) {
    const priceId = this.validate(priceIdKey);
    return await this.contract.methods.getEmaPrice(priceId).call();
  }

  /**
   * Calls getEmaPriceUnsafe method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-ema-price-unsafe
   * @param {PriceFeedID} priceIdKey
   */
  public async getEmaPriceUnsafe(priceIdKey: PriceFeedID) {
    const priceId = this.validate(priceIdKey);
    return await this.contract.methods.getEmaPriceUnsafe(priceId).call();
  }

  /**
   * Calls getEmaPriceNoOlderThan method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-ema-price-no-older-than
   * @param {PriceFeedID} priceIdKey
   * @param {number} age
   */
  public async getEmaPriceNoOlderThan(priceIdKey: PriceFeedID, age: number) {
    const priceId = this.validate(priceIdKey);
    return await this.contract.methods
      .getEmaPriceNoOlderThan(priceId, age)
      .call();
  }

  /**
   * Calls getUpdateFee method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-update-fee
   * @param {HexString} data
   */
  public async getUpdateFee(data: string) {
    if (!validator.isHexString(data)) {
      throw new Error('Expected HexString, got wrong type');
    }
    // Expecting type is Bytes[]
    return this.contract.methods.getUpdateFee([utils.hexToBytes(data)]).call();
  }

  /**
   * Calls getValidTimePeriod method from pyth contract
   * Doc: https://docs.pyth.network/evm/get-valid-time-period
   */
  public async getValidTimePeriod() {
    return await this.contract.methods.getValidTimePeriod().call();
  }
}

// Module Augmentation
declare module 'web3' {
  interface Web3Context {
    pyth: PythNetworkPlugin;
  }
}

export { PythNetworkPlugin };
