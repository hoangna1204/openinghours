(function ($) {

    $.fn.openHours = function (options) {

        var settings = $.extend({}, $.fn.openHours.defaults, options);

        $(document).on("focus", ".time-field", function () {
            $(this).autocomplete({
                minLength: 0,
                max: 5,
                change: function (event, ui) {
                    var timeValue = $(this).val();
                    var timeData = getTime24(timeValue);
                    if (timeValue.length == 4) {
                        console.log("4 chars long");
                        timeValue = "0" + timeValue
                    }
                    if (timeValue == "24:00") {
                        $(this).val("00:00");
                        $(this).data('time', "00:00");
                    } else if (isValidTime(timeValue) && timeData || timeValue == "" || timeValue == "---") {
                        $(this).data('time', timeData);
                        $(this).data('time', timeData);
                        $(this).val(timeValue);
                        buildJsonString();
                        $(this).css("border-color", "#ccc");
                    } else {
                        console.log("not valid time: " + timeData);
                        $(this).css("border-color", "#ff0000");
                    }
                },

                source: function (request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response($.grep(autocomplete_values, function (value) {
                        value = value.label || value.data || value;
                        return matcher.test(value) || matcher.test(value);
                    })
                    );
                }
            });
        });

        $(document).on("click", ".time-field", function () {
            $(this).autocomplete("search", "");
        });

        $(document).on("focus", ".j-datepicker", function () {
            $(this).datepicker({
                dateFormat: "MM d",
                onSelect: function (text, picker) {
                    var seasonDateString = picker.selectedDay + "." + (picker.selectedMonth + 1);
                    $(this).data('date', seasonDateString);
                    buildJsonString();
                }});
        });

        $(document).on("blur", ".j-season-name", function () {
            buildJsonString();
        });

        $(document).on("click", ".j-add-interval", function (event) {
            event.preventDefault();
            var dayHours = $(this).closest('.j-day-hours');
            var hoursContainer = $(this).closest('td');
            dayHours.clone().appendTo(hoursContainer).find('input').val('');
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
            buildJsonString();
        });

        $(document).on("click", ".j-set-unknown", function (event) {
            event.preventDefault();
            if (settings.allowUnknownHours) {
                var dayHours = $(this).closest('tr').find('.j-day-hours');
                if (dayHours.length > 1) {
                    for (var i = 1; i < dayHours.length; i++) {
                        dayHours.eq(i).remove();
                    }
                }
                var timeFields = $('.time-field', dayHours[0]);
                timeFields.each(function () {
                    $(this).val('');
                    $(this).data('time', '');
                });
                buildJsonString();
            }
        });

        $(document).on("click", ".j-get-from-prev-day", function (event) {
            event.preventDefault();
            var btn = $(this);
            var day = $(this).closest('tr').data('weekday');
            for (var dayIndex = 0; dayIndex < days.length; dayIndex++) {
                if (days[dayIndex].id == day) {
                    break;
                }
            }
            var hoursForm = btn.closest('.j-season-container');
            var sourceDay = days[dayIndex - 1].id;
            var sourceDayRow = $('tr[data-weekday=' + sourceDay + ']', hoursForm);
            var sourceDayHours = $('.j-day-hours', sourceDayRow);
            var targetDayHours = $(this).closest('tr').find('.j-day-hours');
            var targetContainer = targetDayHours.closest('td');
            targetDayHours.each(function () {
                $(this).remove();
            });
            sourceDayHours.clone(true).appendTo(targetContainer);

            buildJsonString();
        });

        $(document).on("click", ".j-delete-season", function (event) {
            event.preventDefault();
            $(this).closest('.j-season-container').remove();
            buildJsonString();
        });

        $(document).on("click", ".j-add-season", function (event) {
            event.preventDefault();
            createTimeTable(null, false);
        });

        $(document).on("click", ".j-add-holiday-hours", function (event) {
            event.preventDefault();
            createHolidayTimeTable(null);
        });

        // TODO: Refactor it! This is not right place for this function!!!
        $(document).on("submit", "form", function (event) {
            var alt_city = $('input[name=city]').data("alt-name");
            if (alt_city && alt_city != "") {
                $('input[name=city]').val(alt_city)
            }
        });

        var days = [
            {id: 'mon', name: 'Montag'},
            {id: 'tue', name: 'Dienstag'},
            {id: 'wed', name: 'Mittwoch'},
            {id: 'thu', name: 'Donnerstag'},
            {id: 'fri', name: 'Freitag'},
            {id: 'sat', name: 'Samstag'},
            {id: 'sun', name: 'Sonntag'}
        ];

        var autocomplete_values = [
            {value: "00:00", data: "00:00"},
            {value: "00:15", data: "00:15"},
            {value: "0:45", data: "00:45"},
            {value: "1:00", data: "01:00"},
            {value: "1:15", data: "01:15"},
            {value: "1:30", data: "01:30"},
            {value: "1:45", data: "01:45"},
            {value: "2:00", data: "02:00"},
            {value: "2:15", data: "02:15"},
            {value: "2:30", data: "02:30"},
            {value: "2:45", data: "02:45"},
            {value: "3:00", data: "03:00"},
            {value: "3:15", data: "03:15"},
            {value: "3:30", data: "03:30"},
            {value: "3:45", data: "03:45"},
            {value: "4:00", data: "04:00"},
            {value: "4:15", data: "04:15"},
            {value: "4:30", data: "04:30"},
            {value: "4:45", data: "04:45"},
            {value: "5:00", data: "05:00"},
            {value: "5:15", data: "05:15"},
            {value: "5:30", data: "05:30"},
            {value: "5:45", data: "05:45"},
            {value: "6:00", data: "06:00"},
            {value: "6:15", data: "06:15"},
            {value: "6:30", data: "06:30"},
            {value: "6:45", data: "06:45"},
            {value: "7:00", data: "07:00"},
            {value: "7:15", data: "07:15"},
            {value: "7:30", data: "07:30"},
            {value: "7:45", data: "07:45"},
            {value: "8:00", data: "08:00"},
            {value: "8:15", data: "08:15"},
            {value: "8:30", data: "08:30"},
            {value: "8:45", data: "08:45"},
            {value: "9:00", data: "09:00"},
            {value: "9:15", data: "09:15"},
            {value: "9:30", data: "09:30"},
            {value: "9:45", data: "09:45"},
            {value: "10:00", data: "10:00"},
            {value: "10:15", data: "10:15"},
            {value: "10:30", data: "10:30"},
            {value: "10:45", data: "10:45"},
            {value: "11:00", data: "11:00"},
            {value: "11:15", data: "11:15"},
            {value: "11:30", data: "11:30"},
            {value: "11:45", data: "11:45"},
            {value: "12:00", data: "12:00"},
            {value: "12:15", data: "12:15"},
            {value: "12:30", data: "12:30"},
            {value: "12:45", data: "12:45"},
            {value: "13:00", data: "13:00"},
            {value: "13:15", data: "13:15"},
            {value: "13:30", data: "13:30"},
            {value: "13:45", data: "13:45"},
            {value: "14:00", data: "14:00"},
            {value: "14:15", data: "14:15"},
            {value: "14:30", data: "14:30"},
            {value: "14:45", data: "14:45"},
            {value: "15:00", data: "15:00"},
            {value: "15:15", data: "15:15"},
            {value: "15:30", data: "15:30"},
            {value: "15:45", data: "15:45"},
            {value: "16:00", data: "16:00"},
            {value: "16:15", data: "16:15"},
            {value: "16:30", data: "16:30"},
            {value: "16:45", data: "16:45"},
            {value: "17:00", data: "17:00"},
            {value: "17:15", data: "17:15"},
            {value: "17:30", data: "17:30"},
            {value: "17:45", data: "17:45"},
            {value: "18:00", data: "18:00"},
            {value: "18:15", data: "18:15"},
            {value: "18:30", data: "18:30"},
            {value: "18:45", data: "18:45"},
            {value: "19:00", data: "19:00"},
            {value: "19:15", data: "19:15"},
            {value: "19:30", data: "19:30"},
            {value: "19:45", data: "19:45"},
            {value: "20:00", data: "20:00"},
            {value: "20:15", data: "20:15"},
            {value: "20:30", data: "20:30"},
            {value: "20:45", data: "20:45"},
            {value: "21:00", data: "21:00"},
            {value: "21:15", data: "21:15"},
            {value: "21:30", data: "21:30"},
            {value: "21:45", data: "21:45"},
            {value: "22:00", data: "22:00"},
            {value: "22:15", data: "22:15"},
            {value: "22:30", data: "22:30"},
            {value: "22:45", data: "22:45"},
            {value: "23:00", data: "23:00"},
            {value: "23:15", data: "23:15"},
            {value: "23:30", data: "23:30"},
            {value: "23:45", data: "23:45"},
            {value: "00:00", data: "24:00"}

        ];

        function getTime24(time12_value) {
            for (var i = 0; i < autocomplete_values.length; i++) {
                var item = autocomplete_values[i];
                if (item['value'] == time12_value) return item['data']
            }

            var elements = time12_value.split(":");
            if (elements.length == 2 && elements[0] < 24 || elements[0] == "00") {
                if (elements[1] < 60 || elements[1] == "00") {
                    if (time12_value.length == 4) {
                        return "0" + time12_value;
                    }

                    if (time12_value.length == 5) {
                        return time12_value;
                    }
                }
            }

            return null;
        }

        function createTimeTable(hours, compact) {
            hours = hours || {type: 'normal', name: null, from: null, to: null, hours: null};
            compact = compact || false;
            if (hours.type == 'normal') {
                createNormalTimeTable(hours, compact);
            } else if (hours.type == 'holiday') {
                createHolidayTimeTable(hours);
            }
        }

        function isValidTime(time_string) {
            var isValid = true;
            // TODO: Validation function incomplete
            return isValid;
        }

        function createNormalTimeTable(openHours, compact) {
            var hours = openHours.hours || {'mon': null, 'tue': null, 'wed': null, 'thu': null, 'fri': null, 'sat': null, 'sun': null};
            var seasonName = openHours.name || "";

            var seasonStartDate;
            var seasonEndDate;
            if (openHours.from != null) {
                var seasonStartParts = openHours.from == null ? null : openHours.from.split(".");
                seasonStartDate = seasonStartParts != null ? new Date(2012, parseInt(seasonStartParts[1], 10) - 1, seasonStartParts[0]) : null;
            }
            var seasonStartText = seasonStartDate != null ? $.datepicker.formatDate("MM d", seasonStartDate) : "";

            if (openHours.to != null) {
                var seasonEndParts = openHours.to == null ? null : openHours.to.split(".");
                seasonEndDate = seasonEndParts != null ? new Date(2012, parseInt(seasonEndParts[1], 10) - 1, seasonEndParts[0]) : null;
            }
            var seasonEndText = seasonEndDate != null ? $.datepicker.formatDate("MM d", seasonEndDate) : null;

            var timeRows = '';
            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                var dayHours = hours[day.id];
                if (dayHours && dayHours.length == 0) {
                    dayHours = 'closed'
                }
                timeRows += createNormalTimeRow(day, dayHours);
            }
            var source = $("#table_normal").html();
            var template = Handlebars.compile(source, {noEscape: true});
            var context = {time_rows: timeRows,
                compact: compact,
                readonly: settings.readonly,
                seasonName: seasonName,
                seasonStartText: seasonStartText,
                seasonStartDate: seasonStartDate,
                seasonEndText: seasonEndText,
                seasonEndDate: seasonEndDate};
            var html = template(context);
            $(settings.target).append(html);
        }

        function createHolidayTimeTable(hours) {
            var timeRow = createHolidayTimeRow(hours);
            var source = $("#table_holiday").html();
            var template = Handlebars.compile(source, {noEscape: true});
            var context = {time_row: timeRow};
            var html = template(context);

            $(settings.target).append(html);
        }

        function createNormalTimeRow(day, dayHours) {
            var source = $("#time_row_normal").html();
            var template = Handlebars.compile(source);
            var context = {day: day, hours: dayHours, readonly: settings.readonly, allowUnknownHours: settings.allowUnknownHours};
            return template(context);
        }

        function createHolidayTimeRow(dayHours) {
            var hours = dayHours == null ? null : dayHours.hours;
            var source = $("#time_row_holiday").html();
            var template = Handlebars.compile(source);
            var context = {hours: hours};
            return template(context);
        }

        function normalizeTime(time) {
            //check based on regexs if opening-times are correct
            var normal_opening_times = new RegExp(/[0-9]{2}:[0-9]{2}/);
            var short_opening_times = new RegExp(/[1-9]{1}:[0-9]{2}/);

            if (time.search(normal_opening_times)) {
                return time;

            } else if (time.search(short_opening_times)) {
                return "0" + time;
            }
            else {
                return false;
            }
        }

        function validateTimeField(timeField) {
            var time = $(timeField).data('time');
            var time_val = $(timeField).val();

            if (time != undefined && time != "" && normalizeTime(time) != "" && normalizeTime(time) == normalizeTime(time_val)) {
                //correct time-format in data field

            }
            else if (time_val != "" && normalizeTime(time_val) != false) {
                //correct opening times, but not selected

                time = normalizeTime(time_val)

            } else if (time == "" || time_val == "") {
                //empty?!
                if (settings.allowUnknownHours) {
                    return
                } else {
                    time = 'closed'
                }
            } else if (formtime == "closed" || time_val == "---") {

                //set to closed
                time = 'closed'
            }
            else {
                //todo: trow an error
                return false;
            }

            return time;
        }

        function buildJsonString() {
            var hours;
            var dayRow;
            var dayHours;
            var timeFields;
            var fromTime;
            var toTime;
            var i;

            var openHours = [];
            $('.j-season-container', $(settings.target)).each(function () {
                var seasonContainer = $(this);
                var hoursType = seasonContainer.data('type');
                var seasonName = $('.j-season-name', seasonContainer).val();
                var seasonStart = $('.j-season-start', seasonContainer).data('date');
                var seasonEnd = $('.j-season-end', seasonContainer).data('date');

                if (hoursType == 'normal') {
                    hours = {
                        'mon': null,
                        'tue': null,
                        'wed': null,
                        'thu': null,
                        'fri': null,
                        'sat': null,
                        'sun': null
                    };
                    var season = {type: 'normal', name: seasonName, from: seasonStart, to: seasonEnd, hours: hours};

                    for (var j = 0; j < days.length; j++) {

                        var day = days[j].id;
                        dayRow = $('tr[data-weekday=' + day + ']', seasonContainer);
                        dayHours = $('.j-day-hours', dayRow);

                        for (i = 0; i < dayHours.length; i++) {

                            timeFields = $('.time-field', dayHours[i]);
                            fromTime = validateTimeField(timeFields[0]);
                            toTime = validateTimeField(timeFields[1]);

                            if (fromTime && toTime) {

                                if (hours[day] == null && fromTime == 'closed' && toTime == 'closed') {

                                    hours[day] = [];

                                } else {

                                    if (hours[day] == null) {
                                        hours[day] = [];
                                    }

                                    if (fromTime != "" && fromTime != "---" && fromTime != 'closed' && toTime != 'closed' && toTime != "" && toTime != "---") {
                                        hours[day].push({'from': fromTime, 'to': toTime});
                                    }
                                }

                            } else {
                                hours[day] = null;
                            }

                        }
                    }
                    openHours.push(season);
                } else if (hoursType == 'holiday') {
                    hours = [];
                    var holiday = {type: 'holiday', name: null, from: null, to: null, hours: hours};
                    dayRow = $('tr', seasonContainer).eq(1);
                    dayHours = $('.j-day-hours', dayRow);
                    for (i = 0; i < dayHours.length; i++) {
                        timeFields = $('.time-field', dayHours[i]);
                        fromTime = $(timeFields[0]).data('time');
                        toTime = $(timeFields[1]).data('time');
                        if (fromTime && toTime) {
                            if (fromTime == 'closed' && toTime == 'closed') {
                                hours = [];
                            } else {
                                if (hours == null) {
                                    hours = [];
                                }
                                hours.push({'from': fromTime, 'to': toTime});
                            }
                        }
                    }
                    openHours.push(holiday);
                }
            });

            var jsonString = JSON.stringify(openHours);
            var jsonHoursField = $('input[name=hours]');
            jsonHoursField.val(jsonString);
        }

        // making plugin chainable
        return this.each(function () {

            /* Save this to self because this changes when scope changes. */
            settings.target = this;

            var jsonHoursString = $(settings.source).val();
            if (!(typeof jsonHoursString === 'undefined') && jsonHoursString != '') {
                var hours = $.parseJSON(jsonHoursString);
                if (Object.prototype.toString.call(hours) === '[object Array]') {
                    for (var i = 0; i < hours.length; i++) {
                        var compact = (i == 0);
                        createTimeTable(hours[i], compact);
                    }
                }
            } else {
                createTimeTable(null, true);

            }

            if (!settings.readonly && settings.canAddSeasons) {
                $(settings.target).append('<div><button class="btn btn-warning j-add-season">Saison hinzufügen</button>&nbsp;<button class="btn btn-warning j-add-holiday-hours">Zeiten an Feiertagen</button></div>');
            }

        });

    };

    /* Publicly accessible defaults. */
    $.fn.openHours.defaults = {
        source: 'input[name=hours]',
        target: '',
        readonly: false,
        canAddSeasons: true,
        allowUnknownHours: false
    };


})(jQuery);