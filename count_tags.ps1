$f = Get-Content "frontend\src\pages\AdminPanel.jsx" -Raw
$opens  = ([regex]::Matches($f, '<div[\s>]')).Count
$closes = ([regex]::Matches($f, '</div>')).Count
$mopen  = ([regex]::Matches($f, '<main[\s>]')).Count
$mclose = ([regex]::Matches($f, '</main>')).Count
Write-Host "div open=$opens  div close=$closes  |  main open=$mopen  main close=$mclose"
