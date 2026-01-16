import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Watchlist extends Model {
    public id!: number;
    public address!: string;
    public tag!: string;
    public note!: string;
}

Watchlist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'watchlist',
    }
);

export default Watchlist;
