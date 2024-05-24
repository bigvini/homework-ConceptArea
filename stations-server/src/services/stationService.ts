// services/stationService.ts
import { AppDataSource } from "../data-source";
import { Station } from "../entities/Station";
import { Metrics } from "../entities/Metrics";

export const getStations = async () => {
    const stationRepository = AppDataSource.getRepository(Station);
    const stations = await stationRepository.find();
    return stations;
};

export const getStation = async (id: number) => {
    const stationRepository = AppDataSource.getRepository(Station);
    const station = await stationRepository.findOne({ where: { id }, relations: ["metrics"] });
    return station;
};

export const createStation = async (stationData: Partial<Station>) => {
    const stationRepository = AppDataSource.getRepository(Station);
    const newStation = stationRepository.create(stationData);
    await stationRepository.save(newStation);
    return newStation;
};

export const deleteStation = async (id: number) => {
    const stationRepository = AppDataSource.getRepository(Station);
    const metricsRepository = AppDataSource.getRepository(Metrics);

    try {
        await metricsRepository.delete({ station: { id } });
        const result = await stationRepository.delete(id);
        console.log(`Delete result for station id ${id}: `, result);
    } catch (error) {
        console.error(`Error deleting station with id ${id}: `, error);
        throw new Error(`Failed to delete station with id ${id}`);
    }
};


export const updateStation = async (id: number, stationData: Partial<Station>) => {
    const stationRepository = AppDataSource.getRepository(Station);
    await stationRepository.update(id, stationData);
    const updatedStation = await stationRepository.findOne({ where: { id } });
    return updatedStation;
};
