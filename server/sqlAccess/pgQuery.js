const {Pool, Client} = require("pg");
const pool = new Pool({
    user: 'postgres',
    password: 'Word@6802',
    host: 'localhost',
    port: 3030,
    database: 'InventoryDB',
});
async function runQuery() {
    try {
        let res = await pool.query('SELECT id,name,price FROM Parts WHERE price < $1',[20]);
        res.rows.forEach(row => {
            console.log(`row:${JSON.stringify(row,null,2)}`);
        })
    }
    catch (err) {
        console.log(`Error in query:${err}`);
    }

}
runQuery().then((res)=>{
    console.log('query done');
    pool.end().then(()=>{
        console.log('query done');
    })
})