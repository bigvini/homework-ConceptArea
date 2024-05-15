import { readFile, writeFile } from 'fs/promises';
import { Station } from '../interfaces/station_intreface';
const pathStationJson: string = 'stations.json';

export const servisGetStations = async (): Promise<Station[]> => {
    try {
        const jsonData = await readFile(pathStationJson, 'utf8');
        console.log(jsonData);
        const data: Station[] = JSON.parse(jsonData);
        return data;
    } catch (error) {
        const err: Error = error as Error;
        console.error(err.message);
        return [];
    }
};

export const servisGetStation = async (id: string): Promise<Station | null> => {
    try {
        const jsonData = await readFile(pathStationJson, 'utf8');
        const data: Station[] = JSON.parse(jsonData);
        const stationId = parseInt(id);
        const station: Station | undefined = data.find((st: Station) => st.id === stationId);
        return station || null;
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        return null;
    }
};

export const servisCreateStation = async (station: Station | null): Promise<Station | null> => {
    try {
        if (!station) {
            console.log('Не вказано дані про станцію');
            return null;
        }
        const jsonData = await readFile(pathStationJson, 'utf8');
        const data: Station[] = JSON.parse(jsonData);
        const stationId: number = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const newStation: Station = { id: stationId, address: station.address, status: station.status };
        data.push(newStation);
        writeFile(pathStationJson, JSON.stringify(data, null, 2));
        console.log('Станція успішно додана');
        return newStation;
    } catch (error) {
        const err = error as Error;
        console.error(err.message);
        return null;
    }
};

export const servisDeleteStation = async (id: string): Promise<void> => {
    try {
        const jsonData = await readFile(pathStationJson, 'utf8');
        const data: Station[] = JSON.parse(jsonData);
        const stationId = parseInt(id);
        const stationIndex = data.findIndex((station: Station) => station.id === stationId);
        if (stationIndex !== -1) {
            data.splice(stationIndex, 1);
            writeFile(pathStationJson, JSON.stringify(data, null, 2));
            console.log('Станція успішно видалена');
        } else {
            console.log('Станція не знайдена');
        }
    } catch (error) {
        let err = error as Error;
        console.error(err.message);
    }
};

export const servisUpdateStation = async (id: string, updatedData: Partial<Station>): Promise<boolean> => {
    try {
        const jsonData = await readFile(pathStationJson, 'utf8');
        const data: Station[] = JSON.parse(jsonData);
        const stationId = parseInt(id);
        const stationIndex = data.findIndex((st: Station) => st.id === stationId);
        if (stationIndex === -1) {
            console.log('Станція не знайдена');
            return false;
        }
        const updatedStation = { ...data[stationIndex], ...updatedData };
        data[stationIndex] = updatedStation;
        await writeFile(pathStationJson, JSON.stringify(data, null, 2));
        console.log('Станція успішно оновлена');
        return true;
    } catch (error) {
        let err = error as Error;
        console.error(err.message);
        return false;
    }
};