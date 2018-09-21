Utils.CoreApp.gameApp.directive("floatVote", [function () {
    return {
        restrict: "E",
        templateUrl: "float-vote.tmpl",
        replace: true,
        scope: {},
        controller: ["$scope", "$rootScope", "confederationService", "$element", "profileService", function ($scope, $rootScope, $cs, $element, profileService) {
            var $self = this;

            this.model = $cs.getElectionData();
            this.title = "Voting";

            $element.css(this.model.$params.position);


            //setInterval(function () {
            //    $self.params.voiceSendedInWeek = !$self.params.voiceSendedInWeek;
            //},10000);


            var delayAnimation = 400;
            var lockShowing = false;
            this.toggleShow = function () {
                if (lockShowing) return;
                lockShowing = true;
                $self.model.$params.show = !$self.model.$params.show;
                $cs.$saveToLsVoteParams($self.model.$params);
                setTimeout(function () {
                    lockShowing = false;
                }, delayAnimation);

            };

            function _createFakeCandidates() {
                $self.candidates = [{
                    UserName: "Arun",
                    UserId: 1000,
                    Voices: 123,
                    TotalVoices: 10000,
                    Id: 0
                }];
                for (var i = 0; i < 9; i++) {
                    $self.candidates.push({
                        UserName: "name " + i,
                        UserId: i,
                        Voices: i * 1000,
                        TotalVoices: 10000,
                        Id: 0
                    });
                }
            }
            //  _createFakeCandidates();
            this.getUserInfo = function (candidat) {
                if (candidat && candidat.UserId) {
                    profileService.setProfile(candidat.UserId);
                }

            };

            this.lockedAddVoice = false;

            this.addVoice = function ($event, candidat) {
                if ($self.lockedAddVoice) return;
                $self.lockedAddVoice = true;
                $cs.addVoiceToOfficer($event, candidat, $self.model.$params, function () {
                    $self.lockedAddVoice = false;
                }, function () {
                    $self.lockedAddVoice = false;
                }, $rootScope);

            };

            $element.draggable({
                containment: "#estateCanvas",
                scroll: false,
                cancel: "#float-vote-content",
                stop: function (event, $params) {
                    console.log("draggable.stop", {
                        event: event, $params: $params
                    });
                    $self.model.$params.position = $params.position;
                    $cs.$saveToLsVoteParams($self.model.$params);
                }
            });


            $scope.$on("election:finished", function () {
                $scope.$destroy();
                $element.remove();
                console.log("floatVote.election:finished");
            });

            $scope.$on("election:update-candidates", function ($event, data) {
                if (data.updateVotes) {
                    if (_.isEqual($self.model.Candidates, data.Candidates)) {
                        //todo  всегда одинаковые при регистрации - оповещении пользователя(проверенно)
                        //todo  всегда олинаковые при полном обновлении кандидатов пользователя(не проверенно)
                        console.log("isEqual.floatVote.election:update-candidates", {
                            $event: $event,
                            data: data,
                        });
                    }
                    else {
                        $self.model.Candidates = data.Candidates;
                    }

                }
                console.log("floatVote.election:update-candidates", {
                    $event: $event,
                    data: data,
                });
            });
            $scope.$on("election:cr-user-voice-added", function ($event, data) {
                if (_.isEqual(data.params, $self.model.$params)) {
                    console.log("isEqual.floatVote.election:election:cr-user-voice-added", {
                        $event: $event,
                        data: data,
                        $self: $self,
                    });
                }
                else {
                    $self.model.$params = data.params;

                }
                console.log("floatVote.election:election:voice-added", {
                    $event: $event,
                    data: data,
                });
            });



        }],
        controllerAs: "voteCtrl"
    }
}
]);