"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
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
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lastName: {
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
    otp: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP is requires"
            },
            notEmpty: {
                msg: "Provide an OTP"
            }
        }
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP Expired"
            }
        }
    },
    lng: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    lat: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User must be verified"
            },
            notEmpty: {
                msg: "User not Verified"
            }
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    // superAdmin: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
}, {
    sequelize: config_1.db,
    tableName: 'user'
});
