import { world, system } from '@minecraft/server'

system.afterEvents.scriptEventReceive.subscribe(event => {
    const dragon = event.sourceEntity
    const { x, y, z } = dragon.getHeadLocation();
    const { x: dx, y: dy, z: dz } = dragon.getViewDirection();
    if (event.id == 'dmss:shoot') {
    //dm_fireball
    if (event.message == 'dmss_forest') {
        dragon.playAnimation('animation.dragon.ranged_attack', { blendOutTime: 4 });
        const existingVelocity = dragon.getVelocity();
        const dragonDirection = dragon.getViewDirection();
        const dragonRotation = dragon.getRotation();
        const { x, y, z } = dragon.getHeadLocation();
        const { x: dx, y: dy, z: dz } = dragon.getViewDirection();
        const fireball = dragon.dimension.spawnEntity('dmss:forest_shoot', {x: x + dx * 10,y: y + dy * 10,z: z + dz * 10});
        fireball.setRotation(dragonRotation);
        fireball.applyImpulse({x: existingVelocity.x + dragonDirection.x * 2,y: existingVelocity.y + dragonDirection.y * 2,z: existingVelocity.z + dragonDirection.z * 2});
    }
    //dm_breath
    if (event.message == 'dmss_breath') {
        dragon.playAnimation('animation.dragon.ranged_attack', { blendOutTime: 4 });
        const existingVelocity = dragon.getVelocity();
        const dragonDirection = dragon.getViewDirection();
        const dragonRotation = dragon.getRotation();
        const { x, y, z } = dragon.getHeadLocation();
        const { x: dx, y: dy, z: dz } = dragon.getViewDirection();
        const fireball = dragon.dimension.spawnEntity('dmss:dragon_breath', {x: x + dx * 2,y: y + dy * 2,z: z + dz * 2});
        fireball.setRotation(dragonRotation);
        fireball.applyImpulse({x: existingVelocity.x + dragonDirection.x * 2,y: existingVelocity.y + dragonDirection.y * 2,z: existingVelocity.z + dragonDirection.z * 2});
    }
    }
})