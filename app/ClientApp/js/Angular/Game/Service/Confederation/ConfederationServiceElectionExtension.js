Utils.CoreApp.gameAppExtensions.ConfederationElection = function (service) {
    var $lsFvKey = Utils.RepoKeys.LsKeys.FloatVoteParams;
    var $lsRegKey = Utils.RepoKeys.LsKeys.VoteRegistredData;
    var $ls = Utils.LocalStorage;           
    function _addVoteView(onDone) { 
        setTimeout(function () {
            var container = $("#skagry-container");
            if (!container || !container.length) {    
                _addVoteView(onDone);
                return;
            }
            else {
                var existContainer = $("#float-vote-container");
                if (!existContainer || !existContainer.length) {
                    service.$compileHelper.$appendHtml(container, "<float-vote/>");
                    if (onDone) {
                        onDone();
                    }
                }

            }
      
            
        });

    };

    function _getFromLsVoteParams() {
        return $ls.GetFromStorage($lsFvKey, true);
    }


    function _getDefaultVoteParams() {
        return {
            position: { top: 185, left: 105 },    // for floate vote
            show: true, // in vote float state opened or not    
            voiceSendedInWeek: false,
            startDay: 5,
            endDay: 7,
            startEndHour: 20
        };
    };


    service.updateCandidates = function (candidatesOutList, updateVotes, $$RootScope) {
        if(_.isEqual(service.Election.Candidates, candidatesOutList)) {
            console.log("service.updateCandidates.isEqual", {
                candidatesOutList:candidatesOutList,
                updateVotes:updateVotes,
                service:service
            });
            return;
        }  
        if (updateVotes &&  service.Election.Candidates &&  candidatesOutList.length === service.Election.Candidates.length) {
            var current = _.map(service.Election.Candidates, function (o) {
                return o.Id;
            });
            var target = _.map(candidatesOutList, function (o) {
                return o.Id;
            });
            if (_.isEqual(current, target)) {
                Utils.UpdateObjData(service.Election.Candidates, candidatesOutList);
            }
            else {
                service.Election.Candidates = candidatesOutList;
            }

        }
        else {
            service.Election.Candidates = candidatesOutList;       
        }
        $$RootScope.$broadcast("election:update-candidates", { Candidates: service.Election.Candidates, updateVotes: updateVotes });

        //console.log("service.updateCandidates", {
        //    candidatesOutList: candidatesOutList,
        //    updateVotes: updateVotes,
        //    $$RootScope: $$RootScope,
        //});
    };

    var _lockCheckAndRunOrDestroyVoteView = false;
    service.$checkAndRunOrDestroyVoteView = function (election) {
        if (_lockCheckAndRunOrDestroyVoteView) {
            return;
        }
        _lockCheckAndRunOrDestroyVoteView = true;

        function _unlock()
        {
            _lockCheckAndRunOrDestroyVoteView = false;
        }
        var isRegisterPeriod =election.IsRegisterPeriod;
        var existContainer = $("#float-vote-container");
        if (!isRegisterPeriod) {
            if (existContainer && existContainer.length) {
                _unlock();
                return;
            }
            var candidates = election.Candidates;
            if (!candidates || !candidates.length) {
                //console.log("$checkAndRunOrDestroyVoteView: !isRegisterPeriod !candidates || !candidates.length");
                var dom = $("#float-vote-container");
                if (dom && dom.length) {
                    dom.remove(); 
                }
                _unlock();
               return;
            }
            var gameScope = $("#Game").scope();
            if (gameScope.gameCtrl.skagryLoaded) {
                console.log("$checkAndRunOrDestroyVoteView: if gameScope.gameCtrl.skagryLoaded");
                _addVoteView(_unlock);
            }
            else {
                //console.log("$checkAndRunOrDestroyVoteView: else : skagry not loaded");
                var clearWatch = gameScope.$watch("gameCtrl.skagryLoaded", function (newVal, oldVal) {
                    console.log("$checkAndRunOrDestroyVoteView: clearWatch");
                    if (newVal) {
                       // console.log("$checkAndRunOrDestroyVoteView: clearWatch newVal");
                        _lockCheckAndRunOrDestroyVoteView = true;
                        _addVoteView(function() {
                            _unlock();
                            clearWatch();
                        });  
              
                    } else {
                        _unlock();
                    }
                });

            }
        }
        else {
            //console.log("$checkAndRunOrDestroyVoteView: else :  isRegisterPeriod");
            if (existContainer && existContainer.length) {
                existContainer.remove();
            }
            _unlock();

        }
    }
    service.$saveToLsVoteParams = function (voteParams) {
        $ls.SaveInStorage($lsFvKey, voteParams, true);
    };

    service.$isVotePeriod = function (election) {
        var cutrTime = Utils.Time.GetUtcNow();
        return cutrTime >= election.StartVoteTime && cutrTime <= election.EndVoteTime;
    };
    service.$checkAndUpdateHasVoice = function (voteParams) {
        if (!voteParams.voiceSendedInWeek) return;
        var cutrTimeMs = Utils.Time.GetUtcNow(true);
        var curTimeDt = Utils.Time.GetUtcDateTimeFromMsUtc(cutrTimeMs);
        var curDay = curTimeDt.getDay();
        var currFixedDay = curDay === 0 ? 7 : curDay;

        if (currFixedDay < voteParams.startDay) {
            voteParams.voiceSendedInWeek = false;
            service.$saveToLsVoteParams(voteParams);
            return;
        }

        var currHour = curTimeDt.getHours();
        if (voteParams.startDay === curDay && currHour < voteParams.startEndHour || voteParams.endDay === curDay && currHour >= voteParams.startEndHour) {
            voteParams.voiceSendedInWeek = false;
            service.$saveToLsVoteParams(voteParams);
            return;
        }
    };

    var _addVoteInProgress = false;
    service.addVoiceToOfficer = function ($event, candidat, voteParams, onDone, onError, $rootScope) {
        //console.log("ConfederationElection.addVoiceToOfficer", {
        //    $event: $event,
        //    candidat: candidat,
        //    voteParams: voteParams,
        //    onDone: onDone,
        //    onError: onError,
        //    $rootScope: $rootScope,
        //});

        if (_addVoteInProgress) {
            onError(ErrorMsg.Locked);
          //  console.log("addVoiceToOfficer:addVoteInProgress");
            return;
        }
        if (!candidat || !voteParams || !candidat.UserId) {
            onError(ErrorMsg.InputDataIncorrect);
          //  console.log("addVoiceToOfficer:!candidat || !voteParams || !candidat.UserId");
            return;
        }
        if (voteParams.voiceSendedInWeek) {
            service.$cdH.openDialogUserHasAlreadyCastVote($event);
            //todo open dialog you already hasVote  
            onError(ErrorMsg.UserHasAlreadyCastVote);
            return;
        }
        _addVoteInProgress = true;

        service.$cdH.openDialogConfirmSendVote($event, candidat.UserName).then(function () {
            service.$hub.confederationAddVote(candidat.UserId).then(function (answerOk) {
                voteParams.voiceSendedInWeek = true;
                service.$saveToLsVoteParams(voteParams);
                _addVoteInProgress = false;
                onDone();
                $rootScope.$broadcast("election:cr-user-voice-added", {
                    params: voteParams
                });
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    msg: msg,
                    candidat: candidat,
                    voteParams: voteParams,
                    errorAnswer: errorAnswer,
                    onDone: onDone,
                    onError: onError
                };

                if (msg === ErrorMsg.UserHasAlreadyCastVote) {
                    service.$cdH.openDialogUserHasAlreadyCastVote($event);
                    voteParams.voiceSendedInWeek = true;
                    service.$saveToLsVoteParams(voteParams);

                } else if (msg === ErrorMsg.TimeVotingIsOver) {
                    service.$cdH.openDialogTimeVotingIsOver($event);
                    voteParams.voiceSendedInWeek = false;
                    // voteParams.show = false;
                    service.$saveToLsVoteParams(voteParams);

                    //$rootScope.$broadcast("election:finished", {
                    //    Officers: service.Officers.Officers,
                    //    election: service.Election
                    //});

                }

                if (onError instanceof Function) {
                    onError(msg);
                }
                _addVoteInProgress = false;

                throw Errors.ClientNotImplementedException(errorData, "addVoiceToOfficer.ratingGetNextPage");
            });
        }, function () {
            onError("cancel");
        });

    };


    var _registrateOfficerInProgress = false;
    service.$registrateOfficer = function (params, $element, $attrs, $scope, $event) {
        if (_registrateOfficerInProgress) return;
        _registrateOfficerInProgress = true;
        var election = service.getElectionData();
        var userInfo = service.$currentUserInfo;
        if (!election.IsRegisterPeriod) {
            service.$cdH.openDialogTimeRegistrationIsOver($event).finally(function () {
                election.RegistrBtn = null;
                $element.remove();
                _registrateOfficerInProgress = false;
            });

        }
        else {
            var $rs = GameServices.resourceService;
            var ccPrice = election.RegistrCcPrice;
            var isEnoughCc = $rs.isEnoughCc(ccPrice);
            if (!isEnoughCc) {
                service.$cdH.openDialogRegistrationNotEnoughCc($event, ccPrice, $rs.getCcCount()).finally(function () {
                    _registrateOfficerInProgress = false;
                });
            }
            else {
                service.$hub.confederationRegistrateCandidate().then(function (answer) {
                    $rs.setCc(answer);
                    _registrateOfficerInProgress = false;

                }, function (errorAnswer) {

                    var msg = Errors.GetHubMessage(errorAnswer);

                    if (msg === ErrorMsg.NotEnoughCc) {
                        var newCc = $rs.setBalanceFromErrorAnswerNotEnoughCc(errorAnswer);
                        service.$cdH.openDialogRegistrationNotEnoughCc($event, ccPrice, newCc).finally(function () {
                            _registrateOfficerInProgress = false;
                        });
                    }

                    _registrateOfficerInProgress = false;
                    var errorData = {
                        msg: msg,
                        errorAnswer: errorAnswer,
                    }
                    console.log("$registrateOfficer.errorAnswer", errorData);
                    throw errorData;
                });


            }
        }


        //console.log("ConfederationElection.$registrateOfficer", {
        //    params: params,
        //    $element: $element,
        //    $attrs: $attrs,
        //    $scope: $scope,
        //    $event: $event,
        //});
    };
    service.$saveRegistredToLsByElection = function (election, registred) {
        $ls.SaveInStorage($lsRegKey, {
            Registred: registred,
            StartVoteTime: election.StartVoteTime,
            StartRegistrationTime: election.StartRegistrationTime,
            EndVoteTime: election.EndVoteTime
        }, true);
    };
    service.getElectionData = function () {
        var election = service.Election;
        var $isRegistredPeriod = !service.$isVotePeriod(election);
        if (election.IsRegisterPeriod !== $isRegistredPeriod) {
            election.IsRegisterPeriod = $isRegistredPeriod;
        }
        var curTime = Utils.Time.GetUtcNow();
        var lsData = $ls.GetFromStorage($lsRegKey, true);
        if (election.IsRegisterPeriod) {
            //data
            if (!election.Registred) {
                if (!lsData || curTime > lsData.StartVoteTime) {
                    service.$saveRegistredToLsByElection(election, false);
                }
                else if (lsData.Registred) {
                    if (Math.abs(lsData.StartVoteTime - election.StartVoteTime) < 10) {
                        election.Registred = lsData.Registred;
                    } else {
                        service.$saveRegistredToLsByElection(election, false);
                    }


                }

            }
            else if (election.Registred && (!lsData || !lsData.Registred)) {
                service.$saveRegistredToLsByElection(election, true);
            }

            //btn
            if (election.Registred && election.RegistrBtn) {
                election.RegistrBtn = null;
            }
            else if (!election.Registred && !election.RegistrBtn) {
                election.RegistrBtn = service.$btnHelper.ButtonsView()
                    .ConstructorSizeBtn(1, true, "Registrate (" + election.RegistrCcPrice + " CC)", service.$registrateOfficer);
            }


        }
        else {
            if (election.RegistrBtn) {
                election.RegistrBtn = null;
            }
            if (lsData) {
                $ls.RemoveItem($lsRegKey);
            }
            if (election.Registred) {
                election.Registred = false;
            }
        }


        if (!election.$params) {
            election.$params = _getFromLsVoteParams();
            if (!election.$params) {
                election.$params = _getDefaultVoteParams();
                service.$saveToLsVoteParams(election.$params);
            }
        }
        service.$checkAndUpdateHasVoice(election.$params);
        service.$checkAndRunOrDestroyVoteView(election);
        return election;


    };
               
    service.onVoteFinalize = function (tabElectionData, newListIOfficerOut, $$RootScope) {
        service.Officers.Officers = newListIOfficerOut;
        service.Election = tabElectionData;    
        service.getElectionData();
        if (tabElectionData) {
            $$RootScope.$broadcast("election:finished", {
                newListIOfficerOut: service.Officers.Officers,
                election: service.Election
            });
        }
        //console.log({
        //    newListIOfficerOut: newListIOfficerOut,
        //    tabElectionData: tabElectionData,
        //    $$RootScope: $$RootScope
        //});
    };
};
