import { AppDataSource } from "../data-source";
import { Metrics } from "../entities/Metrics";

export const createMetrics = async (metricsData: Partial<Metrics>) => {
    const metricsRepository = AppDataSource.getRepository(Metrics);
    const newMetrics = metricsRepository.create(metricsData);
    await metricsRepository.save(newMetrics);
    return newMetrics;
};
