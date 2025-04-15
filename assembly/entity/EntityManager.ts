import { Entity } from "../core/cls/Entity";
import { IdentifiedEntity } from "../core/cls/IdentifiedEntity";
import { interner } from "../string/Strings";

export class MatchExpr {
  left: u32;
  operator: u32;
  right: u32;
}

export type Query = MatchExpr[];

export class EntityManager {
  private nextId: u32 = 0;
  private entitiesById: Map<u32, Entity> = new Map<u32, Entity>();
  private freeIds: Set<u32> = new Set<u32>();

  private nextFreeId(): u32 {
    if (this.freeIds.size > 0) {
      const id = this.freeIds.values().pop();
      return id;
    }
    return this.nextId++;
  }

  add(entity: Entity): u32 {
    const id = this.nextFreeId();
    this.entitiesById.set(id, entity);
    return id;
  }
  get(id: u32): Entity | null {
    if (!this.entitiesById.has(id)) {
      return null;
    }
    return this.entitiesById.get(id);
  }
  delete(id: u32): void {
    if (!this.entitiesById.has(id)) {
      return;
    }
    this.entitiesById.delete(id);
    this.freeIds.add(id);
  }

  update(identifiedEntity: IdentifiedEntity): void {
    this.entitiesById.set(identifiedEntity.id, identifiedEntity.entity);
  }

  export(): IdentifiedEntity[] {
    const entities: IdentifiedEntity[] = [];
    const keys = this.entitiesById.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const entity = this.entitiesById.get(key);
      if (entity) {
        entities.push({ id: key, entity: entity });
      }
    }
    return entities;
  }

  import(entities: IdentifiedEntity[]): void {
    this.clear();
    for (let i = 0; i < entities.length; i++) {
      const identifiedEntity = entities[i];
      this.entitiesById.set(identifiedEntity.id, identifiedEntity.entity);
    }
    this.resetNextId();
  }

  // finds free ids and sets nextId to the next highest id
  private resetNextId(): void {
    let maxId: u32 = 0;
    const keys = this.entitiesById.keys();
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      if (id > maxId) {
        maxId = id;
      }
    }
    this.nextId = maxId + 1;
    this.freeIds.clear();
    for (let i: u32 = 0; i < this.nextId; i++) {
      if (!this.entitiesById.has(i)) {
        this.freeIds.add(i);
      }
    }
  }

  clear(): void {
    this.entitiesById.clear();
    this.freeIds.clear();
    this.nextId = 0;
  }

  find(query: Query): IdentifiedEntity[] {
    const result: IdentifiedEntity[] = [];
    const keys = this.entitiesById.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const entity = this.entitiesById.get(key);
      let match = false;
      const eqId = interner.intern("==");
      for (let j = 0; j < query.length; j++) {
        const expr = query[j];
        switch (expr.operator) {
          case eqId: {
            console.log(`testing eqId ${expr.left} ${expr.right}`);
            match = expr.left == expr.right;
          }
        }

        // const value = entity[expr.left];
        // if (value !== expr.right) {
        //   match = false;
        //   break;
        // }
      }
      if (match) {
        result.push({ id: key, entity: entity });
      }
    }
    return result;
  }
}
