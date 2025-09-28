import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers'
import { config } from '../config/config';

const easContractAddress = config.nft.easContractAddress
const schemaUID = config.nft.schemaUID
const rpc = config.nft.rpcUrl
const pk = config.nft.pk
const schemaEncoder = new SchemaEncoder(
  'string status,bytes data'
)

export type AttestationData = {
  status: string
  address: string
  data?: string
}
export default class AttestationService {
  public async attestMilestone({status, address, data = '0x'}: AttestationData) {
    if (!easContractAddress || !rpc || !pk || !schemaUID) {
      throw new Error('Some of the required data is not provided')
    }
    try {
      const provider = new ethers.JsonRpcProvider(rpc)
      const signer = new ethers.Wallet(pk, provider)
      const eas = new EAS(easContractAddress)
      eas.connect(signer)
      const encodedData = schemaEncoder.encodeData([
        { name: 'status', value: status, type: 'string' },
        { name: 'data', value: data, type: 'bytes' },
      ])
      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: address,
          expirationTime: BigInt(0),
          revocable: false,
          data: encodedData,
        },
      });
      const newAttestationUID = await tx.wait();
      const attestData = await this.decodeAttestationData(newAttestationUID);
      return { attestData, newAttestationUID, address };
    } catch (error) {
      console.log('Error on attestData:', error)
      throw error
    }
  }
  public async decodeAttestationData(attestationUID: string) {
    try {
      if (!easContractAddress || !rpc || !pk) {
        throw new Error('Some of the required data is not provided')
      }
      const eas = new EAS(easContractAddress)
      const provider = new ethers.JsonRpcProvider(rpc)
      const signer = new ethers.Wallet(pk, provider)
      eas.connect(signer)

      const attestation = await eas.getAttestation(attestationUID);
      const decodedData = schemaEncoder.decodeData(attestation.data);
      const dataFormatted = decodedData.map((data) => {
        return {
          name: data.name,
          value: data.value.value.toString(),
        };
      });
      return dataFormatted;
    } catch (error) {
      console.log('Error on decodeAttestationData:', error)
      throw error
    }
  }
}
