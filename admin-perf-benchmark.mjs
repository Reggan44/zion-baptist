const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const leaderSeedData = Array.from({ length: 10 }, (_, i) => ({
  name: `Leader ${i}`,
  role: 'Role',
  bio: 'Bio',
  image: 'img',
  responsibilities: [],
  order: i
}));
const current = leaderSeedData.slice(0, 5).map(l => ({ ...l, id: l.name }));

async function updateLeader(id, data) {
  await sleep(50); // Simulate DB latency
}
async function addLeader(data) {
  await sleep(50); // Simulate DB latency
}

async function sequential() {
  const start = performance.now();
  let createdCount = 0;
  let updatedCount = 0;

  for (const seedItem of leaderSeedData) {
    const leaderItem = seedItem;
    const normalizedSeedName = leaderItem.name.toLowerCase().trim();
    const existing = current.find(l => l.name.toLowerCase().trim() === normalizedSeedName);

    if (existing) {
      await updateLeader(existing.id, {
        role: leaderItem.role,
        bio: leaderItem.bio,
        image: leaderItem.image,
        responsibilities: leaderItem.responsibilities || [],
        order: leaderItem.order || 0
      });
      updatedCount++;
    } else {
      await addLeader({
        ...seedItem,
        responsibilities: seedItem.responsibilities || [],
        order: seedItem.order || 0
      });
      createdCount++;
    }
  }

  const end = performance.now();
  console.log(`Sequential: ${end - start}ms`);
}

async function concurrent() {
  const start = performance.now();

  const promises = leaderSeedData.map(async (seedItem) => {
    const leaderItem = seedItem;
    const normalizedSeedName = leaderItem.name.toLowerCase().trim();
    const existing = current.find(l => l.name.toLowerCase().trim() === normalizedSeedName);

    if (existing) {
      await updateLeader(existing.id, {
        role: leaderItem.role,
        bio: leaderItem.bio,
        image: leaderItem.image,
        responsibilities: leaderItem.responsibilities || [],
        order: leaderItem.order || 0
      });
      return 'updated';
    } else {
      await addLeader({
        ...seedItem,
        responsibilities: seedItem.responsibilities || [],
        order: seedItem.order || 0
      });
      return 'created';
    }
  });

  const results = await Promise.all(promises);
  const createdCount = results.filter(r => r === 'created').length;
  const updatedCount = results.filter(r => r === 'updated').length;

  const end = performance.now();
  console.log(`Concurrent: ${end - start}ms`);
}

async function run() {
  await sequential();
  await concurrent();
}
run();
