import { Entity } from "../core/cls/Entity";
import { IdentifiedEntity } from "../core/cls/IdentifiedEntity";
import { EntityManager, Query } from "./EntityManager";

const entityManager = new EntityManager();
export function addEntity(entity: Entity): u32 {
  return entityManager.add(entity);
}

export function getEntity(id: u32): Entity | null {
  return entityManager.get(id);
}
export function deleteEntity(id: u32): void {
  entityManager.delete(id);
}
// export function updateEntity(identifiedEntity: Entity): void {
//   entityManager.update(identifiedEntity);
// }
export function exportEntities(): IdentifiedEntity[] {
  return entityManager.export();
}

export function importEntities(entities: IdentifiedEntity[]): void {
  entityManager.import(entities);
}

export function clearEntities(): void {
  entityManager.clear();
}

export function updateEntity(identifiedEntity: IdentifiedEntity): void {
  entityManager.update(identifiedEntity);
}

export function findEntities(query: Query): IdentifiedEntity[] {
  return entityManager.find(query);

}
