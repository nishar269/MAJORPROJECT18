// Minimal Blockchain implementation for identity verification
const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
      .digest('hex');
  }
}

class IdentityBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, parseInt(new Date().getTime() / 1000), {
      touristId: 'Genesis',
      validity: true,
    }, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addIdentity(data) {
    const newBlock = new Block(
      this.chain.length,
      parseInt(new Date().getTime() / 1000),
      data,
      this.getLatestBlock().hash
    );
    // Real consensus mechanism skipped for demo
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }

  verifyTourist(hashToVerify) {
    // Basic verification: search the chain for the touristId hash
    return this.chain.some(block => block.data.idHash === hashToVerify && block.data.validity);
  }
}

module.exports = { Block, IdentityBlockchain };

// Quick test
if (require.main === module) {
  const blockchain = new IdentityBlockchain();
  
  // Generating a hash
  const touristIdRaw = 'USR12345';
  const hashedId = crypto.createHash('sha256').update(touristIdRaw).digest('hex');
  
  console.log('Adding Tourist ID:', hashedId);
  blockchain.addIdentity({ idHash: hashedId, validity: true });
  
  console.log('Blockchain is valid?', blockchain.isChainValid());
  console.log('Verify USR123?', blockchain.verifyTourist(hashedId));
}
