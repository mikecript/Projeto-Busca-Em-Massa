🚀 Guia Divertido para Implementar o Sistema de Busca de Boletins Internos!
Bem-vindo ao seu guia divertido para colocar em funcionamento o sistema de busca de boletins internos! Vamos fazer isso juntos. 🌟

🎉 O que você vai precisar:

Node.js: Para rodar o seu servidor.
NPM: Que vem com o Node.js para gerenciar as dependências.
PM2: Para gerenciar o seu servidor Node.js.
Xpdf Tools: Para manipulação de arquivos PDF (caso você precise de uma ferramenta adicional).


🚀 Passo a Passo para a Instalação


1. Instalar o Node.js
Acesse o site oficial do Node.js.
Baixe a versão LTS (Long Term Support) para o seu sistema operacional (Windows, macOS ou Linux).
Siga as instruções de instalação.



2. Verifique a Instalação do Node.js e NPM
Abra o terminal ou o prompt de comando e digite:


node -v
npm -v
Se as versões aparecerem, você está pronto para continuar! 🎉



3. Instalar o PM2
No terminal ou prompt de comando, digite:


npm install -g pm2. se não funcionar digite: npm install -g pm2

Isso instalará o PM2 globalmente, permitindo que você gerencie seus aplicativos Node.js com facilidade! 🛠️



4. Instalar as Dependências do Projeto

Crie uma nova pasta para o projeto e navegue até ela no terminal:

npm init -y

Agora, instale as dependências necessárias:

npm install express mammoth pdf-parse


5. Baixar o Xpdf Tools
Acesse o site do Xpdf Tools.
Baixe a versão adequada para o seu sistema operacional.
Extraia os arquivos em uma pasta acessível.


6. Estruturar o Projeto
Crie as pastas necessárias:


mkdir public documentos
Coloque os arquivos index.js, index.html, styles.css, e outros arquivos que você mencionou anteriormente nas respectivas pastas.



8. Iniciar o Servidor
Dê um duplo clique no arquivo start-server.bat que você criou. Isso abrirá o servidor! 🚀


9. Acesse a Aplicação
Abra o navegador e vá para http://localhost:3000/. Você deverá ver sua aplicação funcionando! 🎊


🎉 Conclusão


Parabéns! Você configurou com sucesso o sistema de busca de boletins internos em sua máquina! Agora, você pode compartilhar este guia com outras pessoas para que elas possam fazer o mesmo.

Se você encontrar algum erro ou tiver dúvidas, não hesite em perguntar! Boa sorte com seu projeto! 🌟















#####################################################################################################







index.html: <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Busca de Boletins Internos - HMAPA (1995 á 2024)</title>
</head>
<body>
    <div class="container">
        <h1>Busca de Boletins Internos - HMAPA (1995 á 2024)</h1>
        <input type="text" id="searchTerm" placeholder="Digite o nome do militar">
        <button id="searchBtn">Buscar</button>
        <div id="results"></div>
    </div>
    <script>
        document.getElementById('searchBtn').addEventListener('click', async () => {
            const searchTerm = document.getElementById('searchTerm').value;
            const response = await fetch(/search?term=${encodeURIComponent(searchTerm)});
            const results = await response.json();

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            results.forEach(result => {
                const p = document.createElement('p');
                p.textContent = result;
                resultsDiv.appendChild(p);
            });
        });
    </script>
</body>
</html>  index.js: const express = require('express');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Função para encontrar arquivos por extensão recursivamente
function findFilesByExtension(directory, extension) {
    return fs.readdirSync(directory).flatMap(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            return findFilesByExtension(fullPath, extension); // Chamada recursiva para subpastas
        }
        return file.endsWith(extension) ? [fullPath] : [];
    });
}

// Rota para realizar a busca
app.get('/search', async (req, res) => {
    const searchTerm = req.query.term || '';
    const pdfFiles = findFilesByExtension(path.join(__dirname, 'documentos'), '.pdf');
    const docxFiles = findFilesByExtension(path.join(__dirname, 'documentos'), '.docx');

    let foundFiles = [];
    const results = [];

    // Função para buscar em arquivos PDF
    for (const file of pdfFiles) {
        const dataBuffer = fs.readFileSync(file);
        const data = await pdf(dataBuffer);
        if (data.text.includes(searchTerm)) {
            foundFiles.push(file);
        }
    }

    // Função para buscar em arquivos DOCX
    for (const file of docxFiles) {
        try {
            const { value } = await mammoth.convertToPlainText({ path: file });
            if (value.includes(searchTerm)) {
                foundFiles.push(file);
            }
        } catch (error) {
            console.error(Erro ao ler ${file}:, error);
        }
    }

    // Preparar resultados para resposta
    if (foundFiles.length === 0) {
        results.push('Nenhum arquivo encontrado com o termo desejado.');
    } else {
        results.push('Arquivos encontrados:');
        foundFiles.forEach(file => results.push(file));
    }

    res.json(results);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(Servidor rodando na porta ${PORT});
}); package.json: {
  "name": "busca-militar",
  "version": "1.0.0",
  "main": "script.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.21.0",
    "mammoth": "^1.8.0",
    "pdf-parse": "^1.1.1"
  }
}
script.js: document.getElementById('searchBtn').addEventListener('click', function() {
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
    listItem.textContent = Nome "${searchName}" encontrado no arquivo: ${fileName};
    resultList.appendChild(listItem);
} .bat: @echo off
echo Iniciando o servidor...

:: Inicia o servidor usando npx e PM2
start cmd /k "npx pm2 restart busca-militar || npx pm2 start C:\Users\SALA450\Desktop\busca-militar\index.js --name busca-militar"

:: Espera alguns segundos para garantir que o servidor esteja pronto
timeout /t 5

:: Abre a URL do servidor no navegador padrão
start "" "http://localhost:3000/"
faça um passo á passo de como implementar esse sistema em outro pc para outras pessoas terem acesso também, tipo oque tenho que baixar, quais dependencias, como baixo o Xpdf Tools, todas as dependencias do projeto, como baixo e utilizo o PM2, ou seja crie um passo a passo bem gráfico e divertido de como fazer esse projeto rodar em qualquer máquina, faça um TXT apenas com todos os passo a passo 