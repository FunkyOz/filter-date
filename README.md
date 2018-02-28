# filterDate.js
A little plugin to create a select with filters "Today, Yesterday, Last 7 days, Last week, Last 30 days, Last month".
## Installation
Include the script `filter-date.js` or `filter-date.min.js` after the jquery plugin.
## Quick Start.
Instance the `filterDate()` object with `onEndChangeEvent` callback because is mandatory if you want to use the output dates.
```javascript
var options: {
	onEndChangeEvent: function(dateFrom, dateTo) {
		console.log("With this callback you can catch the dates values");
	}
};

$("#filter-date").filterDate(options);
```
### Customize date filter.
You can add other fields to the options if you want customize filter.
```javascript
**Attention:** for now you MUST use this format of value.
var spanishValues: {
    0: "No",
    1: "Hoy",
    2: "Ayer",
    3: "Últimos 7 días",
    4: "La semana pasada",
    5: "Últimos 30 días",
    6: "El mes pasado",
    7: "Personalizado"
};

var options: {
	onEndChangeEvent: function(dateFrom, dateTo) {
		console.log("With this callback you can catch the dates values");
	},
	onSelectedCustomizeFilter : function(value) {
		console.log("Customize the filter.");
	},
	onSelectedNoFilter: function() {
		console.log("What should i do in this case?");
	},
	onStartChangeEvent: function() {
		console.log("Start change event of select");
	}
	values: spanishValues,
	formatDateString: "ISO",
	emptyFilter: false,
	customFilter: true
}

$("#filter-date").filterDate(options);
```
### Use the range date filter.
You can use the range date filter and change the serie of value.
```javascript
**Attention:** for now you MUST use this format of value.

var options: {
	type: "range",
	serie: 10,
	formatDateString: formatDateString,
	onEndChangeEvent: function(dateFrom, dateTo) {
		console.log("With this callback you can catch the dates values");
	}
}

$("#filter-date").filterDate(options);
```