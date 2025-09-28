// register-schema.ts
import { config } from '../../config/config';
import { ethers } from 'ethers';
import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';

const SCHEMA_REGISTRY = '0x4200000000000000000000000000000000000020'; // Worldchain Sepolia
const schema = 'string status,bytes data';        // cambia por tu layout
const resolverAddress = ethers.ZeroAddress;        // o tu resolver
const revocable = true;

async function main() {
  const provider = new ethers.JsonRpcProvider(config.nft.rpcUrl);
  const wallet = new ethers.Wallet(config.nft.pk, provider);

  const registry = new SchemaRegistry(SCHEMA_REGISTRY);
  await registry.connect(wallet);

  const tx = await registry.register({ schema, resolverAddress, revocable });
  console.log('Tx:', tx);
  const schemaUID = await tx.wait();
  console.log('Schema UID:', schemaUID); // UID del schema en *Worldchain Sepolia*
}

main().catch(console.error);