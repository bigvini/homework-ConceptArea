import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Metrics } from "./Metrics";

@Entity()
export class Station {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    address!: string;

    @Column()
    status!: boolean;

    @OneToMany(() => Metrics, metrics => metrics.station)
    metrics!: Metrics[];
}
