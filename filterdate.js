(function ($) {

    "use strict";

    /**
     * Main function of FilterDate.
     * 
     * @param {object} select the element that is anchored to plugin.
     * @param {object} options all available options.
     */
    function FilterDate(select, options) {
        var that = this;
        that.$select = $(select);
        that.defaults = {

            values: {
                0: "No filter",
                1: "Today",
                2: "Yesterday",
                3: "Last 7 days",
                4: "Last week",
                5: "Last 30 days",
                6: "Last month",
                7: "Custom"
            },

            rangeValues: {
                0: "No filter",
                1: "10 days ago",
                2: "10 - 20 days ago",
                3: "20 - 30 days ago",
                4: "30 - 40 days ago",
                5: "40 - 50 days ago",
                6: "50 - 60 days ago"
            },

            /**
             * Series of days in range filter.
             * 
             * @type {int}
             */
            serie: 10,

            /**
             * Type of filter.
             * Possible values = ["none", "range"].
             * 
             * @type {string}
             */
            type: "none",

            /**
             * Type of format date string.
             * Possible values = ["ISO", "short", "it", "full-it", "full-en", "en"].
             * 
             * @type {boolean}
             */
            formatDateString: "default",

            /**
             * Use to set the custom filter options.
             * 
             * @type {boolean}
             */
            customFilter: false,

            /**
             * Use to convert date to string.
             * 
             * @type {boolean}
             */
            convertDateToString: true,

            /**
             * Use to insert the empty filter.
             * 
             * @type {boolean}
             */
            emptyFilter: true,

            /**
             * Called when Custom filter is selected.
             * 
             * @param {number} value the value of select.
             */
            onSelectedCustomizeFilter: function(value) {},

            /**
             * Called at the beginning of select's on change.
             * 
             * @param {number} value the value of select.
             */
            onStartChangeEvent: function(value) {},

            /**
             * Called when select's on change is finish.
             * 
             * @param {Date|string} dateTo the value of select.
             * @param {Date|string} dateFrom the value of select.
             */
            onEndChangeEvent: function(dateTo, dateFrom) {},

            /**
             * Called when No filter is selected.
             */
            onSelectedNoFilter: function() {}
        }
        that.init(options);
    }

    FilterDate.prototype = {

        /**
         * Initialize the plugin.
         * 
         * @param {object} options custom options to add/override.
         */
        init: function(options) {
            var that = this;
            that.defaults = $.extend({}, that.defaults, options);
            if(!that.defaults.emptyFilter && that.defaults.values.hasOwnProperty(0)) {
                delete that.defaults.values[0];
            }
            if(that.defaults.customFilter === false) {
                delete that.defaults.values[7];
            }
            that.setValuesByType(that.defaults.type);
            that.setSelectValues(that.$select, that.defaults.values);
            that.$select.on("change", function(e) {
                e.preventDefault();
                var filter = Number($(this).val());
                if(isNaN(filter)) {
                    console.error("Select's values must be numbers", "--> " + $(this).val());
                    return false;
                }
                that.defaults.onStartChangeEvent(filter);
                that.filter(filter);
                return false;
            });
        },

        /**
         * Create element in select element.
         * 
         * @param {object} select the element that is anchored to plugin.
         * @param {object} values to set in select options.
         */
        setSelectValues: function(select, values) {
            select.empty();
            var keyOptions = Object.keys(values);
            var valueOptions = Object.values(values);
            for(var i = 0; i < keyOptions.length; i++) {
                var option = document.createElement("option");
                option.value = keyOptions[i];
                option.innerHTML = valueOptions[i];
                select.append(option);
            }
        },

        /**
         * Set the type of filter.
         * 
         * @param {string} type type of filter to use.
         */
        setValuesByType: function(type) {
            var that = this;
            switch(type) {
                case "range":
                    that.defaults.values = that.defaults.rangeValues;
                break;
            }
        },

        /**
         * Select the filter.
         * 
         * @param {int} filter value of type selected.
         */
        filter: function(filter) {
            var that = this;
            switch(that.defaults.type) {
                case "range":
                    that.filterByRangeOfDate(filter);
                break;
                default:
                    that.defaultFilter(filter);
                break;
            }
        },

        /**
         * Filter by range of date.
         * 
         * @param {int} filter value of type selected.
         */
        filterByRangeOfDate: function(filter) {
            var that = this;
            var resDateFrom = new Date(),
                resDateTo = new Date();
            if (filter == 0) {
                that.setNoFilter();
            } else {
                var daysFrom = that.defaults.serie * (filter-1);
                var daysTo = that.defaults.serie * filter;
                resDateFrom = that.addDays(resDateFrom, -daysFrom);
                resDateTo = that.addDays(resDateTo, -daysTo);
            }
            if(that.defaults.convertDateToString) {
                resDateTo = that.setFormatDate(resDateTo);
                resDateFrom = that.setFormatDate(resDateFrom);
            }
            that.defaults.onEndChangeEvent(resDateTo, resDateFrom);
        },

        /**
         * Called when no filter is selected.
         */
        setNoFilter: function() {
            var that = this;
            if(that.defaults.emptyFilter) {
                that.defaults.onSelectedNoFilter();
                return false;
            }
        },

        /**
         * Filter value of select when its status change.
         * 
         * @param {number} filter
         */
        defaultFilter: function(filter) {
            var that = this;
            var today = new Date();
            var resDateTo, resDateFrom;
            switch (filter){
                // No filter
                case 0:
                    that.setNoFilter();
                    break;
                // Today
                case 1:
                    resDateTo = resDateFrom = that.addDays(today, 0);
                    break;
                // Yesterday
                case 2:
                    resDateTo = resDateFrom = that.addDays(today, -1);
                    break;
                // Last 7 days
                case 3:
                    today.setDate(today.getDate() - 1);
                    resDateFrom = that.addDays(today, -6);
                    resDateTo = that.addDays(today, 0);
                    break;
                // Last week
                case 4:
                    today.setDate(today.getDate() - 1);
                    resDateFrom = that.addDays(that.getMonday(today), -7);
                    resDateTo = that.addDays(that.getMonday(today), -1);
                    break;
                // Last 30 days
                case 5:
                    today.setDate(today.getDate() - 1);
                    resDateFrom = that.addDays(today, -29);
                    resDateTo = that.addDays(today, 0);
                    break;
                // Last month
                case 6:
                    today.setDate(today.getDate() - 1);
                    resDateFrom = that.getFirstOfMonth(today, -1);
                    resDateTo = that.addDays(that.getFirstOfMonth(today, 0), -1);
                    break;
                // Custom filter
                case 7:
                    that.defaults.onSelectedCustomizeFilter(filter);
                    return false;
            }
            if(that.defaults.convertDateToString) {
                resDateTo = that.setFormatDate(resDateTo);
                resDateFrom = that.setFormatDate(resDateFrom);
            }
            that.defaults.onEndChangeEvent(resDateTo, resDateFrom);
            return false;
        },

        /**
         * Add days to a date.
         * @param {Date} date
         * @param {number} days
         * 
         * @return {Date}
         */
        addDays: function(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },

        /**
         * Get first day of month relative to date param
         * @param {Date} date
         * @param {number} days
         * 
         * @return {Date}
         */
        getFirstOfMonth: function(date, months) {
            var result = new Date(date);
            result.setMonth(result.getMonth() + months);
            result.setDate(1);
            return result;
        },

        /**
         * Get monday relative to date param.
         * @param {Date} date
         * 
         * @return {Date}
         */
        getMonday: function(date) {
            date = new Date(date);
            var day = date.getDay(),
                diff = date.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(date.setDate(diff));
        },

        /**
         * Format date to ITA string (dd-mm-yyyy)
         * @param {Date} date
         * 
         * @return {string}
         */
        setFormatDate: function(date) {
            var that = this;
            if(typeof date == "undefined") {
                return "";
            }
            var d = date.getDate(),
                m = date.getMonth() + 1,
                Y = date.getFullYear(),
                H = date.getMinutes(),
                i = date.getSeconds();
            if(d < 10) d = "0" + d;
            if(m < 10) m = "0" + m;
            var dateString = "";
            switch (that.defaults.formatDateString) {
                case "ISO":
                    dateString = Y + "-" + m + "-" + d + " " + H + ":" + i;
                break;
                case "short":
                    dateString = d + "/" + m + "/" + Y;
                break;
                case "it":
                    dateString = d + "/" + m + "/" + Y;
                break;
                case "full-it":
                    dateString = d + "/" + m + "/" + Y + " " + H + ":" + i;
                break;
                case "full-en":
                    dateString = m + "/" + d + "/" + Y + " " + H + ":" + i;
                break;
                case "en":
                default:
                    dateString = m + "/" + d + "/" + Y;
                break;
            }
            return dateString;
        }
    };
    
    $.fn.filterDate = function (options, args) {
        var dataKey = "filterDate";
        return this.each(function () {
            var selectElement = $(this),
                instance = selectElement.data(dataKey);
            if (typeof options === "string") {
                if (instance && typeof instance[options] === "function") {
                    instance[options](args);
                }
            } else {
                if (instance && instance.dispose) {
                    instance.dispose();
                }
                instance = new FilterDate(this, options);
                selectElement.data(dataKey, instance);
            }
        });
    };
})(jQuery);