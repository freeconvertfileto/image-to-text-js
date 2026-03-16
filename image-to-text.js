(function () {
    'use strict';

    var dropZone = document.getElementById('ittDropZone');
    var selectBtn = document.getElementById('ittSelectBtn');
    var fileInput = document.getElementById('ittFileInput');
    var settings = document.getElementById('ittSettings');
    var preview = document.getElementById('ittPreview');
    var langSelect = document.getElementById('ittLang');
    var extractBtn = document.getElementById('ittExtractBtn');
    var progressDiv = document.getElementById('ittProgress');
    var progressFill = document.getElementById('ittProgressFill');
    var progressText = document.getElementById('ittProgressText');
    var resultDiv = document.getElementById('ittResult');
    var wordCountEl = document.getElementById('ittWordCount');
    var copyBtn = document.getElementById('ittCopyBtn');
    var downloadBtn = document.getElementById('ittDownloadBtn');
    var resetBtn = document.getElementById('ittResetBtn');
    var output = document.getElementById('ittOutput');

    var currentFile = null;

    selectBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
            loadFile(fileInput.files[0]);
        }
    });

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function () {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        var file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadFile(file);
        }
    });

    function loadFile(file) {
        currentFile = file;
        var reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
        dropZone.style.display = 'none';
        settings.style.display = 'flex';
        resultDiv.style.display = 'none';
        progressDiv.style.display = 'none';
    }

    extractBtn.addEventListener('click', function () {
        if (!currentFile) return;
        settings.style.display = 'none';
        progressDiv.style.display = 'block';
        progressFill.style.width = '0%';

        var lang = langSelect.value;

        if (typeof Tesseract === 'undefined') {
            progressText.textContent = 'Tesseract.js not loaded.';
            return;
        }

        Tesseract.recognize(currentFile, lang, {
            logger: function (m) {
                if (m.status === 'recognizing text') {
                    var pct = Math.round((m.progress || 0) * 100);
                    progressFill.style.width = pct + '%';
                    progressText.textContent = 'Recognizing... ' + pct + '%';
                }
            }
        }).then(function (result) {
            var text = result.data.text.trim();
            output.value = text;
            var words = text.split(/\s+/).filter(function (w) { return w.length > 0; });
            wordCountEl.textContent = words.length + ' words, ' + text.length + ' characters';
            progressDiv.style.display = 'none';
            resultDiv.style.display = 'flex';
        }).catch(function (err) {
            progressText.textContent = 'Error: ' + err.message;
        });
    });

    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(output.value).then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = copyBtn.dataset.label || 'Copy'; }, 2000);
        });
    });

    downloadBtn.addEventListener('click', function () {
        var blob = new Blob([output.value], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-text.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    resetBtn.addEventListener('click', function () {
        currentFile = null;
        fileInput.value = '';
        preview.src = '';
        output.value = '';
        resultDiv.style.display = 'none';
        progressDiv.style.display = 'none';
        settings.style.display = 'none';
        dropZone.style.display = 'flex';
    });
}());
