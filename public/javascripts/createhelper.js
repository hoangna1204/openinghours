var limit = 3;
$(function() {
      $(document).on("click", ".j-add-interval", function (event) {
          event.preventDefault();
          var dayHours = $(this).closest('.j-day-hours');
          var hoursContainer = $(this).closest('td');
          // limit time interval to only 3
          if(hoursContainer.children().length < limit)
              dayHours.clone().appendTo(hoursContainer).find('input').val('');
          else
              console.log('over3');
      });
});
$(document).on("click", ".j-get-from-prev-day", function (event) {
      var days = [
            {id: 'mon', name: 'Thứ 2'},
            {id: 'tue', name: 'Thứ 3'},
            {id: 'wed', name: 'Thứ 4'},
            {id: 'thu', name: 'Thứ 5'},
            {id: 'fri', name: 'Thứ 6'},
            {id: 'sat', name: 'Thứ 7'},
            {id: 'sun', name: 'CN'}
        ];
        event.preventDefault();
        var btn = $(this);
        var day = $(this).closest('tr').data('weekday');
        for (var dayIndex = 0; dayIndex < days.length; dayIndex++) {
            if (days[dayIndex].id == day) {
                break;
            }
        }
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