@echo off
echo Iniciando o servidor...

:: Inicia o servidor usando npx e PM2
start cmd /k "npx pm2 restart busca-militar || npx pm2 start C:\Users\SALA450\Desktop\busca-militar\index.js --name busca-militar"

:: Espera alguns segundos para garantir que o servidor esteja pronto
timeout /t 5

:: Abre a URL do servidor no navegador padrão
start "" "http://localhost:3000/"
