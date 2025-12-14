import { world, system, EquipmentSlot, GameMode, Player} from "@minecraft/server";

function applyDurabilityDamage(source, mainhand) {
    if (source.getGameMode() === GameMode.creative) return;

    const itemStack = mainhand.getItem();
    if (!itemStack) return;

    const durability = itemStack.getComponent("minecraft:durability");
    if (!durability) return;

    const enchantable = itemStack.getComponent("minecraft:able");
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level ?? 0;

    const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

    if (Math.random() > damageChance) return;

    if (durability.damage >= durability.maxDurability - 1) {
        mainhand.setItem(undefined);
        source.playSound("random.break");
    } else {
        durability.damage++;
        mainhand.setItem(itemStack);
    }
}

function MultibreakDamage(source, breakingTool){
    if (source.getGameMode() === GameMode.creative) return;
        const equippable = source.getComponent("minecraft:equippable");
        if (!equippable) return;
        
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem()) return;

        const durability = breakingTool.getComponent("minecraft:durability");
        if (!durability) return;

        const enchantable = breakingTool.getComponent("minecraft:able");
        const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level ?? 0;

        const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

        if (Math.random() > damageChance) return;
        if (durability.damage >= durability.maxDurability - 1) {
            mainhand.setItem(undefined);
            source.playSound("random.break");
        } else {
            durability.damage++;
            mainhand.setItem(breakingTool);
        }
}

