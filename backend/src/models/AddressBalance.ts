import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class AddressBalance extends Model {
    public address!: string;
    public network!: string;
    public balance!: string;
    public lastUpdatedBlock!: number;
}

AddressBalance.init(
    {
        address: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        network: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.DECIMAL(36, 18),
            defaultValue: '0',
        },
        lastUpdatedBlock: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'address_balances',
    }
);

export default AddressBalance;
