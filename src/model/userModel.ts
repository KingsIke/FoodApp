import { DataTypes, Model } from "sequelize";
import { db } from "../config";


export interface UserAttribute {
    [x: string]: any;
    id: string;
    email: string;
    password: string
    firstName: string;
    lastName: string;
    salt: string;
    address: string;
    phone: string;
    otp: number;
    otp_expiry: Date;
    lng: number;
    lat: number;
    verified: boolean
}

export class UserInstance extends Model<UserAttribute>{ }

UserInstance.init({
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
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
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
    otp: {
        type: DataTypes.NUMBER,
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
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP Expired"
            }
        }
    },
    lng: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    lat: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User must be verified"
            },
            notEmpty: {
                msg: "User not Verified"
            }
        }
    }

},
    {
        sequelize: db,
        tableName: 'user'
    });