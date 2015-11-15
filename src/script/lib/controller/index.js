var settings = require('../settings');
var moment = require('moment');

function isActiveUser(user) {

    if(user.lastTransaction === null) {
        return false;
    }

    return (moment().diff(moment(user.lastTransaction)) < settings.inactiveUserPeriod);
}

module.exports.install = function(app) {

    app.controller('IndexController', function ($scope, locationService, userService) {

        $scope.userClick = function(user_id, user_pin) {
            if(user_pin){
                var confirm = window.prompt("bitte gib deinen pin an", "");
                if(confirm===user_pin){
                    locationService.gotoUser(user_id);
                }
            }else {
                locationService.gotoUser(user_id);
            }
        };

        $scope.createUserClick = function() {
            locationService.gotoCreateUser();
        };

        userService.getUsers()
            .success(function(users) {
                $scope.users = users.entries;
            })
            .error(function(body, httpCode) {
                return messageService.httpError(body, httpCode);
            });

        $scope.isActiveUser = isActiveUser;
        $scope.isInactiveUser = function(user) {
            return !isActiveUser(user);
        };
    });
};