import { Model, DataTypes, Sequelize } from 'sequelize';

const USER_TABLE = 'users';

interface UserAttributes {
    address: string;
    status: string;
    tokenId?: number;
    hash?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = {
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    status: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    tokenId: {
        field: 'token_id',
        allowNull: true,
        type: DataTypes.INTEGER,
    },
    hash: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
    },
};

class User extends Model<UserAttributes> {

    public address!: string;
    public status!: string;
    public tokenId!: number;
    public hash!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    static associate(models: any) {
        this.hasMany(models.Attestation, {
            foreignKey: 'userAddress',
            as: 'attestations',
        });
    }

    static config(sequelize: Sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: true,
        };
    }
}

export { USER_TABLE, UserSchema, User, UserAttributes };
