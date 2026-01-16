import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Block extends Model {
}
Block.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    network: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    blockNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    blockHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    txCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    size: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'blocks',
    indexes: [
        {
            unique: true,
            fields: ['network', 'blockNumber'],
        },
        {
            fields: ['network', 'blockHash'],
        },
    ],
});
export default Block;
