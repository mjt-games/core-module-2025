import { IdentifiedEntity } from "./IdentifiedEntity";


export class GameEvent {
  type: u32;
  payload: IdentifiedEntity[];
}
