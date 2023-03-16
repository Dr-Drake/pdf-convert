/** Elements */
const fileInput = document.getElementById('inputGroupFile03');
const button = document.getElementById('cbtn');
const inputImage = document.getElementById('i-img');
const spinner = document.getElementById('l-spinner');
const linkDiv = document.getElementById('link-view');

/** Variables */
const maxFileSize = (1024 * 1024) * 8; // 8MB
let selectedFile;

/** Helper functions */
function displayFileLink(url) {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = selectedFile.name.replace(/\.[^/.]+$/, '.txt');

    const iconContainer = document.createElement('div');
    iconContainer.setAttribute('class', 'd-flex flex-column align-items-center');

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fas fa-file-arrow-down');
    icon.setAttribute('style', 'font-size: 5rem;');

    const fileTextElement = document.createElement('p');
    fileTextElement.innerText = selectedFile.name.replace(/\.[^/.]+$/, '.txt');

    // Add the download link to the display
    iconContainer.appendChild(icon);
    iconContainer.appendChild(fileTextElement);
    downloadLink.append(iconContainer);
    linkDiv.append(downloadLink);
}

function clearFileLink() {
    linkDiv.innerHTML = '';
}


/**
 * On Change event listener for the input
 */

fileInput.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    selectedFile = file;

    if (file) {
        console.log(file.size, "-", maxFileSize);
        if (file.size > maxFileSize) {
            alert("File is too big. Maximum file size allowed is 8MB.");
            fileInput.value = ""; // clear the selected file
            return;
        }
        clearFileLink();
        button.removeAttribute('disabled');
    }
});

/**
 * Click event listener for button
 * Note: We aren't using progress bar at this moment
 */
button.addEventListener('click', () => {

    /** Set button spinner, and disable button */
    spinner.classList.remove('d-none');
    button.setAttribute('disabled', '');

    /** Send POST request */
    const form = new FormData();
    console.log(selectedFile);
    form.append('file', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/convert?type=text');
    xhr.responseType = 'blob'; // Set the response type to 'blob' to receive a binary response
    xhr.send(form);
    
    // Set up load event listener
    xhr.onload = () => {

        if (xhr.status === 200) {

            /** Stop loading spinner and disable button */
            spinner.classList.add('d-none');

            // Create a URL for the blob response
            const url = window.URL.createObjectURL(xhr.response);

            // Display File download link to div
            displayFileLink(url);
            
        }
        else{
            xhr.responseType = 'string';
            spinner.classList.add('d-none');
            const response = JSON.parse(xhr.responseText);
            window.alert(response.message);
            button.removeAttribute('disabled');
        }
    };
    
});
