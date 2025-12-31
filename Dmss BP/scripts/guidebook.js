import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    const item = event.itemStack;

    if (item?.typeId === "dmss:guidebook") {
        openMainMenu(player);
    }
});

function openMainMenu(player) {
    const form = new ActionFormData()
        .title("Dragon Mounts 3: Introduction")
        .body("Choose a topic:")
        .button("General information", "textures/ui/infobulb")
        .button("Dragons", "textures/entity/boss/lapis_head")
        .button("Eggs", "textures/ui/dragon_egg")
        .button("special Materials", "textures/ui/icon_recipe_equipment")

    form.show(player).then((response) => {
        if (response.canceled) return;
        switch (response.selection) {
            case 0:
                General(player);
                break;
            case 1:
                Dragons(player);
                break;
            case 2:
                Eggs(player);
                break;
            case 3:
                Special(player);
                break;
        }
    })
}

function General(player) {
    const textPage = new ActionFormData()
        .title("General information")
        .body("Hello adventurer!\n\nThis is your guidebook.\n\nUse it to learn about the addon and all its features. Some topics might be locked for now but will unlock later on.\n\n"
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {openMainMenu(player);}
    })
}
function Dragons(player) {
    const form = new ActionFormData()
        .title("Dragons")
        .body("Choose an option:")
        .button("General information", "textures/ui/infobulb")
        .button("Tameable", "textures/entity/cherry_dragon/head")
        .button("Boss", "textures/entity/boss/emerald_head")
        .button("§cBack")
        .button("§aClose");
        form.show(player).then((response) => {
        if (response.canceled) return;
        switch (response.selection) {
            case 0:
                GeneralDragon(player);
                break;
            case 1:
                TameableDragon(player);
                break;
            case 2:
                BossDragon(player);
                break;
            case 3:
                openMainMenu(player);
                break;
            case 4:
                return;
        }
    })
}
function TameableDragon(player) {
    const form = new ActionFormData()
        .title("Dragons")
        .body("Choose an option:")
        if ( (player.getDynamicProperty("dmss:cherry_dragon")?? 0)===1) {form.button("Cherry", "textures/entity/cherry_dragon/head");} 
        else {form.button("§4§lLocked","textures/blocks/barrier");}
        form.button("§cBack")
        form.button("§aClose");
        form.show(player).then((response) => {
        if (response.canceled) return;
        switch (response.selection) {
            case 0:
                if ((player.getDynamicProperty("dmss:cherry_dragon")?? 0)===1) {CherryDragon(player);}
                break;
            case 1:
                Dragons(player);
                break;
            case 2:
                return;
        }
    })
}

