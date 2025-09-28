import axios from 'axios'
import { config } from '../config/config'

export default class IPFSService {
  public async uploadIPFs(jsonData: any) {
    try {
      const endpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
      const pinataApiKey = config.nft.pinataApiKey
      const pinataSecretApiKey = config.nft.pinataSecretApiKey
      const requestBody = {
        pinataMetadata: {
          name: `metadata-${+new Date()}.json`,
          keyvalues: {
            contract: 'OWL Game',
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
        pinataContent: jsonData,
      }
      const headers = {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      }
      if(!pinataApiKey || !pinataSecretApiKey) {
        throw new Error('API keys not provided')
      }
      console.log('requestBody', requestBody)
      console.log('headers', headers)
      const response = await axios.post(endpoint, requestBody, {
        headers: headers,
      });
      const cid = response.data.IpfsHash;
      return cid;
    } catch (error) {
      console.log('Error on uploadIPFs:', error)
      throw error
    }
  }
}
