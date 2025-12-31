import { world, system, ItemStack, EquipmentSlot, Player } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:soul', {
        onUseOn(event) {
            const item = event.itemStack
            const player = event.source
            const block = event.block
            const { x, y, z } = block.location;
            if (block.typeId === "dmss:n_altar" || block.typeId === "dmss:o_altar"){
                
                const lore = item.getLore();
                if (!lore.length) return;
                const ownerID = lore[0].replace("§r§1ownerID:§r ", "");
                if (player.id !== ownerID) {
                    player.sendMessage("§cYou are not the owner of this dragon!");
                    return;
                }

                const entityId = lore[1]?.replace("§r§1type:§r ", "");
                const summon = `${entityId}<baby>`; 
                let dragonName = lore[3]?.replace("§r§1name:§r ", "");

                system.runTimeout(() => {
                    const eq = player.getComponent("minecraft:equippable");
                    const mainhand = eq.getEquipmentSlot(EquipmentSlot.Mainhand);
                    mainhand.setItem(undefined);
                    const dim = player.dimension;
                    const dragon = dim.spawnEntity(summon, { x: x, y: y + 1, z: z });
                    if (dragon) {
                        if (dragon.hasComponent("minecraft:tameable")) {
                            const tameable = dragon.getComponent("minecraft:tameable");
                            tameable.tame(player);
                        }
                        if (dragonName === "Unnamed") dragonName = "";
                        dragon.nameTag = dragonName;
                    }
                }, 1);
            }
        }
    });
});

system.afterEvents.scriptEventReceive.subscribe(event => {
  const entity = event.sourceEntity;
  if (event.id == "dmss:soul") {
    const typeId = entity.typeId;
    const group = event.message

    let isTamed = entity.hasComponent('minecraft:is_tamed');
    if (isTamed){
        const tameable = entity.getComponent("minecraft:tameable");
        const ownerID = tameable.tamedToPlayerId;
        let dragonName = entity.nameTag;

        if (!dragonName || dragonName.trim() === "") {dragonName = "Unnamed"}
        const dim = entity.dimension;
        let { x, y, z } = entity.location;

        const soul = new ItemStack("dmss:soulstone", 1);
        soul.setLore([
        `§r§1ownerID:§r ${ownerID}`,
        `§r§1type:§r ${typeId}`,
        `§r§1group:§r ${group}`,
        `§r§1name:§r ${dragonName}`
        ]);
        dim.spawnItem(soul, { x, y, z });
    }}
});