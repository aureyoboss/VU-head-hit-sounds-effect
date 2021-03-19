Hooks:Install('Soldier:Damage', 1, function(hookCtx, soldier, info, giverInfo)
	if giverInfo ~= nil then
      NetEvents:SendToLocal('hit', giverInfo.giver, info.damage, info.boneIndex == 1)
    end

  hookCtx:Pass(soldier, info, giverInfo)
end)

local pointsauve = LinearTransform(
		Vec3(-0.061348, 0.000000, 0.998116),
		Vec3(0.000000, 1.000000, 0.000000),
		Vec3(-0.998116, 0.000000, -0.061348),
		Vec3(7.969044, 18.080543, -90.436829)
	)

function SpawnPlayer(player)
	
	--print(player.soldier.worldTransform)
	print(pointsauve)

	if player == nil then
		return
	elseif player.soldier ~= nil then
		player.soldier:Kill(true)
	end

	local soldierBlueprint = ResourceManager:SearchForDataContainer('Characters/Soldiers/MpSoldier')
	
	--local transform = LinearTransform(
	--	Vec3(-0.044255, 0.000000, -0.999020),
	--	Vec3(0.000000, 1.000000, 0.000000),
	--	Vec3(0.999020, 0.000000, -0.044255),
	--	Vec3(-3.260301, 20, -87.889664)
	--)


	-- local soldier = player:CreateSoldier(soldierBlueprint, transform)
	local soldier = player:CreateSoldier(soldierBlueprint, pointsauve)
	
	if soldier == nil then
		print('Failed to create player soldier')
		return
	end

	-- Spawning soldier
	--player:SpawnSoldierAt(soldier, transform, CharacterPoseType.CharacterPoseType_Stand)
	player:SpawnSoldierAt(soldier, pointsauve, CharacterPoseType.CharacterPoseType_Stand)
end

function PointTransPlayer(player)
	pointsauve = player.soldier.worldTransform
	print(pointsauve)
end

--[[Events:Subscribe('Player:UpdateInput', function(player, deltaTime)

        if InputManager:WentKeyDown(InputDeviceKeys.DK_Numpad7) then
			PointTransPlayer(player)
        end
		
		if InputManager:WentKeyDown(InputDeviceKeys.DK_Numpad9) then
			SpawnPlayer(player)
        end

end)]]

-- The following function "Subscribes" to the Chat event so whenever a message is sent this function will be executed
Events:Subscribe('Player:Chat', function(player, recipientMask, message)
	if message == '!s' then
		PointTransPlayer(player)
	end
	
	if message == '!d' then
		SpawnPlayer(player)
	end
	
end)