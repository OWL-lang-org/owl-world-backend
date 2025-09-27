import boom from '@hapi/boom';
import sequelize from '../libs/sequelize';

export default class LocationService {
    constructor() {}

    public async getLocationById(id: number) {
        const locationRecord = await sequelize.models.Location.findByPk(id, {
            include: [
                {
                    model: sequelize.models.Message,
                    as: 'messages',
                }
            ]
        });

        if (!locationRecord) {
            throw boom.notFound('Location not found');
        }
    
        return locationRecord;
    }

    public async getUserByName(name: string) {
        const locationRecord = await sequelize.models.Location.findOne({
            where: { locationName: name },
            include: [
                {
                    model: sequelize.models.Message,
                    as: 'messages',
                }
            ]
        });

        if (!locationRecord) {
            throw boom.notFound('Location not found');
        }
        
        return locationRecord;
    }
}