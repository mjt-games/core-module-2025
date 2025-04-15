import { Entity } from "./cls/Entity";
import { IdentifiedEntity } from "./cls/IdentifiedEntity";
import { GameEvent } from "./cls/GameEvent";

export declare function internString(str: string): u32;
export declare function getString(id: u32): string | null;

export declare function addEntity(entity: Entity): u32;
export declare function getEntity(id: u32): Entity | null;
export declare function deleteEntity(id: u32): void;
export declare function updateEntity(identifiedEntity: IdentifiedEntity): void;
export declare function findEntities(query: string): IdentifiedEntity[];

export declare function dispatchEvent(event: GameEvent): void;
