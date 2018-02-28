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

### Add additionals fields.
You can add other fields to the options if you want customize filters.
```javascript
**Attention: ** you MUST use this format of value, for now.
var spanishValues: {
    0: 'No',
    1: 'Hoy',
    2: 'Ayer',
    3: 'Últimos 7 días',
    4: 'La semana pasada',
    5: 'Últimos 30 días',
    6: 'El mes pasado',
    7: 'Personalizado'
};

var options: {
	onEndChangeEvent: function(dateFrom, dateTo) {
		console.log("With this callback you can catch the dates values");
	},
	values: spanishValues
}
$("#filter-date").filterDate(options);
```
