const server_url = "http://localhost:5000";
function upload() {
    const url = server_url + "/acs/v1/upload/file";
    const form = document.querySelector('[name=form]');

    form.addEventListener('submit', e => {

        // disable default action
        e.preventDefault();

        // collect files
        const files = document.querySelector('[name=file]').files;
        if (files.length == 0) {
            document.getElementById('file_upload_status').innerHTML = "Please select file to upload";
            return;
        }
        var file = files[0];
        const arr = file.name.split(".");
        if (arr[arr.length - 1].localeCompare("xlsx") != 0 && arr[arr.length - 1].localeCompare("xls") != 0) {
            document.getElementById('file_upload_status').innerHTML = "Please select Excel file only";
            return;
        }
        const formData = new FormData();
        formData.append('file', files[0]);
        // post form data
        const xhr = new XMLHttpRequest();

        // log response
        xhr.onload = () => {
            console.log(xhr.responseText);
            document.getElementById('file_upload_status').innerHTML = xhr.responseText;
            document.getElementById('loader').hidden = true;
        };

        xhr.onerror = () => {
            console.log(xhr.responseText);
            document.getElementById('file_upload_status').innerHTML = xhr.responseText;
            document.getElementById('loader').hidden = true;
        };

        // create and send the reqeust
        xhr.open('POST', url);
        xhr.send(formData);
        document.getElementById('loader').hidden = false;
    });
}

upload();