function BossDragon(player) {
    const form = new ActionFormData()
        .title("Dragons")
        .body("Choose an option:")
        .button("Lapis", "textures/entity/boss/lapis_head")
        .button("Emerald", "textures/entity/boss/emerald_head")
        .button("Gold", "textures/entity/boss/gold_head")
        .button("Quartz", "textures/entity/boss/head")
        .button("Redstone", "textures/entity/boss/redstone_head")
        .button("§cBack")
        .button("§aClose");
        form.show(player).then((response) => {
        if (response.canceled) return;
        switch (response.selection) {
            case 0:
                BossLapis(player);
                break;
            case 1:
                BossEmerald(player);
                break;
            case 2:
                BossGold(player);
                break;
            case 3:
                BossQuartz(player);
                break;
            case 4:
                BossRedstone(player);
                break;
            case 5:
                Dragons(player);
                break;
            case 6:
                return;
        }
    })
}
function GeneralDragon(player) {
    const textPage = new ActionFormData()
        .title("§bGeneral information")
        .body("Tameable dragons are magical creatures that can fly similar to ghasts and use a power jump to start flying.\n\n"+
            "Every dragon has its own unique taming and healing item afterwards every dragon be equipped with both a saddle and a chest for storage. When interacting with it and holding a glass bottle it will fill it with dragon breath."+
            " Furthermore when riding the dragon and interacting with a blaze rod or dragon breath then the dragon will fire a projectile.\n\n"+
            "A dead dragon will remain as a soul for around 15 minutes and then disappears. In that time it can be revived when interaction with the maching type of soul stone.\n\n"+
            "\n\nThe boss dragons can be summoned through a special altar and the use of a unique totem (more about that in the special material section). Unlike tameable dragons, boss dragons cannot fly but possess a wide range of powerful attacks and are hostile to players. Defeat them so see their loot."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Dragons(player);}
    })
}
function CherryDragon(player) {
    const textPage = new ActionFormData()
        .title("§3Cherry Dragon")
        .body("\nThe Cherry Dragon is a Forest Dragon variant, known for its vibrant colors and connection to cherry blossoms. Thats why the axe is breaking wood extra fast.\n"+
            "Tame Item:  Cherry leaves and saplings\n\n\n"+
            "Healing Item:  Cherry leaves, saplings, logs, planks, pink petals\n\n\n"+
            "Breeding Item:  cherry sapling and pink petals\n\n"
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {TameableDragon(player);}
    })
}
function BossLapis(player) {
    const textPage = new ActionFormData()
        .title("§dLapis Dragon")
        .body("The Lapis Dragon is an Ore Dragon that lives deep underground. Its reclusive nature makes it aggressive toward humans and impossible to tame. Slaying one rewards you with a fragment of its hidden power. Like its kin, it stands guard over a powerful altar buried in the depths (see Special Materials for more details)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {BossDragon(player);}
    })
}
function BossEmerald(player) {
    const textPage = new ActionFormData()
        .title("§5Emerald Dragon")
        .body("The Emerald Dragon is an Ore Dragon that dwells deep within lush underground caverns. Revered for its wisdom and rarity, it fiercely guards the riches of the earth. Though untameable, defeating one may yield a fragment of its hidden power. Like all Ore Dragons, it watches over a powerful altar hidden deep below (see Special Materials for more details)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {BossDragon(player);}
    })
}
function BossGold(player) {
    const textPage = new ActionFormData()
        .title("§4Gold Dragon")
        .body("The Gold Dragon is an Ore Dragon found both in the blazing caverns of the Nether and the deepest Overworld mines. Its radiant scales glimmer with greed and power, and its territory is guarded with relentless fury. While it cannot be tamed, those who defeat it may uncover a fragment of its hidden power and the ancient altar all Ore Dragons protect (see Special Materials)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {BossDragon(player);}
    })
}
function BossQuartz(player) {
    const textPage = new ActionFormData()
        .title("§2Forest Dragon")
        .body("The Quartz Dragon is an Ore Dragon that thrives in the fiery depths of the Nether. Its crystalline body radiates intense heat, and it attacks any intruder without hesitation. Though untameable, defeating it yields a fragment of its hidden power. It too guards the ancient altar shared among the Ore Dragons (see Special Materials)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {BossDragon(player);}
    })
}
function BossRedstone(player) {
    const textPage = new ActionFormData()
        .title("§bIce Dragon")
        .body("The Redstone Dragon is an Ore Dragon infused with the earth’s living energy. Its body crackles with power, glowing faintly in the dark tunnels it calls home. These dragons are highly aggressive and cannot be tamed. Like all Ore Dragons, it protects the ancient altar pulsing with energy beneath the world (see Special Materials)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {BossDragon(player);}
    })
}

function Eggs(player) {
    const form = new ActionFormData()
        .title("Dragon Eggs")
        .body("Choose an option:")
        .button("General information", "textures/ui/infobulb");
        if ( (player.getDynamicProperty("dmss:cherry_egg")?? 0)===1) {form.button("Cherry", "textures/entity/cherry_dragon/icon_egg");} 
        else {form.button("§4§lLocked","textures/blocks/barrier");}
        form.button("§cBack")
        form.button("§aClose");

        form.show(player).then((response) => {
        if (response.canceled) return;
        switch (response.selection) {
            case 0:
                GeneralEgg(player);
                break;
            case 1:
                if ((player.getDynamicProperty("dmss:cherry_egg")?? 0)===1) {CherryEgg(player);}
                break;
            case 2:
                openMainMenu(player);
                break;
            case 3:
                return;
        }
    })
}
function GeneralEgg(player) {
    const textPage = new ActionFormData()
        .title("§bGeneral information")
        .body("Dragons eggs can be found arround the world in side dragon nests. Each type has 2 nest variants and every nest has 1 egg. \n\nYou can take it home (and hatch it there) or start the hatching process by interacting with the egg.\n\n"+
            "Starting the hatching process will unlock everything there is to know about this egg type. In case it doesn't you can simply interact with the hatching egg while holing the guidebook to unlock it.\n\n"+
            "After around 20 minutes, when the egg hatches, it will unlock everything there is to know about the dragon type.\n\n"+
            "If interacted with while sneaking then the egg turn into its item form so it can be picked up again.\n\n\n"+
            "Eggs can change their type upon starting the hatching process but only into the types that can be found in their dimension and if the right blocks are placed around it (in the future)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Eggs(player);}
    })
}
function CherryEgg(player) {
    const textPage = new ActionFormData()
        .title("§3Cherry Egg")
        .body("The Cherry Egg can be found in nests inside the cherry biome./n/n"+
            "Items to speed up the hatching process:    Bonemeal"
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Eggs(player);}
    })
}

