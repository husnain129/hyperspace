import sqlite3 from 'sqlite3';

import * as sqlite from 'sqlite';
import path from 'path';
import fs from 'fs';

const dbFile = path.join(__dirname, '../../assets', 'account.dat');

export interface IAccount {
  name: string;
  private_key: string;
  created_at: number;
}

const DB_API = {
  db: null as sqlite.Database | null,
  async connect() {
    if (this.db != null) {
      return Promise.resolve(this.db);
    }
    this.db = await sqlite.open({
      driver: sqlite3.Database,
      filename: dbFile,
    });
    return this.db;
  },
  /**
   *
   * @returns True if database exists, false otherwise
   */
  exists() {
    return fs.existsSync(dbFile);
  },

  async getAccount() {
    if (!this.exists()) throw new Error("database doens't exists");
    await this.connect();

    const res = await this.db!.get<IAccount>('SELECT * FROM account');
    console.log(res);
    if (res === undefined) return null;
    return res;
  },
  async createAccount(account: IAccount) {
    await this.connect();

    try {
      if ((await this.getAccount()) !== null) {
        throw new Error('Account already created.');
      }
    } catch (er) {
      console.warn(er);
    }
    console.log('Creating table');
    await this.db!.exec(`CREATE TABLE IF NOT EXISTS account (
      name VARCHAR[256],
      private_key VARCHAR[256],
      created_at int(11)
    )`);

    console.log('Table created');
    await this.db!.run(
      'INSERT INTO account (name,private_key,created_at) VALUES(?,?,?)',
      account.name,
      account.private_key,
      account.created_at
    );
  },
};
export default DB_API;
