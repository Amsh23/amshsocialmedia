#!/bin/bash
# Script to add digital signature and copyright protection to batch files
# Created by Amir Shirkhodaee

echo "========================================================"
echo "    Batch File Digital Signature & Copyright Tool"
echo "    Copyright © 2025 Amir Shirkhodaee"
echo "========================================================"
echo

# Check if the filename is provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <filename.bat> <script_type>"
    echo "Where script_type is one of: app_mover, cleanup, generic"
    exit 1
fi

FILENAME=$1
SCRIPT_TYPE=$2

# Check if file exists
if [ -f "$FILENAME" ]; then
    echo "File already exists. Creating backup..."
    cp "$FILENAME" "${FILENAME}.bak"
fi

# Set proper title and checksums based on script type
case $SCRIPT_TYPE in
    app_mover)
        TITLE="Application Mover"
        SIGNATURE="AmirShirkhodaee-AppMover-v1.0-2025"
        CHECKSUM="B32F7A9C8E45D01"
        ;;
    cleanup)
        TITLE="System Cleanup"
        SIGNATURE="AmirShirkhodaee-CleanupSystem-v1.0-2025"
        CHECKSUM="F45E82C19D376A0"
        ;;
    generic)
        TITLE="System Utility"
        SIGNATURE="AmirShirkhodaee-SystemUtility-v1.0-2025"
        CHECKSUM="821A937B4F23D976"
        ;;
    *)
        echo "Invalid script type. Use one of: app_mover, cleanup, generic"
        exit 1
        ;;
esac

# Create the header
cat > "$FILENAME" << EOF
@echo off
setlocal enabledelayedexpansion
color 0A
title $TITLE by Amir Shirkhodaee

:: ========================================================================
:: ===                  DIGITAL SIGNATURE AND COPYRIGHT                 ===
:: ========================================================================
::
::    ▄▄▄      ███▄ ▄███▓ ██▓ ██▀███      ▄████▄   ▒█████  ▓█████▄ ▓█████ 
::   ▒████▄   ▓██▒▀█▀ ██▒▓██▒▓██ ▒ ██▒   ▒██▀ ▀█  ▒██▒  ██▒▒██▀ ██▌▓█   ▀ 
::   ▒██  ▀█▄ ▓██    ▓██░▒██▒▓██ ░▄█ ▒   ▒▓█    ▄ ▒██░  ██▒░██   █▌▒███   
::   ░██▄▄▄▄██▒██    ▒██ ░██░▒██▀▀█▄     ▒▓▓▄ ▄██▒▒██   ██░░▓█▄   ▌▒▓█  ▄ 
::    ▓█   ▓██▒██▒   ░██▒░██░░██▓ ▒██▒   ▒ ▓███▀ ░░ ████▓▒░░▒████▓ ░▒████▒
::    ▒▒   ▓▒█░ ▒░   ░  ░░▓  ░ ▒▓ ░▒▓░   ░ ░▒ ▒  ░░ ▒░▒░▒░  ▒▒▓  ▒ ░░ ▒░ ░
::     ▒   ▒▒ ░  ░      ░ ▒ ░  ░▒ ░ ▒░     ░  ▒     ░ ▒ ▒░  ░ ▒  ▒  ░ ░  ░
::     ░   ▒  ░      ░    ▒ ░  ░░   ░    ░        ░ ░ ░ ▒   ░ ░  ░    ░   
::         ░  ░      ░    ░     ░        ░ ░          ░ ░     ░       ░  ░
::                                       ░                  ░             
::
:: ========================================================================
::                $TITLE Tool v1.0 (June 2025)
::                Copyright © 2025 Amir Shirkhodaee
::                   https://github.com/Amsh23
:: ========================================================================
::
:: TERMS OF USE:
:: 1. This script is free for personal use only
:: 2. Commercial use requires written permission
:: 3. Distribution must include this attribution notice intact
:: 4. Modifications must be clearly marked as such
::
:: WARNING: Unauthorized removal of this notice is prohibited
:: ========================================================================

:: Integrity check (DO NOT MODIFY THIS SECTION)
set "signature=$SIGNATURE"
set "checksum=$CHECKSUM"
if not "%signature%-%checksum%"=="$SIGNATURE-$CHECKSUM" (
    echo WARNING: This script has been modified from its original version!
    echo Original author: Amir Shirkhodaee (https://github.com/Amsh23)
    echo.
    timeout /t 3 >nul
)

echo ================================================
echo    $TITLE Tool by Amir Shirkhodaee    
echo ================================================
echo.
timeout /t 2 >nul

:: Check for administrative privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script requires Administrator access.
    echo Please run this file with Administrator privileges.
    pause
    exit /b 1
)

:: SCRIPT CONTENT BEGINS BELOW THIS LINE
:: ========================================================================

REM Your script content goes here


EOF

# Create the footer
cat >> "$FILENAME" << EOF

:: ========================================================================
:: End of script
:: Copyright © 2025 Amir Shirkhodaee (https://github.com/Amsh23)
:: ========================================================================

echo.
echo ------------------------------------------------
echo Thank you for using $TITLE Tool v1.0
echo Copyright © 2025 Amir Shirkhodaee
echo ------------------------------------------------
pause
exit /b 0
EOF

echo "Created $FILENAME with digital signature and copyright protection."
echo "Script type: $SCRIPT_TYPE"
echo
echo "You can now edit the file to add your script content between the header and footer."
echo "Make sure to preserve the digital signature and copyright notices."
