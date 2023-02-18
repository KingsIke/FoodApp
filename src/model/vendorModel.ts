import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { FoodInstance } from "./foodModel";

export interface VendorAttribute {
    id: string;
    name: string;
    restrantName: string;
    pincode: string;
    phone: string;
    address: string;
    email: string;
    password: string
    salt: string;
    serviceAvaliable: boolean;
    rating: number;
    role: string;
    coverImage: string
}

export class VendorInstance extends Model<VendorAttribute>{ }

VendorInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email address"
            },
            isEmail: {
                msg: "Please input a Valid mail"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Password is Required"
            }, notEmpty: {
                msg: "Provide a Password"
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    restrantName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Phone number is requires"
            },
            notEmpty: {
                msg: "Provide a Phone number"
            }
        }
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true

    },
    serviceAvaliable: {
        type: DataTypes.BOOLEAN,
        allowNull: true

    },
    rating: {
        type: DataTypes.STRING,
        allowNull: true

    },

    role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: true
    },


},
    {
        sequelize: db,
        tableName: 'vendor'
    });

// connecting the food model with the vendor mood 
VendorInstance.hasMany(FoodInstance, { foreignKey: "vendorId", as: "food" });

FoodInstance.belongsTo(VendorInstance, { foreignKey: "vendorId", as: "vendor" })