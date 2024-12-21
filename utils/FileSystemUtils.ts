import * as FileSystem from 'expo-file-system';
import { lastElement } from './ArrayUtils';


export async function createDirectoryIfNotExists(directoryUri: string) {
    const directoryInfo = await FileSystem.getInfoAsync(directoryUri);
    if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
    }
}

export function getFileExtension(pathToFile: string) {
    const lastIndexOfDot = pathToFile.lastIndexOf(".");
    return pathToFile.substring(lastIndexOfDot + 1);
}

export function getFileName(pathToFile: string) {
    return lastElement(pathToFile.split('/'));
}