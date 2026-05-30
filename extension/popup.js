const preview = document.getElementById("preview");
const fileInput = document.getElementById("fileInput");
const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");
const closeBtn = document.getElementById("closeBtn");

let imageBlob = null;


/* ========================= */
/* CLOSE EXTENSION */
/* ========================= */

if(closeBtn){
    closeBtn.addEventListener("click", () => {
        window.close();
    });
}


/* ========================= */
/* LOAD IMAGE FROM RIGHT CLICK */
/* ========================= */

chrome.storage.local.get("imageUrl", async (data) => {

    if(data.imageUrl){

        try{

            preview.src = data.imageUrl;
            preview.style.display = "block";

            const response = await fetch(data.imageUrl);
            imageBlob = await response.blob();

        }
        catch{
            result.innerText = "Failed to load image";
        }

    }

});


/* ========================= */
/* UPLOAD IMAGE FROM COMPUTER */
/* ========================= */

if(fileInput){

    fileInput.addEventListener("change", () => {

        const file = fileInput.files[0];

        if(file){

            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";

            imageBlob = file;

        }

    });

}


/* ========================= */
/* CHECK IMAGE */
/* ========================= */

checkBtn.addEventListener("click", async () => {

    if(!imageBlob){

        alert("Select image first");
        return;

    }

    result.innerText = "Analyzing...";
    checkBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", imageBlob);

    try{

        const response = await fetch("http://127.0.0.1:5001/predict", {

            method:"POST",
            body:formData

        });

        const data = await response.json();

        result.innerText =
            data.result + " (" + data.confidence + "%)";

        resetBtn.style.display = "block";

    }
    catch{

        result.innerText = "Backend connection error";

    }

    checkBtn.disabled = false;

});


/* ========================= */
/* RESET */
/* ========================= */

resetBtn.addEventListener("click", () => {

    preview.src = "";
    preview.style.display = "none";

    result.innerText = "";

    if(fileInput){
        fileInput.value = "";
    }

    imageBlob = null;

    resetBtn.style.display = "none";

    chrome.storage.local.remove("imageUrl");

});