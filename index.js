const express = require('express');
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
            console.error(`Erro ao ler ${file}:`, error);
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
    console.log(`Servidor rodando na porta ${PORT}`);
});
