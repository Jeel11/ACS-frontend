function isNotNullOrEmpty(value) {
    return (value != null && value.length > 0);
}

function collectDataFromChildNodes(node) {
    var arr = [];
    var index = 0;
    // start from 1 to skip text node
    for (let i = 1; i < node.childNodes.length; i++) {
        if (isNotNullOrEmpty(node.childNodes[i].value)) {
            arr[index++] = node.childNodes[i].value;
        }
    }
    return arr;
}

function createTariffDropDown(id) {
    var tariffDropDown = document.createElement('select');
    tariffDropDown.id = id;
    var tariffOption1 = document.createElement('option');
    tariffOption1.innerText = HTPI;
    tariffDropDown.appendChild(tariffOption1);
    var tariffOption2 = document.createElement('option');
    tariffOption2.innerText = HTPII;
    tariffDropDown.appendChild(tariffOption2);
    var tariffOption3 = document.createElement('option');
    tariffOption3.innerText = HTPIII;
    tariffDropDown.appendChild(tariffOption3);
    var tariffOption4 = document.createElement('option');
    tariffOption4.innerText = HTPIV;
    tariffDropDown.appendChild(tariffOption4);
    return tariffDropDown;
}

function create_upload_form(elementId) {
    var textNode = null;
    var rateNode = document.createElement('div');
    var rangeNode = document.createElement('div');
    var docType = null;
    switch (elementId) {
        case "demand_charge_upload_button":
            textNode = document.createTextNode("Fill and upload demand charge rates");
            rateNode.appendChild(document.createTextNode("rates: "));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createTextNode("range: "));
            rangeNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createElement('input'));
            docType = DEMAND_CHARGE_DOC;
            break;
        case "energy_charge_upload_button":
            textNode = document.createTextNode("Fill and upload energy charge rates");
            rateNode.appendChild(document.createTextNode("rates: "));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createTextNode("range: "));
            rangeNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createElement('input'));
            docType = ENERGY_CHARGE_DOC;
            break;
        case "fuel_charge_upload_button":
            textNode = document.createTextNode("Fill and upload fuel charge rates");
            rateNode.appendChild(document.createTextNode("rates: "));
            rateNode.appendChild(document.createElement('input'));
            docType = FUEL_CHARGE_DOC;
            break;
        case "night_rebate_upload_button":
            textNode = document.createTextNode("Fill and upload night rebate rate");
            rateNode.appendChild(document.createTextNode("rates: "));
            rateNode.appendChild(document.createElement('input'));
            docType = NIGHT_REBATE_DOC;
            break;
        case "ehv_rebate_upload_button":
            textNode = document.createTextNode("Fill and upload EHV rebate rate");
            rateNode.appendChild(document.createTextNode("rates: "));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createTextNode("range: "));
            rangeNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createElement('input'));
            docType = EHV_REBATE_DOC;
            break;
        case "tou_upload_button":
            textNode = document.createTextNode("Fill and upload TOU rate");
            rateNode.appendChild(document.createTextNode("rates: "));
            rateNode.appendChild(document.createElement('input'));
            rateNode.appendChild(document.createElement('input'));
            rangeNode.appendChild(document.createTextNode("range: "));
            rangeNode.appendChild(document.createElement('input'));
            docType = TOU_DOC;
            break;
        default:
            textNode = document.createTextNode("Invalid");
            break;
    }
    document.getElementById('upload_var_form').appendChild(textNode);
    document.getElementById('upload_var_form').appendChild(document.createElement('br'));
    document.getElementById('upload_var_form').appendChild(rateNode);
    document.getElementById('upload_var_form').appendChild(document.createElement('br'));
    document.getElementById('upload_var_form').appendChild(rangeNode);
    document.getElementById('upload_var_form').appendChild(document.createElement('br'));
    document.getElementById('upload_var_form').appendChild(createYearDropDown(UPLOAD_YEAR));
    document.getElementById('upload_var_form').appendChild(createMonthDropDown(UPLOAD_MONTH));
    document.getElementById('upload_var_form').appendChild(createTariffDropDown(UPLOAD_TARIFF));
    document.getElementById('upload_var_form').appendChild(document.createElement('br'));

    // create upload button
    var uploadButton = document.createElement('button');
    uploadButton.innerHTML = "Upload";
    uploadButton.addEventListener("click", function () {
        let year = document.getElementById(UPLOAD_YEAR).value;
        let month = document.getElementById(UPLOAD_MONTH).value;
        var ymn = year.toString();
        if (month < 10) {
            ymn = ymn + "0";
        }
        ymn = ymn + month.toString();
        var tariff = document.getElementById(UPLOAD_TARIFF).value;

        var rangeArr = collectDataFromChildNodes(rangeNode);
        var rateArr = collectDataFromChildNodes(rateNode);
        var requestObj = { partitions: rangeArr, rates: rateArr };
        const url = server_url + "/acs/v1/update/variable/" + docType + "?ymn=" + ymn + "&tariff=" + tariff;
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', url);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify(requestObj));

        xmlHttp.onload = function () {
            document.getElementById('upload_var_form').innerHTML = xmlHttp.responseText;
        }

        xmlHttp.onerror = function () {
            document.getElementById('upload_var_form').innerHTML = xmlHttp.responseText;
        }
    });
    document.getElementById('upload_var_form').appendChild(uploadButton);
    document.getElementById('upload_var_form').hidden = false;
}

document.getElementById('demand_charge_upload_button').addEventListener("click", function () {
    document.getElementById('upload_var_form').innerHTML = null;
    document.getElementById('upload_var_form').hidden = true;
    create_upload_form("demand_charge_upload_button");
});

document.getElementById('energy_charge_upload_button').addEventListener("click", function () {
    document.getElementById('upload_var_form').innerHTML = null;
    document.getElementById('upload_var_form').hidden = true;
    create_upload_form("energy_charge_upload_button");
});

document.getElementById('fuel_charge_upload_button').addEventListener("click", function () {
    document.getElementById('upload_var_form').innerHTML = null;
    document.getElementById('upload_var_form').hidden = true;
    create_upload_form("fuel_charge_upload_button");
});

document.getElementById('night_rebate_upload_button').addEventListener("click", function () {
    document.getElementById('upload_var_form').innerHTML = null;
    document.getElementById('upload_var_form').hidden = true;
    create_upload_form("night_rebate_upload_button");
});

document.getElementById('ehv_rebate_upload_button').addEventListener("click", function () {
    document.getElementById('upload_var_form').innerHTML = null;
    document.getElementById('upload_var_form').hidden = true;
    create_upload_form("ehv_rebate_upload_button");
});

document.getElementById('tou_upload_button').addEventListener("click", function () {
    document.getElementById('upload_var_form').innerHTML = null;
    document.getElementById('upload_var_form').hidden = true;
    create_upload_form("tou_upload_button");
});
