Events:Subscribe('Extension:Loaded', function()
  WebUI:Init()
end)

NetEvents:Subscribe('hit', function(damage, isHeadshot)
  if damage <= 0 then
    return
  end
  
  local numberSND = MathUtils:GetRandomInt(1, 163)
  
  WebUI:ExecuteJS('MyGlobalFunction(' .. numberSND .. ');')
  WebUI:ExecuteJS(string.format('addHit(%d, %s)', math.floor(damage), tostring(isHeadshot)))
end)