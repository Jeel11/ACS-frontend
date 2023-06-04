var date = new Date();
function createYearDropDown(id) {
    var selectYear = document.createElement('select');
    selectYear.id = id;
    selectYear.className = "chooser";
    var year = date.getFullYear();
    for (var i = 2010; i <= year; i++) {
        var option = document.createElement('option');
        option.value = option.innerHTML = i;
        if (i === year) option.selected = true;
        selectYear.appendChild(option);
    }
    return selectYear;
}

function createMonthDropDown(id) {
    var selectMonth = document.createElement('select');
    selectMonth.id = id;
    selectMonth.className = "chooser";
    var month = date.getMonth();
    for (var i = 1; i <= 12; i++) {
        var option = document.createElement('option');
        option.value = option.innerHTML = i;
        if (i === month) option.selected = true;
        selectMonth.appendChild(option);
    }
    return selectMonth;
}

function insertDropDown() {
    if(document.getElementById('search-form') != null) {
        document.getElementById('search-form').insertBefore(createYearDropDown(DROP_YEAR), document.getElementById('submit_button'));
        document.getElementById('search-form').insertBefore(createMonthDropDown(DROP_MONTH), document.getElementById('submit_button'));
        document.getElementById('search-form').insertBefore(document.createElement('br'), document.getElementById('submit_button'));
    }
    if(document.getElementById('xlsx_format') != null) {
        document.getElementById('xlsx_format').insertBefore(createYearDropDown(DROP_YEAR), document.getElementById('format-button'));
        document.getElementById('xlsx_format').insertBefore(createMonthDropDown(DROP_MONTH), document.getElementById('format-button'));
        document.getElementById('xlsx_format').insertBefore(document.createElement('br'), document.getElementById('format-button'));
    }
}

insertDropDown();