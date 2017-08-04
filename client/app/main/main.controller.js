'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
        $scope.meds = meds.data;
    });

    $window.setInterval(function () {

        $scope.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        $scope.currentMonth = moment().format('MMMM YYYY');
        $scope.$apply();
    }, 1000);

    $scope.now = moment();
    $scope.month = buildMonth($scope.now);

    function buildWeek(week, month) {
    	var days = [];
    	var day = moment(week.toString(), 'WW').startOf('week');
    	console.log(day, month);
    	for (var i = 0; i < 7; i++) {
    		console.log(days);
    		days.push({
    			moment: day,
    			number: day.format('DD'),
    			isCurrentMonth: month === day.month(),
    			isToday: day.isSame(new Date(), 'day')
    		});
    		day = moment(day).add(1, 'day');
    		console.log(day);
    	}
    	return days
    } 

    function buildMonth(day) {
    	var weeks = [];
    	var startDay = day.clone().startOf('month');
    	var endDay = day.clone().endOf('month');
    	var month = day.month();
    	var startNum = startDay.week();
    	var endNum = endDay.week();
    	console.log(day, startDay, endDay, startNum, endNum, month);
    	for (var i = startNum; i <= endNum; i++) {
    		console.log(weeks);
    		weeks.push(buildWeek(i, month));
    	}
    	return weeks

    	// console.log(startWeek, endWeek, weekNumber);
    }

});

