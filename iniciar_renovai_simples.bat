
@echo off
setlocal

REM Caminho do projeto (a própria pasta onde o .bat está)
set "PROJETO=%~dp0"

echo ----------------------------------------
echo INICIANDO RENOVAI COMPLETO (Simples e Funcional)
echo ----------------------------------------

REM Abre o VS Code no projeto
echo Abrindo o VS Code...
start "" code "%PROJETO%"

REM Aguarda 2 segundos para garantir que VS Code inicie
timeout /t 2 /nobreak >nul

REM Compila o projeto com Maven
echo Compilando o projeto...
cd /d "%PROJETO%"
mvn clean install

IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao compilar.
    pause
    exit /b
)

REM Inicia o servidor em nova janela
echo Iniciando o servidor...
start cmd /k "cd /d %PROJETO% && mvn exec:java"

REM Aguarda e abre o navegador
timeout /t 3 /nobreak >nul
start "" "%PROJETO%\frontend\index.html"

echo ----------------------------------------
echo RenovAI rodando! Aproveite 🌱
pause
