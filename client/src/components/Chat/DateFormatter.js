export default function DateFormatter(newDate) {
    const date = new Date(newDate);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
        hours,
        minutes,
        seconds
    };
}
