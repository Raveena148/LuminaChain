import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Transaction extends Model {
    declare id: number;
    declare network: string;
    declare txHash: string;
    declare blockNumber: number;
    declare fromAddress: string;
    declare toAddress: string;
    declare value: string; // Store as string for big numbers
    declare fee: string;
    declare timestamp: Date;
    declare rawMetadata: object;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        network: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        txHash: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        blockNumber: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        fromAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        toAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        value: {
            type: DataTypes.DECIMAL(36, 18),
            allowNull: false,
        },
        fee: {
            type: DataTypes.DECIMAL(36, 18),
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rawMetadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'transactions',
        indexes: [
            { fields: ['txHash'] },
            { fields: ['network', 'blockNumber'] },
            { fields: ['fromAddress'] },
            { fields: ['toAddress'] },
        ],
    }
);

export default Transaction;
