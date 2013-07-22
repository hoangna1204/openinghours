
$(document).on("click", ".j-get-from-prev-day", function (event) {
      var days = [
            {id: 'mon', name: 'Montag'},
            {id: 'tue', name: 'Dienstag'},
            {id: 'wed', name: 'Mittwoch'},
            {id: 'thu', name: 'Donnerstag'},
            {id: 'fri', name: 'Freitag'},
            {id: 'sat', name: 'Samstag'},
            {id: 'sun', name: 'Sonntag'}
        ];
            event.preventDefault();
            var btn = $(this);
            var day = $(this).closest('tr').data('weekday');
            for (var dayIndex = 0; dayIndex < days.length; dayIndex++) {
                if (days[dayIndex].id == day) {
                    break;
                }
            }
            // var hoursForm = btn.closest('.j-season-container');
            var sourceDay = days[dayIndex - 1].id;
            var sourceDayRow = $('tr[data-weekday=' + sourceDay + ']');
            var sourceDayHours = $('.j-day-hours', sourceDayRow);
            var targetDayHours = $(this).closest('tr').find('.j-day-hours');
            var targetContainer = targetDayHours.closest('td');
            targetDayHours.each(function () {
                $(this).remove();
            });
            sourceDayHours.clone(true).appendTo(targetContainer);



});
$(document).on("click", ".j-set-closed", function (event) {
            event.preventDefault();
            var dayHours = $(this).closest('tr').find('.j-day-hours');
            if (dayHours.length > 1) {
                for (var i = 1; i < dayHours.length; i++) {
                    dayHours.eq(i).remove();
                }
            }
            var timeFields = $('.time-field', dayHours[0]);
            timeFields.each(function () {
                $(this).val('---');
                $(this).data('time', 'closed');
            });
});