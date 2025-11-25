import { world, system, ItemStack, StructureSaveMode, EntityComponentTypes} from "@minecraft/server";

world.afterEvents.itemUse.subscribe((item) => {
    const dragonOrbItems = [
        "dmss:dragon_orb_mystic",
        "dmss:dragon_orb_cherry"
    ];
    if(dragonOrbItems.includes(item.itemStack.typeId)){
      if(item.itemStack.getLore().length > 0)
      {
        for(let q = 0; q < item.itemStack.getLore().length; q++)
        {
          if(item.itemStack.getLore()[q].includes(`§r§bDragon orb ID: `))
          {
            let structureId = item.itemStack.getLore()[q].replace(`§r§bDragon orb ID: `, '')
            if(item.source.getBlockFromViewDirection({maxDistance:10}) != null)
            {
              let adjustedPosition = {x:item.source.getBlockFromViewDirection({maxDistance:10}).block.location.x,y:item.source.getBlockFromViewDirection({maxDistance:10}).block.location.y+2,z:item.source.getBlockFromViewDirection({maxDistance:10}).block.location.z}

              world.structureManager.place(`dmss:${structureId}`,item.source.dimension,adjustedPosition,{includeBlocks:false,includeEntities:true})
              world.structureManager.delete(`dmss:${structureId}`)
              if(item.source.getComponent('equippable').getEquipment('Mainhand') != null){item.source.getComponent('equippable').setEquipment('Mainhand',null)}
              item.source.runCommandAsync(`particle dragonmounts:smoke ${adjustedPosition.x} ${adjustedPosition.y} ${adjustedPosition.z}`)
              item.source.runCommandAsync(`playsound custom.dragon_orb @s ${adjustedPosition.x} ${adjustedPosition.y} ${adjustedPosition.z}`)
              item.source.dimension.spawnItem(new ItemStack('dmss:dragon_orb', 1), adjustedPosition);
              player.runCommandAsync(`playsound custom.dragon_orb @s ${x} ${y} ${z}`)

            }
            else
            {
              item.source.sendMessage('§cNot a valid location to summon')
            }
          }
        }
      }
    }
  })

world.beforeEvents.playerInteractWithEntity.subscribe(ev => {
  if (ev.itemStack?.typeId.includes("dmss:dragon_orb")) {
    ev.cancel = true;
    system.run(() => handleDragonOrbUse(ev.player, ev.itemStack, ev.target));
  }
});

function handleDragonOrbUse(player, item, entity) {
  if (!item || !entity) return;
  if (item.typeId.includes("dmss:dragon_orb")) {
        let typeId = entity.typeId;
        let family = entity.getComponent(EntityComponentTypes.TypeFamily);
        if (family && family.hasTypeFamily("dragon") && !family.hasTypeFamily("egg") && !family.hasTypeFamily("corpse")&& !family.hasTypeFamily("dragon_egg")){
          let isTamed = entity.hasComponent('minecraft:is_tamed');
          if (isTamed){
            const dropMap = {
              "dmss:cherry_dragon": "dmss:dragon_orb_cherry"
            };
            let orbID = Math.round(Math.random()*99999) 
            let dropItemId = dropMap[typeId] ?? "dmss:dragon_orb_mystic";
            let dragon_orb = new ItemStack(dropItemId,1)
            let dragonName = entity.nameTag;
            if (!dragonName || dragonName.trim() === "") {dragonName = "Unnamed";}
            let adjustedIdentifier = entity.typeId.substring(entity.typeId.indexOf(':') + 1)
            adjustedIdentifier = adjustedIdentifier.charAt(0).toUpperCase() + adjustedIdentifier.slice(1)
            dragon_orb.setLore([`§r§b${dragonName},${adjustedIdentifier}`,`§r§bDragon orb ID: ${orbID}`])

            let { x, y, z } = entity.location;
                
            world.structureManager.createFromWorld(`dmss:${orbID}`,entity.dimension,{x,y,z},{x:x+1,y:y+1,z:z+1},{includeEntities:true,includeBlocks:false,saveMode:StructureSaveMode.World})
            entity.remove()
                player.runCommandAsync(`particle dragonmounts:smoke ${x} ${y} ${z}`)
                player.runCommandAsync(`playsound item.orb.capture @s ${x} ${y} ${z}`)
                player.runCommandAsync(`clear @s dmss:dragon_orb 0 1`)
                player.dimension.spawnItem(dragon_orb,{x:x,y:y,z:z});
              } else {
          player.sendMessage('§cThis dragon must be tamed before it can be captured.');
        }
      } 
      else {
        player.sendMessage('§cThis entity cannot be captured with the orb.');
      }
  }
}
