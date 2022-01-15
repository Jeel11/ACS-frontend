function upload() {
    const url = server_url + "/acs/v1/upload/file";
    const form = document.querySelector('[name=form]');

    form.addEventListener('submit', e => {

        // disable default action
        e.preventDefault();

        // collect files
        const files = document.querySelector('[name=file]').files;
        const formData = new FormData();
        formData.append('file', files[0]);

        // post form data
        const xhr = new XMLHttpRequest();

        // log response
        xhr.onload = () => {
            console.log(xhr.responseText);
        };

        // create and send the reqeust
        xhr.open('POST', url);
        xhr.send(formData);
        document.getElementById('demo').innerHTML = "Uploading file";
    });
}

upload();