'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.addColumn(
            'Sessions',
            'uuid',
            Sequelize.STRING
        )
    },

    down: function(queryInterface, Sequelize) {
    }
};
