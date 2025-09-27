import { Model, DataTypes, Sequelize } from 'sequelize';
import { USER_TABLE } from './user.model';

const ATTESTATION_TABLE = 'attestations';

interface AttestationAttributes {
    uuid: string
    id: string
    index: number
    location: string
    data?: string
    userAddress: string
}

const AttestationSchema = {
    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    id: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    index: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    location: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    data: {
        type: DataTypes.STRING,
    },
    userAddress: {
        field: 'user_address',
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: USER_TABLE,
            key: 'address'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
};

class Attestation extends Model<AttestationAttributes> {

    public uuid!: string
    public id!: string
    public index!: number
    public location!: string
    public userAddress!: string
    public data!: string 

    static associate(models: any) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userAddress',
        });
    }

    static config(sequelize: Sequelize) {
        return {
            sequelize,
            tableName: ATTESTATION_TABLE,
            modelName: 'Attestation',
            timestamps: false,
        };
    }
}

export { Attestation, AttestationAttributes, AttestationSchema, ATTESTATION_TABLE };
