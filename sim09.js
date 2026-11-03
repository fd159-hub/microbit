// 依 main.ts 重現點陣邏輯；不模擬硬體排程或麥克風。
function createBlowModel(random = Math.random) {
    const pixels = Array(25).fill(false);
    return {
        pixels,
        fill() { pixels.fill(true); },
        reset() { pixels.fill(false); },
        attempt(level, x, y) {
            if (level <= 180) return { kind: 'quiet' };
            if (x === undefined) x = Math.floor(random() * 5);
            if (y === undefined) y = Math.floor(random() * 5);
            if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x > 4 || y < 0 || y > 4) throw Error('Invalid coordinates');
            if (!pixels[y * 5 + x]) return { kind: 'empty', x, y };
            pixels[y * 5 + x] = false;
            if (y > 0) pixels[(y - 1) * 5 + x] = true;
            return { kind: y === 0 ? 'out' : 'move', x, y, destination: y - 1 };
        },
        round(level) { return Array.from({ length: 4 }, () => this.attempt(level)); }
    };
}
