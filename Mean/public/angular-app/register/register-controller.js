angular.module('meanhotel').controller('RegisterController', RegisterController);

function RegisterController() {
    var vm = this;
    
    vm.register = function() {
        var user = {
            username: vm.username,
            password: vm.password
        };
        
        if(!vm.username || !vm.password) {
            vm.error = 'Please enter a username and a password.';
        } else {
            if (vm.passord !== vm.passwordRepeat) {
                vm.error = 'Please be sure the passwords match.';
            } else {
                $https.post('/api/users/register', user).then(function(result) {
                    console.log(result);
                    vm.message = 'Successful registration, please login.';
                    vm.error = '';
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }
    }
};