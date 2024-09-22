export class Tools {
    static randomNumber(min: number, max: number) {
        if (!max) {
            max = min;
            min = 0;
        }

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}