'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var start = moment().startOf('day').format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
        $scope.meds = meds.data;
        console.log(meds.data);
    });

    $window.setInterval(function () {

        $scope.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        $scope.$apply();
    }, 1000);

    $scope.now = moment();
    $scope.displayMonth = $scope.now.format('MMMM YYYY');
    $scope.weeks = buildMonth(moment($scope.displayMonth, 'MMMM YYYY'));

    // These functions build the calendar component
    function buildWeek(week, month) {
    	var days = [];
    	var day = moment(week.startOf('week'));
    	for (var i = 0; i < 7; i++) {
    		days.push({
    			moment: day,
    			number: day.format('DD'),
    			isCurrentMonth: month === day.month(),
    			isToday: day.isSame(new Date(), 'day'),
    			isSelected: false
    		});
    		day = moment(day).add(1, 'day');
    	};
    	return days;
    };

    function buildMonth(day) {
    	var weeks = [];
    	var weekCounter = day.clone().startOf('month');
    	var month = day.month();
    	var startNum = day.clone().startOf('month').week() + (day.startOf('month').year() * 53);
    	var endNum = day.clone().endOf('month').week() + (day.endOf('month').endOf('week').year() * 53);
    	for (var i = startNum; i <= endNum; i++) {
    		weeks.push({days: buildWeek(weekCounter, month)});
    		weekCounter = moment(weekCounter).add(1, 'week');
    	};
    	return weeks;
    };

    // Selects the next month
    $scope.nextMonth = function() {
    	$scope.displayMonth = moment($scope.displayMonth).add(1, 'month').format('MMMM YYYY');
    	$scope.weeks = buildMonth(moment($scope.displayMonth));
    };

    // Selects the previous month
    $scope.previousMonth = function() {
    	$scope.displayMonth = moment($scope.displayMonth).subtract(1, 'month').format('MMMM YYYY');
    	$scope.weeks = buildMonth(moment($scope.displayMonth));
    };

    $scope.daySelector = function() {
    	// display the selected days meds
    	$scope.meds = {};
    	start = this.day.moment.format('MM/DD/YYYY');
    	end = moment(start).add(1, 'day').format('MM/DD/YYYY');
    	console.log(start, end);
    	$http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
    	    $scope.meds = meds.data;
    	});
    	// change isSelected to true
    	this.day.isSelected = true;
    }

    $scope.checkMedTime = function() {
    	return false;
    	console.log(this.day)
    }

});

