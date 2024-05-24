import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Station } from "./Station";

@Entity()
export class Metrics {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name_metric!: string;

    @Column("text")
    value_metric!: string;

    @CreateDateColumn()
    date!: Date;

    @ManyToOne(() => Station, station => station.metrics)
    station!: Station;
}
