const express = require('express');
const { DataTypes } = require('sequelize')

module.exports = {
	initialize: (sequelize) => {
	  this.model = sequelize.define("voter", VoterModel);
	},
  
	findVoter: (voter) => {
	  return this.model.read(voter);
	}
  };

const VoterModel = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	  },

	  fname:
	  {
		type: DataTypes.STRING,
		allowNull: false
	  },

	  lname:
	  {
		type: DataTypes.STRING,
		allowNull: false
	  },

	  address:
	  {
		type: DataTypes.STRING,
		allowNull: false
	  },
	  city:
	  {
		type: DataTypes.STRING,
		allowNull: false
	  },
	  state:
	  {
		type: DataTypes.STRING,
		allowNull: false
	  },
	  zipcode:
	  {
		type: DataTypes.STRING,
		allowNull: false
	  },

	  is_reg:
	  {
		type: DataTypes.BOOL,
		allowNull: false
	  }
}