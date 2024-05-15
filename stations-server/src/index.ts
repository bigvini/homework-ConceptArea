import express, { Express, Request, Response } from "express";
import cors from "cors";
import { servisGetStations, servisGetStation, servisCreateStation, 
    servisDeleteStation, servisUpdateStation } from './servis/readWriteJsonServis';

const port: number = 3000;
const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/stations', async (_req: Request, res: Response) => {
    try {
        const stations = await servisGetStations();
        res.send(stations);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/stations/:id', async (req: Request, res: Response) => {
    try {
        const station = await servisGetStation(req.params.id);
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
        const newStation = await servisCreateStation(req.body);
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
        await servisDeleteStation(req.params.id);
        res.status(204).send();
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put('/stations/:id', async (req: Request, res: Response) => {
    try {
        const updatedStation = await servisUpdateStation(req.params.id, req.body);
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

app.listen(port, () => {
    console.log(`Server is started on port ${port}`);
});
