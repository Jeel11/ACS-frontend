var serverStatus = false;
function checkServerStatus() {
    const url = file_formatter_endpoint + "/check-status";
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', url);
    xmlHttpRequest.send(null);
    xmlHttpRequest.onload = function() {
        serverStatus = true;
        document.getElementById("server_status").innerText = this.responseText;
        document.getElementById("kill_button").hidden = false;
    }
    xmlHttpRequest.onerror = function() {
        document.getElementById("server_status").innerText = "Please start the server first and refresh this page";
        serverStatus = false;
    }
    xmlHttpRequest.onabort = function() {
        document.getElementById("server_status").innerText = "Please start the server first and refresh this page";
        serverStatus = false;
    }
}

checkServerStatus();

function createParagraph(text) {
    var para = document.createElement("p");
    para.value = text;
    return para;
}

const xlsx_form = document.getElementById("xlsx_format");
xlsx_form.addEventListener("submit", e => {
    e.preventDefault();
    onClickFormatButton();
});
function onClickFormatButton() {
    if(serverStatus==false) {
        alert("Server is not running!");
        return;
    }
    const file_path_element = document.getElementById("input_path");
    if (file_path_element.value==null || file_path_element.value=="") {
        alert("Input file path cannot be null!");
        return;
    }
    const arr = file_path_element.value.split(".");
    if (arr[arr.length - 1].localeCompare("xlsx") != 0 && arr[arr.length - 1].localeCompare("xls") != 0) {
        alert("Invalid input file path. Only \"xlsx\" or \"xls\" file can be given as input.");
        return;
    }
    // Create request payload & POST to the server.
    requestData = {};
    requestData["inputFilePath"] = file_path_element.value;
    year = document.getElementById(DROP_YEAR).value;
    month = document.getElementById(DROP_MONTH).value;
    ymn = year.toString();
    if (month < 10) {
        ymn = ymn + "0";
    }
    ymn = ymn + month.toString();
    requestData["ymn"] = ymn;
    requestData["fileType"] = document.getElementById("file_type").value;
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState==4) {
            console.log("Done");
            document.getElementById("loading_gif").style.display = "none";
            document.getElementById("xlsx_format").hidden = false;
            alert("Formatted file is saved as output.xlsx");
        }
    }

    const url = file_formatter_endpoint + "/file-format";
    xmlHttpRequest.open('POST', url);
    xmlHttpRequest.setRequestHeader("content-type", "application/json");
    requestData = JSON.stringify(requestData);
    xmlHttpRequest.send(requestData);

    document.getElementById("xlsx_format").hidden = true;
    document.getElementById("loading_gif").style.display = "block";

    xmlHttpRequest.onerror = function() {
        document.getElementById("loading_gif").style.display = "none";
        document.getElementById("xlsx_format").hidden = false;
        alert("Error formatting the file!");
        return;
    }

    xmlHttpRequest.onabort = function() {
        document.getElementById("loading_gif").style.display = "none";
        document.getElementById("xlsx_format").hidden = false;
        alert("Error formatting the file!");
        return;
    }

    return;
}

const kill_button = document.getElementById("kill_button");
kill_button.addEventListener("click", e => {
    e.preventDefault();
    onKillButtonPressed();
});

function onKillButtonPressed() {
    const url = file_formatter_endpoint + "/close-server";
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', url);
    xmlHttpRequest.send(null);

    xmlHttpRequest.onload = function() {
        document.getElementById("server_status").innerText = "Please start the server first and refresh this page";
        document.getElementById("kill_button").hidden = true;
    }
    xmlHttpRequest.onerror = function() {
        document.getElementById("server_status").innerText = "Please start the server first and refresh this page";
        document.getElementById("kill_button").hidden = true;
    }
    xmlHttpRequest.onabort = function() {
        document.getElementById("server_status").innerText = "Please start the server first and refresh this page";
        document.getElementById("kill_button").hidden = true;
    }
}