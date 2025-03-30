import path from "path";
import fs from 'fs';

export const writeToFile = (filePath:string, data: object, callback: (err: Error | null) => void) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error("Ошибка при записи в файл:", err);
            return callback(err);
        }
        callback(null);
    });
};

export const getStoragePath = () => {
    return path.join(
        process.cwd(),
        "src",
        "mocks",
        "projects.json"
    );
}