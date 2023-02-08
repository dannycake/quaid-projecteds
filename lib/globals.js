export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const print = (...args) => console.log(`[${new Date().toLocaleTimeString()}]`, ...args);
export const repeat = async (fn, delay = 1000) => {
    for (;;) {
        await fn();
        await sleep(delay);
    }
}