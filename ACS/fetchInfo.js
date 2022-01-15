const mapToObj = m => {
    return Array.from(m).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
};
function readBillTable(node) {
    var tableMap = {};
    for (var i = 0; i < node.childNodes.length; i++) {
        tableMap[node.childNodes[i].childNodes[0].innerText] = node.childNodes[i].childNodes[1].innerText;
        // tableMap.set(node.childNodes[i].childNodes[0].innerText, node.childNodes[i].childNodes[1].innerText);
    }
    return JSON.stringify(tableMap);
}
function fetchInfo() {
    var calculateButton = document.createElement('button');
    calculateButton.textContent = "Calculate Bill"
    const xmlHttp = new XMLHttpRequest();
    const form = document.querySelector('[name=search-form]');
    form.addEventListener('submit', e => {
        e.preventDefault();

        let consumerId = document.getElementById('consumerId').value;
        let year = document.getElementById(DROP_YEAR).value;
        let month = document.getElementById(DROP_MONTH).value;
        var ymn = year.toString();
        if (month < 10) {
            ymn = ymn + "0";
        }
        ymn = ymn + month.toString();

        xmlHttp.onload = function () {
            document.getElementById('loader').hidden = true;
            const myObj = JSON.parse(this.responseText);
            var bill = document.createElement('table');
            bill.border = 1;
            bill.id = "bill";
            for (let x in myObj) {
                var rowNode = document.createElement('tr');
                var td1 = document.createElement('td');
                td1.innerText = x;
                var td2 = document.createElement('td');
                td2.innerText = myObj[x];
                td2.contentEditable = true;
                rowNode.appendChild(td1);
                rowNode.appendChild(td2);
                bill.appendChild(rowNode);
            }
            document.getElementById('bill_table').innerHTML = null;
            document.getElementById('bill_table').appendChild(bill);
            document.getElementById('bill_detail').hidden = false;

            calculateButton.addEventListener("click", function () {
                const calculateUrl = server_url + '/acs/v1/bill/calculate?id=' + consumerId + "&ymn=" + ymn;
                var postData = readBillTable(document.getElementById('bill'));
                const calculateHTTPRequest = new XMLHttpRequest();
                calculateHTTPRequest.open('POST', calculateUrl);
                calculateHTTPRequest.setRequestHeader("Content-Type", "application/json");
                calculateHTTPRequest.send(postData);

                calculateHTTPRequest.onload = function () {
                    document.getElementById('bill_summary_table').hidden = true;
                    const billSummary = JSON.parse(this.responseText);
                    let text = '<table border="1" >'
                    for (let x in billSummary) {
                        text += "<tr><td>" + x + "</td><td>" + billSummary[x] + "</td></tr > ";
                    }
                    text += "</table>"
                    document.getElementById('bill_summary_table').innerHTML = text;
                    document.getElementById('bill_summary_table').hidden = false;
                }

                calculateHTTPRequest.onerror = function () {
                    document.getElementById('bill_summary_table').hidden = true;
                    document.getElementById('bill_summary_table').innerText = "Error";
                    document.getElementById('bill_summary_table').hidden = false;
                }

                calculateHTTPRequest.onabort = function () {
                    document.getElementById('bill_summary_table').hidden = true;
                    document.getElementById('bill_summary_table').innerText = "Timeout";
                    document.getElementById('bill_summary_table').hidden = false;
                }
            });

            document.getElementById('calc_button').innerHTML = null;
            document.getElementById('calc_button').appendChild(calculateButton);
        }

        const url = server_url+ '/acs/v1/fetch/info?id=' + consumerId + '&ymn=' + ymn;
        xmlHttp.open('GET', url);
        xmlHttp.setRequestHeader('Access-Control-Allow-Origin', 'true');
        xmlHttp.send();

        document.getElementById('bill_detail').hidden = true;
        document.getElementById('bill_summary_table').hidden = true;
        document.getElementById('loader').hidden = false;

        xmlHttp.onerror = function () {
            document.getElementById('loader').hidden = true;
            let error_text = "No data found for consumerId: " + consumerId + ", YMN: " + ymn;
            document.getElementById('bill_table').innerText = error_text;
            document.getElementById('bill_detail').hidden = false;
        }

        xmlHttp.ontimeout = function () {
            document.getElementById('loader').hidden = true;
            document.getElementById('bill_table').innerText = "Timeout";
            document.getElementById('bill_detail').hidden = false;
        }
	})
}

fetchInfo();
