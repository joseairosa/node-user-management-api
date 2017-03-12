'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.addColumn(
            'Users',
            'password_digest',
            Sequelize.STRING
        )
    },

    down: function(queryInterface, Sequelize) {

    }
};
