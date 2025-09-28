import boom from '@hapi/boom';
import sequelize from '../libs/sequelize';
import NftService, { NftMintResponse } from './nft.service';
import AttestationService from './attestation.service';
import { config } from '../config/config';
import { createPrompt } from '../utils/openai/promptCreator';
import { OpenAI } from 'openai';

export default class UserService {

    private nftService: NftService;
    private attestationService: AttestationService;

    constructor() {
        this.nftService = new NftService();
        this.attestationService = new AttestationService();
    }

    public async getUserByAddress(address: string) {
        const userRecord = await sequelize.models.User.findByPk(address.toLowerCase(), {
            include: [
                {
                    model: sequelize.models.Attestation,
                    as: 'attestations',
                }
            ]
        });
        if (!userRecord) {
            throw boom.notFound('User not found');
        }
    
        return userRecord;
    }

    public async createUser(address: string) {
        const previousUser = await sequelize.models.User.findByPk(address.toLowerCase());
        if (previousUser) {
            throw boom.conflict('User already exists');
        }
        const user = {
            address: address.toLowerCase(),
            tokenId: '',
            hash: '',
        };
        const nft = await this.nftService.mintNFT({
            to: address.toLowerCase(),
            status: '',
            index: 0,
            data: '0x',
        });
        if (!nft) {
            throw boom.internal('Failed to mint NFT');
        }
        user.tokenId = nft.tokenId;
        user.hash = nft.txHash || '';
        const nftResponse = {
            ...nft,
            url: `${config.nft.blockScout}${nft.tokenId}`,
        }
        const newUser = await sequelize.models.User.create(user);
        return {newUser, nft: nftResponse};
    }

    public async updateNft(address: string, status: string) {
        const user = await this.getUserByAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }

        const updatedUser = await user.update({ status });
        const attestation = await this.createAttestation(address, status);

        const nft = await this.nftService.updateNFTMetadata(
            address,
            11,
            status,
            user.dataValues.tokenId,
            {
                trait_type: 'Attestation In Game',
                value: `${attestation.dataValues.uuid}`,
            }
        );

        if (!nft) {
            throw boom.internal('Failed to update NFT');
        }

        const nftResponse = {
            ...nft,
            url: `${config.nft.blockScout}${nft.tokenId}`,
        }

        return {
            user: updatedUser,
            attestation,
            nft: nftResponse,
        };
    }

    public async updateUserStatus(address: string, status: string) {
        const user = await this.getUserByAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }
        return await user.update({ status });
    }

    public async deleteUser(address: string) {
        const userRecord = await this.getUserByAddress(address);
        if (!userRecord) {
            return null;
        }
        return await userRecord.destroy();
    }

    public async createAttestation(address: string, status: string) {
        const user = await this.getUserByAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }

        const newAttestation = await this.attestationService.attestMilestone({
            status,
            address: user.dataValues.address.toLowerCase(),
            data: '0x',
        });

        const attestation = {
            uuid: newAttestation.newAttestationUID,
            status: status,
            data: newAttestation.attestData.find((data) => data.name === 'data')?.value || '0x',
            userAddress: user.dataValues.address.toLowerCase(),
        };
        return await sequelize.models.Attestation.create(attestation);
    }

    public async getAllUserAttestations(address: string) {
        const user = await this.getUserByAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }
        
        const attestations = await sequelize.models.Attestation.findAndCountAll({
            where: { 
                userAddress: user.dataValues.address.toLowerCase(),
            },
        });

        return attestations;
    }

    public async interactWithGrammarCoach(address: string, userPrompt: string) {
        const user = await this.getUserByAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }

        const prompt = createPrompt(userPrompt);

        const openai = new OpenAI();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: 'system',
                    content: prompt.system,
                },
                {
                    role: "user",
                    content: prompt.user,
                }
            ],
        });

        return JSON.parse(completion.choices[0].message.content || '{}');
    }
}