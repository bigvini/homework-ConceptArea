import express, { Express } from "express";
import cors from "cors";
import { readFileSync, writeFile } from 'fs';
import { servisGetStations, servisGetStation, servisCreateStation, 
    servisDeleteStation, servisUpdateStation } from './servis/readWriteJsonServis';

const port: number = 3000;

class App {
    private app: Express;
    
    constructor() {
        this.app = express();
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static("public"));
        this.app.use(express.json());
        this.app.use(cors());
    }

    private registerRoutes(): void {
        this.app.get('/stations', servisGetStations);
        this.app.get('/stations/:id', servisGetStation);
        this.app.post('/stations', servisCreateStation);
        this.app.delete('/stations/:id', servisDeleteStation);
        this.app.put('/stations/:id', servisUpdateStation);
    }

    public init = async () => {
        try {
            this.registerRoutes();
            this.app.listen(port, () => {
                console.log("Server is started");
            });
        } catch (error: unknown) {
            const err = error as Error;
            console.log(err.message);
        }
    }
}

export const app = new App();
app.init().then(() => {
    console.log("Server is ok");
}).catch(() => {
    console.log("Server is not ok");
});
