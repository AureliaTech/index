import {  ClientConfig, Pool } from "pg";

// TODO: Use env variables
const clientConfig: ClientConfig = {
  host: "127.0.0.1",
  database: "aurelia-core",
  user: "aurelia-core_owner",
  ssl: false,
  password: "pwd",
  port: 5432,
};

const pool = new Pool(clientConfig);

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
