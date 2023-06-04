const bip39 = require('bip39');
const hdkey = require('hdkey');
const { Wallet } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateEthereumWallets = async () => {
  rl.question('Enter the number of wallets to generate: ', async (numWallets) => {
    numWallets = parseInt(numWallets);

    if (isNaN(numWallets) || numWallets <= 0) {
      console.log('Invalid number of wallets');
      rl.close();
      return;
    }

    const wallets = [];
    for (let i = 0; i < numWallets; i++) {
      const mnemonic = bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = hdkey.fromMasterSeed(seed);
      const account = root.derive(`m/44'/60'/0'/0/${i}`);
      const privateKey = account.privateKey.toString('hex');
      const wallet = new Wallet(privateKey);

      wallets.push({
        mnemonic: mnemonic,
        address: wallet.address,
        privateKey: privateKey
      });
    }

    console.log('Generated Wallets:');
    wallets.forEach((wallet, index) => {
      console.log(`Wallet ${index + 1}:`);
      console.log('-------------------------------------------------------------------------------------');
      console.log('Mnemonic:', wallet.mnemonic);
      console.log('Address:', wallet.address);
      console.log('Private Key:', wallet.privateKey);
      console.log('-------------------------------------------------------------------------------------');
    });

    rl.close();
  });
};

generateEthereumWallets();
