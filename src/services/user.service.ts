import boom from '@hapi/boom';
import sequelize from '../libs/sequelize';

export default class UserService {

    constructor() {}

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
        };
        const newUser = await sequelize.models.User.create(user);
        return newUser;
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

    public async createAttestation(address: string, attestationData: any) {
        const user = await this.getUserByAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }
        const attestation = {
            ...attestationData,
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
}