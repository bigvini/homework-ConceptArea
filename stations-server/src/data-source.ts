// data-source.ts
import { DataSource } from "typeorm";
import { Station } from "./entities/Station";
import { Metrics } from "./entities/Metrics";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1984",
    database: "stations_db",
    synchronize: true,
    logging: false,
    entities: [Station, Metrics],
    migrations: [],
    subscribers: [],
});
