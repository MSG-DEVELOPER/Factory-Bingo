// mysql.js
import mysql from "serverless-mysql";

export const connection = mysql({
  config: {
    host: "localhost",
    port: 3306,
    database: "bingo",
    user: "root",
    password: "",
  },
});

async function querySql(sql, params) {
  let result;
  try {
    result = JSON.parse(JSON.stringify(await connection.query(sql, params)));
  } catch (error) {
    console.log("error querying", error);
  } finally {
    connection.end();
  }
  return result;
}

export const conn = {
  async query(query, args) {
    return await querySql(query, args)
  }
}



