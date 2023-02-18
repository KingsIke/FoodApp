"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const foodModel_1 = require("./foodModel");
class VendorInstance extends sequelize_1.Model {
}
exports.VendorInstance = VendorInstance;
VendorInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    restrantName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    serviceAvaliable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    rating: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    coverImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: config_1.db,
    tableName: 'vendor'
});
// connecting the food model with the vendor mood 
VendorInstance.hasMany(foodModel_1.FoodInstance, { foreignKey: "vendorId", as: "food" });
foodModel_1.FoodInstance.belongsTo(VendorInstance, { foreignKey: "vendorId", as: "vendor" });
