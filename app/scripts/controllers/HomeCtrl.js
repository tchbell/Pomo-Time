(function () {
    function HomeCtrl(Task, Ding, $interval) {
        var timer = null;
        var pomodoro = 2;
        var onBreak = false;
        var WORKSESSION = 1500000;  //25min
        var BREAKSESSION = 300000;  //5min
        var LONGBREAK = 1800000;    //30min
        this.message = "";
        
        //Alert Noise
        var ding = function () {
            return Ding.noisePlay();
        };
        
        //Prevents multiple timers running
        var timerOn = false;
        
        this.disable = function () {
            if (onBreak || timerOn) {
                return true;
            }
        };
        
        this.timerRunning = function () {
            if (timerOn) {
                return true;
            }
        };


        
        //Timer Code
        //Instructions
        this.startSession = "Start Here";
        this.sessionRest = "";
        var timerVal = "0:00";
        this.showTimerVal = function () {
            return timerVal;
        };
        
        //Make the miliseconds more readable
        
        var format = function (time) {
            var makeToSeconds = time / 1000;
            var seconds = Math.floor(makeToSeconds % 60);
            var minutes = Math.floor(makeToSeconds / 60);
                
            if (seconds < 10) {
                return minutes + ":0" + seconds;
            } else {
                return minutes + ":" + seconds;
            }

        };
        

        var timerStart = function (time) {
                timer = $interval(
                    function () {
                        if (time > 0) {
                            time -= 1000;
                            timerVal = format(time);
                        } else {
                            ding();
                            timerOn = false;
                            this.message = "Timer has ended";
                            $interval.cancel(timer);
                        }
                }, 1000);
            };

        //starting work and rest timer
        var startTimer = function (time) {
            timerStart(time);
            timerOn = true;
        };
        
        this.stopTimer = function () {
            this.message = "Timer has stopped";
            $interval.cancel(timer);
            timerVal = "0:00";
            timerOn = false;
            onBreak = false;
            pomodoro = 0;
            
        };
        
        this.workTimer = function () {
            pomodoro++;
            this.message = "Begin work!";
            startTimer(3000);
            if (pomodoro < 4) {
                this.startSession = "";
                this.sessionRest = "Once timer completes click here to start rest period";
                onBreak = true;
            } else {
                this.startSession = "";
                this.sessionRest = "Click here to start your long rest break";
            }
        };
        
        
        
        
        this.restTimer = function () {
            if (pomodoro === 4) {
                this.message = "Rest has begun";
                startTimer(5000);
                onBreak = false;
                pomodoro = 0;
            } else {
                startTimer(2000);
                onBreak = false;
            }
            this.startSession = "Now click here to start another work session";
            this.sessionRest = "";
        };
        
        //Tasks
        this.tasks = Task.all;
        console.log(Task.all);
        
        this.taskName = "";
        
        this.addTask = Task.addTask;

    }
    
    angular
        .module("Bloctime")
        .controller("HomeCtrl", ["Task", "Ding", "$interval", HomeCtrl]);
})();