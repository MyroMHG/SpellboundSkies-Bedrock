import { world, ItemStack, ItemTypes } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe(ev => {

    const player = ev.player;
    if (player.hasTag("guidebook")) return;
    const dimension = player.dimension;
    const playerPos = player.location;

    const guidebook = new ItemStack(ItemTypes.get("dmss:guidebook"), 1);
    dimension.spawnItem(guidebook, { 
        x: playerPos.x, 
        y: playerPos.y, 
        z: playerPos.z 
    });
    player.addTag("guidebook");
});
