import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {

  }

  async create() {
    await this.storage.create();
  }

  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async get(key: string) {
    return this.storage.get(key);
  }

  async setObject(key: string, value: any) {
    await this.storage.set(key, { value: JSON.stringify(value) });
    return value;
  }

  async getObject(key: string): Promise<{ value: any }> {
    const ret = await this.storage.get(key);
    return JSON.parse(ret.value);
  }

  async remove(key: string) {
    await this.storage.remove(key);
  }

  async clear() {
    await this.storage.clear();
  }
}
