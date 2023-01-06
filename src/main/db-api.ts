import sqlite3 from 'sqlite3';

import * as sqlite from 'sqlite';
import path from 'path';
import fs from 'fs';
import { FileStatus, IFile } from './IFile';

const dbFile = path.join(__dirname, '../../assets', 'account.dat');

export interface IAccount {
  name: string;
  private_key: string;
  public_key: string;
  address: string;
  created_at: number;
}

export async function LoadAccountInfoFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) throw new Error("file doesn't exists");

  const db = await sqlite.open({
    driver: sqlite3.Database,
    filename: filePath,
  });
  if (!db) throw new Error('failed to open db');

  const res = await db.get<IAccount>('SELECT * FROM account');
  console.log(res);
  if (res === undefined) throw new Error('failed to load account');
  try {
    await db.close();
  } catch {
    console.warn('failed to close db');
  }
  return res;
}

const DB_API = {
  db: null as sqlite.Database | null,
  async connect() {
    if (this.db != null && fs.existsSync(dbFile)) {
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
  async getAllFiles(): Promise<IFile[]> {
    await this.connect();

    const rows = await this.db!.all<
      Array<{
        file_key: string;
        bid: string;
        name: string;
        contract_address: string;
        file_size: number;
        merkle_root: string;
        segments: number;
        timer_start: number;
        timer_end: number;
        time_created: number;
        last_verified: number;
        conclude_timeout: number;
        prove_timeout: number;
        sha256: '';
        created_at: string;
        is_encrypted: boolean;
      }>
    >(`SELECT * from files`);
    console.log('>rows');
    console.log(rows);

    return rows.map((r) => ({
      fileKey: r.file_key,
      bid: r.bid,
      concludeTimeoutLength: r.conclude_timeout,
      fileMerkleRootHash: r.merkle_root,
      fileSize: r.file_size,
      lastVerified: r.last_verified,
      name: r.name,
      progress: 0,
      proveTimeoutLength: r.prove_timeout,
      segmentsCount: r.segments,
      sha256: r.sha256,
      status: FileStatus.IDLE,
      storageContractAddress: r.contract_address,
      timeCreated: r.time_created,
      timerEnd: r.timer_end,
      timerStart: r.timer_start,
      isEncrypted: !!r.is_encrypted,
    }));
  },
  async insertFile(file: IFile) {
    await this.connect();

    await this.db!.exec(`CREATE TABLE IF NOT EXISTS files (
      file_key VARCHAR(256) PRIMARY KEY UNIQUE,
      bid varchar(256),

      name VARCHAR(1024),
      contract_address VARCHAR(256),
      file_size int(11),
      merkle_root VARCHAR(256),
      segments int(11),

      timer_start int(11),
      timer_end int(11),

      time_created int(11),
      last_verified int(11),

      conclude_timeout int(11),
      prove_timeout int(11),
      sha256 VARCHAR(256),
      is_encrypted int(1),

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await this.db!.run(
      `INSERT INTO files (
      file_key,bid,name,contract_address,file_size,
      merkle_root,segments,timer_start,timer_end,
      time_created, last_verified, conclude_timeout,
      prove_timeout,sha256,is_encrypted
    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      file.fileKey,
      file.bid,
      file.name,
      file.storageContractAddress,
      file.fileSize,
      file.fileMerkleRootHash,
      file.segmentsCount,
      file.timerStart,
      file.timerEnd,
      file.timeCreated,
      file.lastVerified,
      file.concludeTimeoutLength,
      file.proveTimeoutLength,
      file.sha256,
      file.isEncrypted ? 1 : 0
    );
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
      name VARCHAR(256),
      private_key VARCHAR(256),
      public_key VARCHAR(256),
      address VARCHAR(256),

      created_at int(11)
    )`);

    console.log('Table created');
    await this.db!.run(
      'INSERT INTO account (name,private_key,public_key,address,created_at) VALUES(?,?,?,?,?)',
      account.name,
      account.private_key,
      account.public_key,
      account.address,
      account.created_at
    );
  },
};
export default DB_API;
