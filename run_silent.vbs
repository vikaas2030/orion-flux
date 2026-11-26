Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c ""cd /d ""d:\ANTIGRAVITY VK\orion-flux\server"" && ""C:\Users\ASUS\AppData\Roaming\Antigravity\bin\agy-node.cmd"" app.js >> ""d:\ANTIGRAVITY VK\orion-flux\server.log"" 2>&1""", 0, False
