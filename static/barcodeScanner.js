var openedFrom = -1;
var modal = undefined;

function openScannerModal(listId, fromField) {
    modal = new bootstrap.Modal(document.getElementById("scannerModal"), {});
    modal.toggle();
    openedFrom = listId;
    startBarcodeScanner(fromField);
}

function startBarcodeScanner(fromField) {
    if (!("BarcodeDetector" in window)) {
        console.log("No Barcode Support");
    } else {
        const barcodeDetector = new BarcodeDetector({
            formats: ["ean_13", "ean_8", "upc_a", "upc_e"]
        })
        var interval = 0;
        var found = false;
        const videoPreview = document.getElementById("videoPreview");
        
        // Open Front Camera, but allow other cameras
        navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}}).then(async (videoStream) => {
            videoPreview.srcObject = videoStream;
        });

        // Stop scanning when modal is closed
        var scannerModal = document.getElementById("scannerModal");
        scannerModal.addEventListener("hidden.bs.modal", function() {
            clearInterval(interval);
         });
    
        videoPreview.addEventListener("loadeddata", startScanning);
    
        function startScanning() {
            //console.log("Start");
            clearInterval(interval);
            interval = setInterval(scan, 500);
        }
    
        async function scan() {
            if (!found) {
                //console.log("Scanning...");
                const barcodes = await barcodeDetector.detect(videoPreview);
                if (barcodes.length > 0)  {
                    var barcode = barcodes[0].rawValue
                    //console.log(barcode);
                    found = true;
                    fromField.value = barcode;
                    brocadeSearch(barcode);
                    modal.toggle();
                }
            } else {
                clearInterval(interval);
            }
        }
    }
}