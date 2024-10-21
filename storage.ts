import type { Nullable } from "./utilities.ts";
import { ulid } from "ulid";
import { join, resolve } from "path";
import { emptyDir } from "fs";

interface IStorageObject {
  id: string;
  mimeType: string;
  filename: string;
  readonly path: string;

  openFile(): Promise<Uint8Array>;
  deleteFile(): Promise<void>;
}

interface ITimedObject extends IStorageObject {
  stored_until: number;

  isExpired(): boolean;
}

export class StorageObject implements IStorageObject {
  id: string;
  mimeType: string;
  filename: string;
  readonly path: string;

  constructor(id: string, mimeType: string, filename: string, path: string) {
    this.id = id;
    this.mimeType = mimeType;
    this.filename = filename;
    this.path = path;
  }

  async openFile(): Promise<Uint8Array> {
    return await Deno.readFile(resolve(this.path));
  }

  async deleteFile(): Promise<void> {
    await Deno.remove(this.path);
  }
}

export class TimedObject extends StorageObject implements ITimedObject {
  stored_until: number;

  constructor(
    id: string,
    mimeType: string,
    filename: string,
    path: string,
    amount_of_hours: number = 1,
  ) {
    if (amount_of_hours > 5)
      throw new Error("You can only store files for 5 hours");

    super(id, mimeType, filename, path);

    this.stored_until = Date.now() + 3600 * amount_of_hours * 1000;
    console.log;
  }

  isExpired(): boolean {
    return Date.now() >= this.stored_until;
  }
}

class ObjectManager {
  private storage: Array<ITimedObject> = [];

  addObject(object: StorageObject, until?: number): TimedObject {
    const newObject = new TimedObject(
      object.id,
      object.mimeType,
      object.filename,
      object.path,
      until,
    );

    this.storage.push(newObject);
    return newObject;
  }

  getObjects(): Nullable<TimedObject[]> {
    return this.storage;
  }

  findObject(key: string): Nullable<TimedObject> {
    const obj = this.storage.find((ti) => ti.id == key);
    return obj;
  }

  purgeExpired() {
    this.storage.forEach((value, index) => {
      if (value.isExpired()) {
        value.deleteFile();

        console.log(`[DELETE] File ${value.filename} was deleted.`);

        this.storage.splice(index, 1);
      }
    });
  }
}

class StorageManager {
  manager: ObjectManager = new ObjectManager();
  ROOT_PATH = "./tmpst/";
  private lastId = 0;

  async storeFile(blob: File, until?: number) {
    await Deno.writeFile(
      resolve(join(this.ROOT_PATH, blob.name)),
      blob.stream(),
    );
    const object = new StorageObject(
      ulid(),
      blob.type,
      blob.name,
      this.ROOT_PATH + blob.name,
    );

    return this.manager.addObject(object, until);
  }

  getFile(id: string) {
    return this.manager.findObject(id);
  }

  async removeLeftovers() {
    await emptyDir(this.ROOT_PATH);
  }
}

export class StorageSingleton {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance() {
    if (!StorageSingleton.instance) {
      StorageSingleton.instance = new StorageManager();
    }

    return StorageSingleton.instance;
  }
}