function Special(player) {
    const form = new ActionFormData()
        .title("Special Material")
        .body("Choose an option:")
        .button("General information", "textures/ui/infobulb")
        .button("Totems for the ore dragons", "textures/items/totems/totem_of_the_lapis_dragon")
        .button("Scales", "textures/ui/dragon_scale")
        .button("Armor", "textures/ui/icon_armor")
        .button("Ingots", "textures/ui/ingot")
        .button("Tools", "textures/ui/icon_iron_pickaxe")
        .button("Soulstones", "textures/items/soulstone")
        .button("Spellstones, wands, and staffs", "textures/items/spellstone/cherry")
        .button("Altar", "textures/ui/altar")
        .button("Dragon orb", "textures/items/dragon_orb/orb")
        .button("§cBack")
        .button("§aClose");

        form.show(player).then((response) => {
        if (response.canceled) return;
        switch (response.selection) {
            case 0:
                GeneralSpecial(player);
                break;
            case 1:
                Totems(player)
                break;
            case 2:
                Scales(player)
                break;
            case 3:
                Armor(player)
                break;
            case 4:
                Ingots(player)
                break;
            case 5:
                Tools(player)
                break;
            case 6:
                Soulstones(player)
                break;
            case 7:
                Spellstones(player)
                break;
            case 8:
                Altar(player)
                break;
            case 9:
                Orb(player)
                break;
            case 10:
                openMainMenu(player);
                break;
            case 11:
                return;
        }
    })
}

function GeneralSpecial(player) {
    const textPage = new ActionFormData()
        .title("§bGeneral information")
        .body("In this part are all new items listed and their abilities. Keep in mind that some might not jet be unlocked due to recipe unlocking."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Totems(player) {
    const textPage = new ActionFormData()
        .title("§bTotems")
        .body("You can craft these special totems ot of a vanilla totem, surrounded by block of their respective ore. /n/n"+
                "When standing on top of an altar and using the totem the respective ore dragon will be spawned (the altar need to be in the correct spot in the structure)."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Scales(player) {
    const textPage = new ActionFormData()
        .title("§bScales")
        .body("Scales are a material to craft the different ingots and armor using the the altars. Scales will be droped by tameable dragons from time to time or when killing a hostile dragon.")
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Armor(player) {
    const textPage = new ActionFormData()
        .title("§bArmor")
        .body("Use the Dragon scales and the altar to craft some armor. The recipe is the same as for an iron or diamond armor and has special abilities."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Ingots(player) {
    const textPage = new ActionFormData()
        .title("§bIngots")
        .body("Use the Dragon ingots and the overworld altar to craft yourself tools.")
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Tools(player) {
    const textPage = new ActionFormData()
        .title("§bTools")
        .body("Use the Dragon ingots and the overworld altar to craft yourself some tools with special properties.")
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Soulstones(player) {
    const textPage = new ActionFormData()
        .title("§bSoulstones")
        .body("Soulstones can be used to revive dragons (interact with an altar) or make a dragon orb."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Spellstones(player) {
    const textPage = new ActionFormData()
        .title("§bSpellstones")
        .body("With the help of a Spellstone and the nether altar it is possible to craft a staff or a wand. Wands have more offensive powers while wands have defensive or practial abilities."
            )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Altar(player) {
    const textPage = new ActionFormData()
        .title("§bAltar")
        .body("The altar can be found underground or in the nether and is usually guarded by an ore dragon. The altar is the key to use all dragon related items in crafting recipies and can only be mined with a dragon pickaxe.")
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}
function Orb(player) {
    const textPage = new ActionFormData()
        .title("§bAltar")
        .body("The dragon orb is a powerful magical artefact that allows you to carry any tamed dragon in your inventory. In order to put the dragon inside just interact with the dragon using th orb. In order to release the dragon jut use the item./n/n"+
                "Please note that the dragon as long as it is inside the orb will be in a timeless space."
        )
        .button("§cBack")
        .button("§aClose");

    textPage.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === 0) {Special(player);}
    })
}