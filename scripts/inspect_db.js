const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: 'postgresql://postgres.pefosvhxxxyldtqigthz:2593884640362161@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  let output = [];
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    for (let row of res.rows) {
      let tableInfo = { name: row.table_name, columns: [], sample: null };
      const colRes = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
      `, [row.table_name]);
      
      tableInfo.columns = colRes.rows.map(c => ({ name: c.column_name, type: c.data_type }));
      
      try {
        const sampleRes = await client.query(`SELECT * FROM "${row.table_name}" LIMIT 2`);
        tableInfo.sample = sampleRes.rows;
      } catch (e) {}
      output.push(tableInfo);
    }
    fs.writeFileSync('scripts/db_schema.json', JSON.stringify(output, null, 2));
    console.log('Saved to scripts/db_schema.json');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
