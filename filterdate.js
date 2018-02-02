(function ($) {

    'use strict';

    /**
     * The default object that define value and label of select.
     * 
     * @type {object}
     */
    var defaultValues = {
        0: 'No filter',
        1: 'Today',
        2: 'Yesterday',
        3: 'Last 7 days',
        4: 'Last week',
        5: 'Last 30 days',
        6: 'Last month',
        7: 'Custom'
    };

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

            values: defaultValues,

            /**
             * Use to convert date to string ITA (dd-mm-yyyy).
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
            onSelectedCustomizeFilter: function(value) {
                console.log('noFilterCallback');
                return false;
            },

            /**
             * Called at the beginning of select's on change.
             * 
             * @param {number} value the value of select.
             */
            onStartChangeEvent: function(value) {
                console.log('onStartChangeEvent');
                return false;
            },

            /**
             * Called when select's on change is finish.
             * 
             * @param {Date|string} dateTo the value of select.
             * @param {Date|string} dateFrom the value of select.
             */
            onEndChangeEvent: function(dateTo, dateFrom) {
                console.log('onEndChangeEvent');
                return false;
            },

            /**
             * Called when No filter is selected.
             */
            onSelectedNoFilter: function() {
                return false;
            }
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
            that.$select.empty();
            var keyOptions = Object.keys(that.defaults.values);
            var valueOptions = Object.values(that.defaults.values);
            for(var i = 0; i < keyOptions.length; i++) {
                var option = document.createElement('option');
                option.value = keyOptions[i];
                option.innerHTML = valueOptions[i];
                that.$select.append(option);
            }
            that.$select.on('change', function(e) {
                e.preventDefault();
                var filter = Number($(this).val());
                if(isNaN(filter)) {
                    console.error("Select's values must be numbers", '--> ' + $(this).val());
                    return false;
                }
                that.defaults.onStartChangeEvent(filter);
                that.filter(filter);
                return false;
            });
        },

        /**
         * Filter value of select when its status change.
         * 
         * @param {number} filter
         */
        filter: function(filter) {
            var that = this;
            var today = new Date();
            var resDateTo, resDateFrom;
            switch (filter){
                // No filter
                case 0:
                    if(!that.defaults.emptyFilter) {
                        that.defaults.onSelectedNoFilter();
                        return false;
                    }
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
        addDays: function(date, days) {
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
            var dd = date.getDate(),
                mm = date.getMonth() + 1,
                yyyy = date.getFullYear();
            if(dd < 10) dd = '0' + dd;
            if(mm < 10) mm = '0' + mm;
            return dd + '-' + mm + '-' + yyyy;
        }
    };
    $.fn.filterDate = function (options, args) {
        var dataKey = 'filterDate';
        return this.each(function () {
            var selectElement = $(this),
				instance = selectElement.data(dataKey);
            if (typeof options === 'string') {
                if (instance && typeof instance[options] === 'function') {
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