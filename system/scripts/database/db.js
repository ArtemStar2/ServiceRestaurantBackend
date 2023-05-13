const mysql = require('mysql2/promise');

function deleteFieldFromArrayObjects(arr, field) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field]) {
      delete arr[i][field];
    }
  }
}

class sqlDatabase {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    this.connection = await mysql.createConnection(this.config);
  }
  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
  // Получение всех элементов
  async getAll(table) {
    const [rows] = await this.connection.query(`SELECT * FROM ${table}`);
    deleteFieldFromArrayObjects(rows, 'password');
    return rows;
  }

  // Добавление
  async insert(table, data) {
    try {
      const result = await this.connection.query(`INSERT INTO ${table} SET ?`, data);
      return result[0].insertId;
    }catch(err){
      console.error(err);
      return null;
    }
  }
  // Изменение
  async update(table, data, where) {
    try {
      const [result] = await this.connection.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, where]);
      return result;
    }catch(err){
      console.error(err);
      return null;
    }
  }
  // Удаление
  async delete(table, where) {
    try {
      const [result] = await this.connection.query(`DELETE FROM ${table} WHERE id = ?`, where);
      return result.affectedRows;
    }catch(err){
      return null;
    }
  }
  // Поиск по ID
  async findByID(table, id) {
    try {
      const [rows, fields] = await this.connection.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`,[id]);
      return rows[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  // Поиск
  async findByValue(table, column, value) {
    const [rows] = await this.connection.query(`SELECT * FROM ${table} WHERE ${column} = ? LIMIT 1`, [value]);
    return rows[0];
  }
  // Поиск по двум значения
  async findByTwoValues(table, column1, value1, column2, value2) {
    try {
      const result = await this.connection.query(`SELECT * FROM ${table} WHERE ${column1} = ? AND ${column2} = ? LIMIT 1`, [value1, value2]);
      return result.length > 0 ? result[0][0] : null; // возвращаем первый элемент из массива результатов или null, если результат пустой
    } catch (err) {
      throw err;
    }
  }
}

module.exports = sqlDatabase;