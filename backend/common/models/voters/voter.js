// voter.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../db'); 

const VoterModel = sequelize.define('Voter', {
    first_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    last_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    street_no: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    street_name: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    residence_city: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    residence_zip: { 
        type: DataTypes.STRING, // Consistent type
        allowNull: false 
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isBefore: new Date().toISOString().slice(0, 10),
        }
    },
    party: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'voters', 
    timestamps: false
});

module.exports = VoterModel;
