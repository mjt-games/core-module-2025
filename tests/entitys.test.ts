import { describe, expect, test } from "vitest";
import { loadWasm } from "./loadWasm.js";
import { Component } from "../assembly/core/cls/Component";
import { Entity } from "../assembly/core/cls/Entity";
{
  const instance = await loadWasm();
  describe("entities", () => {
    const testEntity: Entity = [
      {
        id: 0,
        kvs: [],
      },
    ];
    const testEntities = [testEntity];
    test("addEntity", () => {
      const result = instance.addEntity(testEntity);
      expect(result).toBe(0);
    });
    test("getEntity", () => {
      const result = instance.getEntity(0);
      expect(result).toEqual(testEntity);
    });
    test("deleteEntity", () => {
      instance.deleteEntity(0);
      const shouldBeNull = instance.getEntity(0);
      expect(shouldBeNull).toBeNull();
    });

    test("updateEntity", () => {
      const newEntity: Entity = [
        {
          id: 9999,
          kvs: [],
        },
      ];
      instance.updateEntity({ id: 9999, entity: newEntity });
      const result = instance.getEntity(9999);
      expect(result).toEqual(newEntity);
    });

    test("export", () => {
      instance.clearEntities();
      instance.addEntity(testEntity);
      const result = instance.exportEntities();
      expect(result.length).toBe(1);
      expect(result).toEqual([{ id: 0, entity: testEntity }]);
    });
    test("addMultiEntity", () => {
      instance.clearEntities();
      {
        const result = instance.addEntity(testEntity);
        expect(result).toBe(0);
      }
      {
        const result = instance.addEntity(testEntity);
        expect(result).toBe(1);
      }
    });
    test("import", () => {
      instance.clearEntities();
      Array.from({ length: 1000 }).forEach((_, i) => {
        instance.addEntity(testEntity);
      });
      const exported = instance.exportEntities();
      instance.importEntities(exported);
      const reExported = instance.exportEntities();
      expect(reExported.length).toBe(1000);
      expect(reExported).toEqual(exported);
    });

    test("findEntities", () => {
      instance.clearEntities();
      const { internString: s } = instance;
      const testEntity1: Entity = [
        {
          id: 0,
          kvs: [
            { key: s("name"), value: s("test") },
            { key: s("age"), value: s("10") },
          ],
        },
      ];
      const testEntity2: Entity = [
        {
          id: 1,
          kvs: [
            { key: s("name"), value: s("test") },
            { key: s("age"), value: s("20") },
          ],
        },
      ];
      instance.addEntity(testEntity1);
      instance.addEntity(testEntity2);
      const exported = instance.exportEntities();
      // console.log("exported from findEntities", JSON.stringify(exported));
      const result = instance.findEntities([
        {
          left: s("name"),
          right: s("test"),
          operator: s("=="),
        },
      ]);
      expect(result.length).toBe(2);
    });
  });
}
