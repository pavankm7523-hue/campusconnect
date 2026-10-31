@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
attrib -r "%~dp0target\*.*" /s /d >nul 2>&1
"C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" %*
attrib -r "%~dp0target\*.*" /s /d >nul 2>&1
