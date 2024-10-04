document.getElementById('searchBtn').addEventListener('click', function() {
    const files = document.getElementById('fileInput').files;
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = ''; // Limpar resultados anteriores

    if (!files.length || !searchName) {
        alert('Selecione arquivos e insira um nome para buscar.');
        return;
    }

    // Processar cada arquivo selecionado
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'pdf') {
            reader.onload = function(e) {
                // Processar PDF usando PDF.js
                const typedarray = new Uint8Array(e.target.result);
                pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                    let pagesPromises = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        pagesPromises.push(pdf.getPage(i).then(page => {
                            return page.getTextContent().then(textContent => {
                                let text = textContent.items.map(item => item.str).join(" ");
                                if (text.toLowerCase().includes(searchName)) {
                                    appendResult(file.name, searchName);
                                }
                            });
                        }));
                    }
                    return Promise.all(pagesPromises);
                });
            };
            reader.readAsArrayBuffer(file);

        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            reader.onload = function(e) {
                mammoth.extractRawText({ arrayBuffer: e.target.result })
                    .then(result => {
                        let text = result.value.toLowerCase();
                        if (text.includes(searchName)) {
                            appendResult(file.name, searchName);
                        }
                    });
            };
            reader.readAsArrayBuffer(file);
        }
    });
});

// Função auxiliar para exibir os resultados na interface
function appendResult(fileName, searchName) {
    const resultList = document.getElementById('resultList');
    const listItem = document.createElement('li');
    listItem.textContent = `Nome "${searchName}" encontrado no arquivo: ${fileName}`;
    resultList.appendChild(listItem);
}
