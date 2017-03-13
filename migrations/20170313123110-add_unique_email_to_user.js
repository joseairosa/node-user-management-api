'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.addIndex(
            'Users', ['email'], {
                indicesType: 'UNIQUE'
            }
        )
    },

    down: function(queryInterface, Sequelize) {}
};
