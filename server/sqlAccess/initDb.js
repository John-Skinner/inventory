
var pg = require('pg');
const {Client} = require('pg');
var transaction;

/**
 * inventoryClient is used to connect back to the database
 * only for database initialization.  For updating, rely
 * on sequelize.
 */
const inventoryClient = new Client({
    user: 'postgres',
    password: 'Word@6802',
    host: 'localhost',
    port: 3030
});


/**
 * global declaration of the sequelize connection.
 */
let db;

/**
 * make the empty tables.
 * @param afterCreate - called to create the individual tables.
 * @returns {Promise<void>}
 */
async function createEmptyDB(afterCreate) {
    let connectStr = "postgres://" + "postgres" + ";" + "Word@6802" + "@" + "127.0.0.1" + "/postgres";
    await inventoryClient.connect();

    await inventoryClient.query('CREATE DATABASE InventoryDB;', (err) => {
        console.log(`error? ${err}`);
        afterCreate();
    });
    await inventoryClient.end();
    console.log('Successfully created database');
}


createEmptyDB(() => {

}).then(()=>{
    console.log('Empty Database created');
});
