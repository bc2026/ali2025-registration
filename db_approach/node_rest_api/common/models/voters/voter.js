// voter.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../db'); 

const VoterModel = sequelize.define('Voter', {
    FirstName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    LastName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    StreetNo: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    StreetName: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    ResidenceCity: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    Zipcode: { 
        type: DataTypes.STRING, // Consistent type
        allowNull: false 
    },
    DOB: {
        type: DataTypes.DATE,
        allowNull: false 
    }
}, {
    tableName: 'voters', 
    timestamps: false
});

module.exports = VoterModel;
