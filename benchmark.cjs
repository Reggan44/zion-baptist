const { performance } = require('perf_hooks');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const current = [
  { id: '1', name: 'Existing Leader', role: 'Elder' }
];

const leaderSeedData = Array.from({ length: 20 }).map((_, i) => ({
  name: i === 0 ? 'Existing Leader' : `Leader ${i}`,
  role: 'Elder',
  bio: 'Bio',
  image: '',
  responsibilities: [],
  order: i
}));

async function sequential() {
    let createdCount = 0;
    let updatedCount = 0;

    for (const seedItem of leaderSeedData) {
        const leaderItem = seedItem;
        const normalizedSeedName = leaderItem.name.toLowerCase().trim();
        const existing = current.find(l => l.name.toLowerCase().trim() === normalizedSeedName);

        if (existing) {
            await delay(50); // mock updateLeader
            updatedCount++;
        } else {
            await delay(50); // mock addLeader
            createdCount++;
        }
    }
    return {createdCount, updatedCount};
}

async function concurrent() {
    const promises = leaderSeedData.map(async (seedItem) => {
        const leaderItem = seedItem;
        const normalizedSeedName = leaderItem.name.toLowerCase().trim();
        const existing = current.find(l => l.name.toLowerCase().trim() === normalizedSeedName);

        if (existing) {
            await delay(50);
            return 'updated';
        } else {
            await delay(50);
            return 'created';
        }
    });

    const results = await Promise.all(promises);
    const createdCount = results.filter(r => r === 'created').length;
    const updatedCount = results.filter(r => r === 'updated').length;
    return {createdCount, updatedCount};
}

async function run() {
    console.log("Running sequential...");
    const start1 = performance.now();
    await sequential();
    const end1 = performance.now();
    console.log(`Sequential: ${end1 - start1} ms`);

    console.log("Running concurrent...");
    const start2 = performance.now();
    await concurrent();
    const end2 = performance.now();
    console.log(`Concurrent: ${end2 - start2} ms`);
}

run();
