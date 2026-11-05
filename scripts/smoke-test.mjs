// Run against a running local app: node --env-file=.env scripts/smoke-test.mjs
// Only the two uniquely named records created here are deleted by this script.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoClient, ObjectId } from 'mongodb';

const base = new URL(process.argv[2] || 'http://127.0.0.1:5176').origin;
const testTitles = [`ScreenStack Test ${randomUUID()}`, `ScreenStack Poster Test ${randomUUID()}`];
const client = new MongoClient(process.env.DB_URI);
await client.connect();
const collection = client.db('ScreenStackDB').collection('movies');
const originalCount = await collection.countDocuments();

function post(path, values = {}) {
  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { origin: base, accept: 'text/html', 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(values),
    redirect: 'manual'
  });
}

try {
  const listResponse = await fetch(`${base}/movies`);
  assert.equal(listResponse.status, 200);
  const list = await listResponse.text();
  assert.equal((list.match(/<article class="movie-card/g) || []).length, originalCount);
  assert.ok(!list.includes(process.env.DB_URI), 'The private database URI must not be exposed');
  assert.equal((await fetch(`${base}/`)).status, 200);
  assert.equal((await fetch(`${base}/movies/create`)).status, 200);
  assert.equal((await fetch(`${base}/images/placeholder.jpg`)).status, 200);
  console.log(`OK: overview shows ${originalCount} database films; home, form and poster load.`);

  assert.equal((await fetch(`${base}/movies/not-an-id`)).status, 404);
  assert.equal((await fetch(`${base}/movies/000000000000000000000000`)).status, 404);
  console.log('OK: invalid and missing film IDs return 404.');

  const invalid = await post('/movies/create', { title: ' ', year: '2023.5', length: '-10', poster: 'javascript:alert(1)' });
  assert.equal(invalid.status, 400);
  const invalidHtml = await invalid.text();
  assert.ok(invalidHtml.includes('title-error') && invalidHtml.includes('poster-error'));
  assert.ok(invalidHtml.includes('2023.5'), 'Submitted input must survive a validation error');
  assert.equal(await collection.countDocuments(), originalCount);
  console.log('OK: server rejects invalid input and preserves the entered values.');

  for (const [index, title] of testTitles.entries()) {
    const poster = index === 0 ? '' : `${base}/images/placeholder.jpg`;
    const created = await post('/movies/create', { title, year: '2023', length: '114', poster });
    assert.equal(created.status, 303);
    const location = created.headers.get('location');
    assert.match(location, /^\/movies\/[a-f0-9]{24}$/);
    const id = location.split('/').at(-1);
    const document = await collection.findOne({ _id: new ObjectId(id) });
    assert.equal(document.title, title);
    assert.equal(document.year, 2023);
    assert.equal(document.length, '114 Minuten');
    assert.equal(document.poster, poster || '/images/placeholder.jpg');
    assert.deepEqual(document.actors, []);
    assert.equal(document.watchlist, false);

    const detail = await fetch(`${base}${location}`);
    assert.equal(detail.status, 200);
    const detailHtml = await detail.text();
    assert.ok(detailHtml.includes(title) && detailHtml.includes('114 Minuten'));
    assert.ok((await (await fetch(`${base}/movies`)).text()).includes(title));
    assert.equal(await collection.countDocuments(), originalCount + 1);

    const deleted = await post(`${location}?/delete`);
    assert.equal(deleted.status, 303);
    assert.equal(deleted.headers.get('location'), '/movies');
    assert.equal(await collection.findOne({ _id: new ObjectId(id) }), null);
    assert.equal((await fetch(`${base}${location}`)).status, 404);
    assert.ok(!(await (await fetch(`${base}/movies`)).text()).includes(title));
    assert.equal(await collection.countDocuments(), originalCount);
    console.log(`OK: create, persist, redirect, display and delete (${index === 0 ? 'default poster' : 'custom poster URL'}).`);
  }
} finally {
  // Exact, random test titles prevent cleanup from touching existing films.
  await collection.deleteMany({ title: { $in: testTitles } });
  const finalCount = await collection.countDocuments();
  await client.close();
  console.log(`Database records after cleanup: ${finalCount} (before: ${originalCount}).`);
}
