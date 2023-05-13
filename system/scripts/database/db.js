// const mysql = require('mysql2/promise');
const { Pool } = require('pg');
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
//   async insert(table, data) {
//     try {
//       const result = await this.connection.query(`INSERT INTO ${table} SET ?`, data);
//       return result[0].insertId;
//     }catch(err){
//       console.error(err);
//       return null;
//     }
//   }
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
  constructor(config) {
    this.pool = new Pool(config);
  }

  async query(sql, params) {
    const client = await this.pool.connect();
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
  async findById(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rows[0];
  }

  async findByValue(table, column, value) {
    const queryText = `SELECT * FROM ${table} WHERE ${column} = $1`;
    const res = await this.query(queryText, [value]);
    return res.rows[0];
  }

  async findByTwoValues(table, column1, value1, column2, value2) {
    try {
      // отправляем запрос в БД
      const result = await this.pool.query(`SELECT * FROM ${table} WHERE ${column1}=$1 AND ${column2}=$2`, [value1, value2]);
      // возвращаем результат
      return result.rows;
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

  async update(table, id, data) {
    const columns = Object.keys(data).map((column, index) => `${column} = $${index + 1}`).join(', ');
    const values = Object.values(data);
    await this.query(`UPDATE ${table} SET ${columns} WHERE id = $${values.length + 1}`, [...values, id]);
  }
  async delete(table, id) {
    await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }
}

module.exports = SqlDatabase;