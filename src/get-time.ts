export default function getTime(): string {
    const date: Date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
