import express, { Express, Request, Response } from "express";
import cors from "cors";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { getStations, getStation, createStation, deleteStation, updateStation } from './services/stationService';
import { createMetrics } from './services/metricsService';
import { generateRandomNumbers } from './services/generateRandomNumbersServis';
import { Metrics } from "./interfaces/metrics_intreface";

const port: number = 3000;
const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/stations', async (_req: Request, res: Response) => {
    try {
        const stations = await getStations();
        console.log("Stations: ", stations); 
        res.send(stations);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/stations/:id', async (req: Request, res: Response) => {
    try {
        const station = await getStation(Number(req.params.id));
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }
        res.json(station);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/stations', async (req: Request, res: Response) => {
    try {
        const newStation = await createStation(req.body);
        if (!newStation) {
            return res.status(400).json({ message: "Failed to create station" });
        }
        res.json(newStation);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete('/stations/:id', async (req: Request, res: Response) => {
    try {
        const stationId = Number(req.params.id);
        const station = await getStation(stationId);

        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        await deleteStation(stationId);
        res.status(204).send();
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put('/stations/:id', async (req: Request, res: Response) => {
    try {
        const updatedStation = await updateStation(Number(req.params.id), req.body);
        if (!updatedStation) {
            return res.status(404).json({ message: "Station not found" });
        }
        res.json(updatedStation);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/stations/:id/metrics', async (req: Request, res: Response) => {
    try {
        const station = await getStation(Number(req.params.id));
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        if (!station.status) {
            return res.status(400).json({ message: "Station is not active" });
        }

        let metricsStation: Metrics = {
            temperatureValue: 0,
            doseRateValue: 0,
            humidityValue: 0
        };

        metricsStation.temperatureValue = await generateRandomNumbers(10, 60, +metricsStation.temperatureValue);
        metricsStation.doseRateValue = await generateRandomNumbers(0, 12, +metricsStation.doseRateValue);
        metricsStation.humidityValue = await generateRandomNumbers(30, 90, +metricsStation.humidityValue);

        const temperatureMetrics = await createMetrics({
            name_metric: "temperatureValue",
            value_metric: metricsStation.temperatureValue.toString(),
            station: station
        });

        const doseRateMetrics = await createMetrics({
            name_metric: "doseRateValue",
            value_metric: metricsStation.doseRateValue.toString(),
            station: station
        });

        const humidityMetrics = await createMetrics({
            name_metric: "humidityValue",
            value_metric: metricsStation.humidityValue.toString(),
            station: station
        });

        return res.status(200).send([temperatureMetrics, doseRateMetrics, humidityMetrics]);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


AppDataSource.initialize().then(() => {
    app.listen(port, () => {
        console.log(`Server is started on port ${port}`);
    });
}).catch(error => console.log("TypeORM connection error: ", error));
