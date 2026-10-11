const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const addMinistry = async () => {
    await delay(50);
};

const updateMinistry = async () => {
    await delay(50);
};

const ministrySeedData = Array.from({ length: 20 }, (_, i) => ({
    name: `Ministry ${i}`,
    iconName: 'icon',
    color: 'color',
    image: 'image',
    gallery: [],
    description: 'description',
    textColor: 'black'
}));

const current = Array.from({ length: 10 }, (_, i) => ({
    id: `id_${i}`,
    name: `Ministry ${i}`,
    iconName: 'icon',
    color: 'color',
    image: 'image',
    gallery: [],
    description: 'description',
    textColor: 'black'
}));

async function benchmark() {
    console.log("Starting baseline (Sequential)...");
    const startSeq = performance.now();
    let createdCount = 0;
    let updatedCount = 0;

    for (const seedItem of ministrySeedData) {
        const normalizedSeedName = seedItem.name.toLowerCase().trim();
        const existing = current.find(m => m.name.toLowerCase().trim() === normalizedSeedName);

        if (existing) {
            await updateMinistry();
            updatedCount++;
        } else {
            await addMinistry();
            createdCount++;
        }
    }
    const endSeq = performance.now();
    const timeSeq = endSeq - startSeq;
    console.log(`Sequential time: ${timeSeq.toFixed(2)}ms`);

    console.log("Starting optimized (Promise.all)...");
    const startOpt = performance.now();
    createdCount = 0;
    updatedCount = 0;

    const syncPromises = [];

    for (const seedItem of ministrySeedData) {
        const normalizedSeedName = seedItem.name.toLowerCase().trim();
        const existing = current.find(m => m.name.toLowerCase().trim() === normalizedSeedName);

        if (existing) {
            syncPromises.push(
                updateMinistry().then(() => { updatedCount++; })
            );
        } else {
            syncPromises.push(
                addMinistry().then(() => { createdCount++; })
            );
        }
    }
    await Promise.all(syncPromises);
    const endOpt = performance.now();
    const timeOpt = endOpt - startOpt;
    console.log(`Optimized time: ${timeOpt.toFixed(2)}ms`);

    console.log(`Speedup: ${(timeSeq / timeOpt).toFixed(2)}x (${((timeSeq - timeOpt) / timeSeq * 100).toFixed(2)}% faster)`);
}

benchmark();
