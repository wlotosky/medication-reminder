'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
        $scope.meds = meds.data;
    });

    $window.setInterval(function () {

        $scope.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        $scope.$apply();
    }, 1000);

    $scope.now = moment();
    $scope.displayMonth = $scope.now.format('MMMM YYYY');
    $scope.weeks = buildMonth($scope.now);

    // These functions build the calendar component
    function buildWeek(week, month) {
    	var days = [];
    	var day = moment(week.toString(), 'WW').startOf('week');
    	for (var i = 0; i < 7; i++) {
    		days.push({
    			moment: day,
    			number: day.format('DD'),
    			isCurrentMonth: month === day.month(),
    			isToday: day.isSame(new Date(), 'day')
    		});
    		day = moment(day).add(1, 'day');
    	};
    	return days;
    };

    function buildMonth(day) {
    	var weeks = [];
    	var startDay = day.clone().startOf('month');
    	var endDay = day.clone().endOf('month');
    	var month = day.month();
    	var startNum = startDay.week();
    	var endNum = endDay.week();
    	for (var i = startNum; i <= endNum; i++) {
    		weeks.push({days: buildWeek(i, month)});
    	};
    	return weeks;
    };

    // Selects the next month
    $scope.nextMonth = function() {
    	$scope.displayMonth = moment($scope.displayMonth).add(1, 'month').format('MMMM YYYY');
    	$scope.weeks = buildMonth(moment($scope.displayMonth));
    	console.log('hey', $scope.displayMonth);
    };

    // Selects the previous month
    $scope.previousMonth = function() {
    	$scope.displayMonth = moment($scope.displayMonth).subtract(1, 'month').format('MMMM YYYY');
    	$scope.weeks = buildMonth(moment($scope.displayMonth));
    	console.log('also hey', $scope.displayMonth);
    };


});

