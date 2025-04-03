import path from "path";
import fs from 'fs';

export const writeToFile = (filePath:string, data: object,) => {
    return new Promise((resolve, reject)  => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error("Ошибка при записи в файл:", err);
                return reject(err);
            }
            return resolve(null);
        });
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
