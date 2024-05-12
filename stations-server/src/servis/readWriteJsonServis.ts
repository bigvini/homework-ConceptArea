import { Request, Response } from 'express';
import { readFileSync, writeFile } from 'fs';

export const servisGetStations = (req: Request, res: Response): void => {
    try {
        const jsonData = readFileSync('stations.json', 'utf8');
        const data: any = JSON.parse(jsonData);
        res.json(data);
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const servisGetStation = (req: Request, res: Response): void => {
    try {
        const jsonData = readFileSync('stations.json', 'utf8');
        const data: any[] = JSON.parse(jsonData);
        const station = data.find((st: any) => st.id === req.params.id);
        if (station) {
            res.json(station);
        } else {
            res.status(404).send('Станція не знайдена');
        }
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const servisCreateStation = (req: Request, res: Response): void => {
    try {
        const station = req.body;
        if (!station) {
            res.status(400).send('Не вказано дані про станцію');
        }
        const jsonData = readFileSync('stations.json', 'utf8');
        const data: any[] = JSON.parse(jsonData);
        const stationId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const newStation = { ...station, id: stationId };
        data.push(newStation);
        writeFile('stations.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Помилка сервера');
            }
            res.json(newStation);
        });
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const servisDeleteStation = (req: Request, res: Response): void => {
    try {
        const jsonData = readFileSync('stations.json', 'utf8');
        const data: any[] = JSON.parse(jsonData);
        const stationId = parseInt(req.params.id);
        const stationIndex = data.findIndex((station: any) => station.id === stationId);
        if (stationIndex !== -1) {
            data.splice(stationIndex, 1);
            writeFile('stations.json', JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Помилка сервера' });
                }
                res.json({ message: 'Станція успішно видалена' });
            });
        } else {
            res.status(404).json({ error: 'Станція не знайдена' });
        }
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};

export const servisUpdateStation = (req: Request, res: Response): void => {
    try {
        const jsonData = readFileSync('stations.json', 'utf8');
        const data: any[] = JSON.parse(jsonData);
        const stationId = parseInt(req.params.id);
        const stationIndex = data.findIndex((st: any) => st.id === stationId);
        if (stationIndex === -1) {
            res.status(404).json({ error: 'Станція не знайдена' });
        }
        const updatedStation = { ...data[stationIndex], ...req.body };
        data[stationIndex] = updatedStation;
        writeFile('stations.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Помилка сервера');
            }
            return res.json({ message: 'Станція успішно оновлена', updatedStation });
        });
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        res.status(500).send('Помилка сервера');
    }
};
