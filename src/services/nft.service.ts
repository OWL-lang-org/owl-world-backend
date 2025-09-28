import { ethers } from 'ethers'
import { OWL__factory } from '../contracts/typechain-types'
import IPFSService from './ipfs.service'
import { ProvideBase } from '../utils/ipfs/IpfsBase'
import axios from 'axios'
import { config } from '../config/config'

type Props = {
  to: string
  index: number
  status: string
  data: string
}
export type NftMintResponse = {
  txHash: string | undefined | null
  tokenId: string
}

const ipfsService = new IPFSService()

export default class NFTService {
  public async mintNFT({ to, index, status, data }: Props) {
    try {
      const rpc = config.nft.rpcUrl
      const pk = config.nft.pk
      const contractAddress = config.nft.contractAddress

      if (!rpc || !pk || !contractAddress) {
        throw new Error('RPC or PK not provided')
      }
      const ipfsBody = ProvideBase(
        status,
        to,
        data,
        index
      )
      const cid = await ipfsService.uploadIPFs(ipfsBody)
      const provider = new ethers.JsonRpcProvider(rpc)
      const signer = new ethers.Wallet(pk, provider)
      const nftContract = OWL__factory.connect(contractAddress, signer)
      const tx = await nftContract.safeMint(to, cid)
      const txProcessReceipt = await tx.wait()
      const txHash = txProcessReceipt?.hash
      const eventProcessLogs = txProcessReceipt?.logs.filter((log) => {
        try {
          const parsedLog = nftContract.interface.parseLog(log)
          return parsedLog?.name === 'MetadataUpdate'
        } catch (error) {
          return false
        }
      })
      if (eventProcessLogs && eventProcessLogs.length > 0) {
        const response : NftMintResponse = {
          txHash: txHash,
          tokenId: BigInt(eventProcessLogs[0].data).toString()
        }
        return response
      } else {
        return null
      }
    } catch (error) {
      console.log('Error on mintNFT:', error)
      return null
    }
  }
  public async updateNFTMetadata(
    address: string,
    index: number,
    status: string,
    tokenId: string,
    newAtribute?: {trait_type: string, value: string}
  ) {
    try {
      const rpc = config.nft.rpcUrl
      const pk = config.nft.pk
      const contractAddress = config.nft.contractAddress

      if (!rpc || !pk || !contractAddress) {
        throw new Error('RPC or PK not provided')
      }
      const ipfsBase = ProvideBase(
        status,
        address,
        '0x',
        index
      )
      const provider = new ethers.JsonRpcProvider(rpc)
      const signer = new ethers.Wallet(pk, provider)
      const nftContract = OWL__factory.connect(contractAddress, signer)
      
      const currentUri = await nftContract.tokenURI(tokenId)
      const correctUri = currentUri.split('/').pop()
      console.log('correctUri', correctUri)
      const metadata = await axios.get(`https://tomato-elaborate-mite-206.mypinata.cloud/ipfs/${correctUri}`)
      let currentMetadata = []
      if(metadata.data.length > 7){
        currentMetadata = metadata.data.slice(0, 7)
        ipfsBase.attributes = ipfsBase.attributes.concat(currentMetadata)
      }
      if(newAtribute){
        ipfsBase.attributes.push(newAtribute)
      }
      console.log('ipfsBase', ipfsBase)
      console.log('json', JSON.stringify(ipfsBase))
      const cid = await ipfsService.uploadIPFs(ipfsBase)
      const tx = await nftContract.updateTokenURI(tokenId, cid)
      const txProcessReceipt = await tx.wait()
      const txHash = txProcessReceipt?.hash
      const eventProcessLogs = txProcessReceipt?.logs.filter((log) => {
        try {
          const parsedLog = nftContract.interface.parseLog(log)
          return parsedLog?.name === 'MetadataUpdate'
        } catch (error) {
          return false
        }
      })
      if (eventProcessLogs && eventProcessLogs.length > 0) {
        const response : NftMintResponse = {
          txHash: txHash,
          tokenId: BigInt(eventProcessLogs[0].data).toString()
        }
        return response
      } else {
        return null
      }
    } catch (error) {
      console.log('Error on updateNFTMetadata:', error)
      return false
    }
  }
}
