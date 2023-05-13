// const mysql = require('mysql2/promise');
// const { Pool } = require('pg');
const { db } = require('@vercel/postgres');
function deleteFieldFromArrayObjects(arr, field) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field]) {
      delete arr[i][field];
    }
  }
}

// class sqlDatabase {
//   constructor(config) {
//     this.config = config;
//     this.connection = null;
//   }

//   async connect() {
//     this.connection = await mysql.createConnection(this.config);
//   }
//   async disconnect() {
//     if (this.connection) {
//       await this.connection.end();
//       this.connection = null;
//     }
//   }
//   // Получение всех элементов
//   async getAll(table) {
//     const [rows] = await this.connection.query(`SELECT * FROM ${table}`);
//     deleteFieldFromArrayObjects(rows, 'password');
//     return rows;
//   }

//   // Добавление
  // async insert(table, data) {
  //   try {
  //     const result = await this.connection.query(`INSERT INTO ${table} SET ?`, data);
  //     return result[0].insertId;
  //   }catch(err){
  //     console.error(err);
  //     return null;
  //   }
  // }
//   // Изменение
//   async update(table, data, where) {
//     try {
//       const [result] = await this.connection.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, where]);
//       return result;
//     }catch(err){
//       console.error(err);
//       return null;
//     }
//   }
//   // Удаление
//   async delete(table, where) {
//     try {
//       const [result] = await this.connection.query(`DELETE FROM ${table} WHERE id = ?`, where);
//       return result.affectedRows;
//     }catch(err){
//       return null;
//     }
//   }
//   // Поиск по ID
//   async findByID(table, id) {
//     try {
//       const [rows, fields] = await this.connection.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`,[id]);
//       return rows[0];
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   }
//   // Поиск
//   async findByValue(table, column, value) {
//     const [rows] = await this.connection.query(`SELECT * FROM ${table} WHERE ${column} = ? LIMIT 1`, [value]);
//     return rows[0];
//   }
//   // Поиск по двум значения
//   async findByTwoValues(table, column1, value1, column2, value2) {
//     try {
//       const result = await this.connection.query(`SELECT * FROM ${table} WHERE ${column1} = ? AND ${column2} = ? LIMIT 1`, [value1, value2]);
//       return result.length > 0 ? result[0][0] : null; // возвращаем первый элемент из массива результатов или null, если результат пустой
//     } catch (err) {
//       throw err;
//     }
//   }
// }
class SqlDatabase {
  // constructor(config) {
  //   // this.pool = new Pool(config);
  // }

  async query(sql, params) {
    const client = await db.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error('Error executing query');
    } finally {
      client.release();
    }
  }
  async insert(table, data) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
      const values = Object.values(data);
      const result = await this.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`, values);
      return result[0];
    } catch (error) {
      console.error(error);
      throw new Error('Error executing query');
    }
  }

  async findByID(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result;
  }

  async findByValue(table, column, value) {
    const res = await this.query(`SELECT * FROM ${table} WHERE ${column} = $1`, [value]);
    return res[0];
  }

  async findByTwoValues(table, column1, value1, column2, value2) {
    try {
      const result = await this.query(`SELECT * FROM ${table} WHERE ${column1} = $1 AND ${column2} = $2`, [value1, value2]);
      return result[0];
    } catch (error) {
      console.error(error);
      throw new Error('Error executing query');
    }
  }

  async get(table, id) {
    const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return result[0];
  }

  async getAll(table) {
    const result = await this.query(`SELECT * FROM ${table}`);
    deleteFieldFromArrayObjects(result, 'password');
    return result;
  }

  async update(table, data, id) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setFields = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const sql = `UPDATE ${table} SET ${setFields} WHERE id = $${keys.length + 1}`;
    const params = [...values, id];
  
    try {
      const result = await this.query(sql, params);
      return result.rowCount;
    } catch (error) {
      console.error(`Error updating record in table ${table}: ${error}`);
      throw error;
    }
  }
}

module.exports = SqlDatabase;