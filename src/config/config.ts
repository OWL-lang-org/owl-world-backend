import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbName: string;
  dbPort: number;
  nft: {
    contractAddress: string;
    rpcUrl: string;
    pk: string;
    attestationUrl: string;
    openSeaUrl: string;
    blockScout: string;
    pinataApiKey: string;
    pinataSecretApiKey: string;
    easContractAddress: string;
    schemaUID: string;
  };
}

const config: Config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,

    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbHost: process.env.DB_HOST || '',
    dbName: process.env.DB_NAME || '',
    dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    nft: {
      contractAddress: process.env.NFT_CONTRACT_ADDRESS || '',
      rpcUrl: process.env.RPC_URL || '',
      pk: process.env.PK || '',
      attestationUrl: process.env.ATTESTATION_URL || '',
      openSeaUrl: process.env.OPENSEA_URL || '',
      blockScout: process.env.BLOCKSCOUT_URL || '',
      pinataApiKey: process.env.PINATA_API_KEY || '',
      pinataSecretApiKey: process.env.PINATA_SECRET_KEY || '',
      easContractAddress: process.env.EAS_CONTRACT_ADDRESS || '',
      schemaUID: process.env.SCHEMA_UID || '',
    },
}

export { config };