function MagicDamage(source, hand){
    if (source.getGameMode() === GameMode.creative) return;
    
    const itemStack = hand.getItem();
    if (!itemStack) {source.sendMessage('no item stack'); return;}

    const durability = itemStack.getComponent("minecraft:durability");
    if (!durability) return;

        if (durability.damage >= durability.maxDurability - 1) {
            hand.setItem(undefined);
            source.playSound("random.break");
        } else {
            durability.damage++;
            hand.setItem(itemStack);
        }
}

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.itemComponentRegistry.registerCustomComponent('tool:can_be_damaged', {
        onMineBlock({ source}) {
            if (!(source instanceof Player)) return;
        
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) return;
        
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand.hasItem()) return;
        
            applyDurabilityDamage(source, mainhand);
        }
      });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:cherry_wand', {
        onUse(event) {
            const source = event.source;
            const position = {x: source.location.x,y: source.location.y,z: source.location.z};
            const offset = {x: position.x,y: position.y+1,z: position.z};
            const dimension = source.dimension;

            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');

            source.runCommandAsync(`effect @s invisibility 10 1 true`);
            source.runCommandAsync(`effect @s speed 5 1 true`);
            let x = 0;
            while (x < 5) {
                dimension.runCommandAsync(`particle minecraft:cherry_leaves_particle ${position.x} ${position.y} ${position.y}`);
                dimension.runCommandAsync(`particle minecraft:cherry_leaves_particle ${offset.x} ${offset.y} ${offset.z}`);
                x++;
            }
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:forest_staff', {
        onUse(event) {
            const source = event.source;

            const equippable = source.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

            source.addEffect("resistance", 1200, {amplifier: 1,showParticles: true});
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:ore_staff', {
        onUse(event) {
            const source = event.source;
            source.dimension.spawnParticle("dmss:magic",source.location);
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');
            MagicDamage(source, mainhand);
            source.dimension.spawnParticle("dmss:magic",source.location);

            system.runTimeout(() => {
                source.dimension.spawnParticle("dmss:cast",source.location);
            for (const target of source.dimension.getEntities({location: source.location,maxDistance: 6})) {
                if (target === source) continue;
                    let dx = target.location.x - source.location.x;
                    let dz = target.location.z - source.location.z;
                const mag = Math.sqrt(dx * dx + dz * dz) || 1;
                dx /= mag;
                dz /= mag;

                target.dimension.spawnParticle("dmss:knockback",target.location);
                target.applyKnockback(dx, dz, 3, 0.4);
                const health = target.getComponent("health");
                if (!health) continue;
                target.applyDamage(4, {cause: "magic"});
            }
        }, 20);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:lapis_wand', {
        onUse(event) {
            const source = event.source;
            const pointA = {x: source.location.x+1,y: source.location.y-1,z: source.location.z+1};
            const pointB = {x: source.location.x-1,y: source.location.y-1,z: source.location.z-1};
            const dimension = source.dimension;

            const equippable = source.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} lapis_ore replace stone`);
            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} deepslate_lapis_ore replace deepslate`);
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:emerald_wand', {
        onUse(event) {
            const source = event.source;
            const pointA = {x: source.location.x+1,y: source.location.y-1,z: source.location.z+1};
            const pointB = {x: source.location.x-1,y: source.location.y-1,z: source.location.z-1};
            const dimension = source.dimension;

            const equippable = source.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} emerald_ore replace stone`);
            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} deepslate_emerlad_ore replace deepslate`);
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:gold_wand', {
        onUse(event) {
            const source = event.source;
            const pointA = {x: source.location.x+1,y: source.location.y-1,z: source.location.z+1};
            const pointB = {x: source.location.x-1,y: source.location.y-1,z: source.location.z-1};
            const dimension = source.dimension;

            const equippable = source.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} gold_ore replace stone`);
            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} deepslate_gold_ore replace deepslate`);
            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} nether_gold_ore replace netherrack`);
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:quartz_wand', {
        onUse(event) {
            const source = event.source;
            const pointA = {x: source.location.x+1,y: source.location.y-1,z: source.location.z+1};
            const pointB = {x: source.location.x-1,y: source.location.y-1,z: source.location.z-1};
            const dimension = source.dimension;

            const equippable = source.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} quartz_ore replace netherrack`);
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:redstone_wand', {
        onUse(event) {
            const source = event.source;
            const pointA = {x: source.location.x+1,y: source.location.y-1,z: source.location.z+1};
            const pointB = {x: source.location.x-1,y: source.location.y-1,z: source.location.z-1};
            const dimension = source.dimension;

            const equippable = source.getComponent("minecraft:equippable");
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} redstone_ore replace stone`);
            dimension.runCommandAsync(`fill ${pointA.x} ${pointA.y} ${pointA.z} ${pointB.x} ${pointB.y} ${pointB.z} deepslate_redstone_ore replace deepslate`);
            MagicDamage(source, mainhand);
        }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:lapis_totem', {
    onUseOn: (event) => {
        const source = event.source
        const block = event.block
        const dimension = source.dimension;
        if (!source.isSneaking) return;
        if (block.typeId !== "dmss:o_altar") return;
        const pos = block.location;
        let below1 = dimension.getBlock({x: pos.x, y: pos.y - 1, z: pos.z});
        let below2 = dimension.getBlock({x: pos.x, y: pos.y - 2, z: pos.z});

        if (below1.typeId === "minecraft:reinforced_deepslate" && below2.typeId === "minecraft:reinforced_deepslate") {
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');
            mainhand.setItem(undefined);
            dimension.runCommandAsync(`fill ${pos.x -3} ${pos.y +1} ${pos.y -3} ${pos.x +3} ${pos.y +4} ${pos.y +3} air`);
            dimension.spawnEntity("dmss:lapis_dragon", {x: pos.x,y: pos.y+1,z: pos.z})
        }
        else{
            source.sendMessage('wrong position (place it back in the stucture to resummon the dragon)');
        }
    }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:emerald_totem', {
    onUseOn: (event) => {
        const source = event.source
        const block = event.block
        const dimension = source.dimension;
        if (!source.isSneaking) return;
        if (block.typeId !== "dmss:o_altar") return;
        const pos = block.location;
        let below1 = dimension.getBlock({x: pos.x, y: pos.y - 1, z: pos.z});
        let below2 = dimension.getBlock({x: pos.x, y: pos.y - 2, z: pos.z});

        if (below1.typeId === "minecraft:reinforced_deepslate" && below2.typeId === "minecraft:reinforced_deepslate") {
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');
            mainhand.setItem(undefined);
            dimension.runCommandAsync(`fill ${pos.x -3} ${pos.y +1} ${pos.y -3} ${pos.x +3} ${pos.y +4} ${pos.y +3} air`);
            dimension.spawnEntity("dmss:emerald_dragon", {x: pos.x,y: pos.y+1,z: pos.z})
        }
        else{
            source.sendMessage('wrong position (place it back in the stucture to resummon the dragon)');
        }
    }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:gold_totem', {
    onUseOn: (event) => {
        const source = event.source
        const block = event.block
        const dimension = source.dimension;
        if (!source.isSneaking) return;
        if (block.typeId === "dmss:o_altar" || block.typeId === "dmss:n_altar"){
        const pos = block.location;
        let below1 = dimension.getBlock({x: pos.x, y: pos.y - 1, z: pos.z});
        let below2 = dimension.getBlock({x: pos.x, y: pos.y - 2, z: pos.z});

        if (below1.typeId === "minecraft:reinforced_deepslate" && below2.typeId === "minecraft:reinforced_deepslate") {
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');
            mainhand.setItem(undefined);
            dimension.runCommandAsync(`fill ${pos.x -3} ${pos.y +1} ${pos.y -3} ${pos.x +3} ${pos.y +4} ${pos.y +3} air`);
            if (block.typeId === "dmss:o_altar"){dimension.spawnEntity("dmss:gold_dragon_o", {x: pos.x,y: pos.y+1,z: pos.z})}
            if (block.typeId === "dmss:n_altar"){dimension.spawnEntity("dmss:gold_dragon_n", {x: pos.x,y: pos.y+1,z: pos.z})}
        }
        else{
            source.sendMessage('wrong position (place it back in the stucture to resummon the dragon)');
        }
    }}
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:quartz_totem', {
    onUseOn: (event) => {
        const source = event.source
        const block = event.block
        const dimension = source.dimension;
        if (!source.isSneaking) return;
        if (block.typeId !== "dmss:n_altar") return;
        const pos = block.location;
        let below1 = dimension.getBlock({x: pos.x, y: pos.y - 1, z: pos.z});
        let below2 = dimension.getBlock({x: pos.x, y: pos.y - 2, z: pos.z});

        if (below1.typeId === "minecraft:reinforced_deepslate" && below2.typeId === "minecraft:reinforced_deepslate") {
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');
            mainhand.setItem(undefined);
            dimension.runCommandAsync(`fill ${pos.x -3} ${pos.y +1} ${pos.y -3} ${pos.x +3} ${pos.y +4} ${pos.y +3} air`);
            dimension.spawnEntity("dmss:quartz_dragon", {x: pos.x,y: pos.y+1,z: pos.z})
        }
        else{
            source.sendMessage('wrong position (place it back in the stucture to resummon the dragon)');
        }
    }
    });
    initEvent.itemComponentRegistry.registerCustomComponent('dmss:redstone_totem', {
    onUseOn: (event) => {
        const source = event.source
        const block = event.block
        const dimension = source.dimension;
        if (!source.isSneaking) return;
        if (block.typeId !== "dmss:o_altar") return;
        const pos = block.location;
        let below1 = dimension.getBlock({x: pos.x, y: pos.y - 1, z: pos.z});
        let below2 = dimension.getBlock({x: pos.x, y: pos.y - 2, z: pos.z});

        if (below1.typeId === "minecraft:reinforced_deepslate" && below2.typeId === "minecraft:reinforced_deepslate") {
            const equippable = source.getComponent("minecraft:equippable");
            if (!equippable) source.sendMessage('no equippable');
            const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
            if (!mainhand) source.sendMessage('no mainhand;');
            mainhand.setItem(undefined);
            dimension.runCommandAsync(`fill ${pos.x -3} ${pos.y +1} ${pos.y -3} ${pos.x +3} ${pos.y +4} ${pos.y +3} air`);
            dimension.spawnEntity("dmss:redstone_dragon", {x: pos.x,y: pos.y+1,z: pos.z})
        }
        else{
            source.sendMessage('wrong position (place it back in the stucture to resummon the dragon)');
        }
    }
    });
});
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    let breakingTool = event.itemStack;
    let brokenBlock = event.block;
    let source=event.player;
    let type=brokenBlock.typeId
    if(source.isSneaking == false){
        const logBlocks = [
                "minecraft:oak_log",
                "minecraft:birch_log",
                "minecraft:spruce_log",
                "minecraft:jungle_log",
                "minecraft:acacia_log",
                "minecraft:dark_oak_log",
                "minecraft:mangrove_log",
                "minecraft:cherry_log"
            ];
            const oreBlocks = [
                "minecraft:coal_ore",
                "minecraft:iron_ore",
                "minecraft:copper_ore",
                "minecraft:gold_ore",
                "minecraft:redstone_ore",
                "minecraft:emerald_ore",
                "minecraft:diamond_ore",
                "minecraft:lapis_ore",

                "minecraft:deepslate_coal_ore",
                "minecraft:deepslate_iron_ore",
                "minecraft:deepslate_copper_ore",
                "minecraft:deepslate_gold_ore",
                "minecraft:deepslate_redstone_ore",
                "minecraft:deepslate_emerald_ore",
                "minecraft:deepslate_diamond_ore",
                "minecraft:deepslate_lapis_ore",

                "minecraft:nether_gold_ore",
                "minecraft:quartz_ore"
            ];
        const tags = breakingTool.getTags();
        if (tags && tags.includes("dmss:forest_axe") && logBlocks.includes(type)) {
            const { x, y, z } = brokenBlock.location;
            const dimension = source.dimension;
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~ ~ ${type} run setblock ~ ~ ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~-1 ~-1 ${type} run setblock ~1 ~-1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~-1 ~-1 ${type} run setblock ~-1 ~-1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~ ~-1 ${type} run setblock ~1 ~ ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~ ~-1 ${type} run setblock ~-1 ~ ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~-1 ~-1 ${type} run setblock ~ ~-1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~1 ~-1 ${type} run setblock ~ ~1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~1 ~-1 ${type} run setblock ~1 ~1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~1 ~-1 ${type} run setblock ~-1 ~1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~-1 ~1 ${type} run setblock ~1 ~-1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~-1 ~1 ${type} run setblock ~-1 ~-1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~ ~1 ${type} run setblock ~1 ~ ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~ ~1 ${type} run setblock ~-1 ~ ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~-1 ~1 ${type} run setblock ~ ~-1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~1 ~1 ${type} run setblock ~ ~1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~1 ~1 ${type} run setblock ~1 ~1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~1 ~1 ${type} run setblock ~-1 ~1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~-1 ~ ${type} run setblock ~1 ~-1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~-1 ~ ${type} run setblock ~-1 ~-1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~ ~ ${type} run setblock ~1 ~ ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~ ~ ${type} run setblock ~-1 ~ ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~-1 ~ ${type} run setblock ~ ~-1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~ ~1 ${type} run setblock ~ ~ ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~ ~-1 ${type} run setblock ~ ~ ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~1 ~ ${type} run setblock ~ ~1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~1 ~ ${type} run setblock ~1 ~1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~1 ~ ${type} run setblock ~-1 ~1 ~ air destroy`);
        system.run(() => MultibreakDamage(source, breakingTool));
        }
        if(tags && tags.includes("dmss:ore_pickaxe") && oreBlocks.includes(type)) {
            const { x, y, z } = brokenBlock.location;
            const dimension = source.dimension;
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~ ~ ${type} run setblock ~ ~ ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~-1 ~-1 ${type} run setblock ~1 ~-1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~-1 ~-1 ${type} run setblock ~-1 ~-1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~ ~-1 ${type} run setblock ~1 ~ ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~ ~-1 ${type} run setblock ~-1 ~ ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~-1 ~-1 ${type} run setblock ~ ~-1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~1 ~-1 ${type} run setblock ~ ~1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~1 ~-1 ${type} run setblock ~1 ~1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~1 ~-1 ${type} run setblock ~-1 ~1 ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~-1 ~1 ${type} run setblock ~1 ~-1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~-1 ~1 ${type} run setblock ~-1 ~-1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~ ~1 ${type} run setblock ~1 ~ ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~ ~1 ${type} run setblock ~-1 ~ ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~-1 ~1 ${type} run setblock ~ ~-1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~1 ~1 ${type} run setblock ~ ~1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~1 ~1 ${type} run setblock ~1 ~1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~1 ~1 ${type} run setblock ~-1 ~1 ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~-1 ~ ${type} run setblock ~1 ~-1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~-1 ~ ${type} run setblock ~-1 ~-1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~ ~ ${type} run setblock ~1 ~ ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~ ~ ${type} run setblock ~-1 ~ ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~-1 ~ ${type} run setblock ~ ~-1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~ ~1 ${type} run setblock ~ ~ ~1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~ ~-1 ${type} run setblock ~ ~ ~-1 air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~ ~1 ~ ${type} run setblock ~ ~1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~1 ~1 ~ ${type} run setblock ~1 ~1 ~ air destroy`);
        dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} if block ~-1 ~1 ~ ${type} run setblock ~-1 ~1 ~ air destroy`);
        system.run(() => MultibreakDamage(source, breakingTool));
        }
    }
});
