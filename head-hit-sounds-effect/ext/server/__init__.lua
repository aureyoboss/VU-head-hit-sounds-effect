Hooks:Install('Soldier:Damage', 1, function(hookCtx, soldier, info, giverInfo)
	if giverInfo ~= nil then
      NetEvents:SendToLocal('hit', giverInfo.giver, info.damage, info.boneIndex == 1)
    end

  hookCtx:Pass(soldier, info, giverInfo)
end)