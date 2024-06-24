const {Pool, Client} = require("pg");
const pool = new Pool({
    user: 'postgres',
    password: 'Word@6802',
    host: 'localhost',
    port: 3030,
    database: 'InventoryDB',
});
async function insertPart(id,supplier,name,description,quantity,price) {
    let v = [id,supplier,name,description,quantity,price];
    await pool.query('INSERT INTO Parts(id,supplier,name,description,quantity,price) VALUES ($1,$2,$3,$4,$5,$6)',
        v);

}
async function DefineAndLoadTables() {
    try {
        await pool.query('BEGIN');
        await pool.query('DROP TABLE Parts');
        let res = await pool.query(
            'CREATE TABLE Parts (id INTEGER,' +
            'supplier INTEGER,' +
            'name CHAR(24),' +
            'description CHAR(240),' +
            'quantity INTEGER,' +
            'price NUMERIC(10,2))'
        )
        await insertPart(1,1,'chip1','a chip',200,2.95);
        await insertPart(2,2,'connector','edge connector',1,3.45);
        await insertPart(3,2,'fan','cooling fan',30,4.50);
        await insertPart(4,1,'8 mm screw','8 mm screw',200,0.08);
        await insertPart(5,1,'1000 ohm resister','1000 ohm resister',140,0.02);

        await pool.query('COMMIT');

    }
    catch (error) {
        console.log(`Error in DefineAndLoadTables: ${error}`);
    }
}
DefineAndLoadTables().then((res)=>{
    console.log('loading complete');
    pool.end().then(()=>{
        console.log('end of connection');
    })
})
