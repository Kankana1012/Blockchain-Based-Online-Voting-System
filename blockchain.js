class Block {
    constructor(index, data, previousHash = '') {
      this.index = index;
      this.timestamp = new Date().toLocaleString();
      this.data = data;
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
    }
  
    calculateHash() {
      return CryptoJS.SHA256(this.index + this.timestamp + this.data + this.previousHash).toString();
    }
  }
  
  class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
    }
  
    createGenesisBlock() {
      const data = CryptoJS.AES.encrypt(
        JSON.stringify({ voterId: "GENESIS", candidate: "-" }),
        "secureVote123"
      ).toString();
      return new Block(0, data, "0");
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    addBlock(newBlock) {
      newBlock.previousHash = this.getLatestBlock().hash;
      newBlock.hash = newBlock.calculateHash();
      this.chain.push(newBlock);
    }
  
    isChainValid() {
      for (let i = 1; i < this.chain.length; i++) {
        const curr = this.chain[i];
        const prev = this.chain[i - 1];
        if (curr.hash !== curr.calculateHash()) return false;
        if (curr.previousHash !== prev.hash) return false;
      }
      return true;
    }
  }
  
  let VotingBlockchain;
  
  if (localStorage.getItem("blockchain")) {
    const loadedData = JSON.parse(localStorage.getItem("blockchain"));
    VotingBlockchain = new Blockchain();
    VotingBlockchain.chain = loadedData;
  } else {
    VotingBlockchain = new Blockchain();
  }