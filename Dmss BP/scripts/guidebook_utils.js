import { world, system } from "@minecraft/server";


system.afterEvents.scriptEventReceive.subscribe(event => {
    const entity = event.sourceEntity
    if (event.id == 'dmss:guidebook') {
        const players = entity.dimension.getPlayers({location: entity.location,closest: 1});
        if (players.length === 0) return; 
        const player = players[0];
//eggs
        if (event.message == 'cherry_egg') {
            if (player.getDynamicProperty("dmss:cherry_egg")?? 0 === 0) {
                player.setDynamicProperty("dmss:cherry_egg", 1);
                player.sendMessage("§2 [Guidebook]§r Cherry egg unlocked!");}
        };
//dragons
        if (event.message == 'cherry_dragon') {
            if ((player.getDynamicProperty("dmss:cherry_dragon")?? 0) === 0) {
                player.setDynamicProperty("dmss:cherry_dragon", 1);
                player.sendMessage("§2 [Guidebook]§r Cherry dragon unlocked!");}
        };
//all eggs
        if (event.message == 'unlock_all') {
            if (player.getDynamicProperty("dmss:cherry_egg")?? 0 === 0) {
                player.setDynamicProperty("dmss:cherry_egg", 1);
                player.sendMessage("§2 [Guidebook]§r Cherry egg unlocked!");}
//all dragons
            if ((player.getDynamicProperty("dmss:cherry_dragon")?? 0) === 0) {
                player.setDynamicProperty("dmss:cherry_dragon", 1);
                player.sendMessage("§2 [Guidebook]§r Cherry dragon unlocked!");}
        };
    }
});

