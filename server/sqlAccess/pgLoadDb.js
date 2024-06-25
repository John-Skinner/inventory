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
async function insertProduct(id,name,upc,buildCost,retailPrice) {

        let v = [id,name,upc,buildCost,retailPrice];
        await pool.query('INSERT INTO Products(id,name,upc,buildCost,retailCost) VALUES ($1,$2,$3,$4,$5)',v);

}
async function insertProductParts(productId,partId,quantity) {

    let v = [productId,partId,quantity];
    await pool.query('INSERT INTO ProductParts(productId,partId,quantity) VALUES ($1,$2,$3)',v);

}
async function insertSupplier(id,name,address,phone) {

    let v = [id,name,address,phone];
    await pool.query('INSERT INTO Suppliers(id,name,address,phone) VALUES ($1,$2,$3,$4)',v);

}
async function insertPartsOrder(id,partId,quantity,supplier,expectedDelivery) {

    let v = [id,partId,quantity,supplier,expectedDelivery];
    await pool.query('INSERT INTO PartsOrders(id,partId,quantity,supplier,expectedDelivery) VALUES ($1,$2,$3,$4,$5)',v);

}
async function insertCustomer(id,name,address) {

    let v = [id,name,address];
    await pool.query('INSERT INTO Customers(id,name,address) VALUES ($1,$2,$3)',v);

}
async function insertCustomerOrder(id,customerId,orderId) {

    let v = [id,customerId,orderId];
    await pool.query('INSERT INTO CustomerOrders(id,customerId,orderId) VALUES ($1,$2,$3)',v);

}
async function insertOrder(id,customerId,dueDate,status,shipmentDate) {

    let v = [id,customerId,dueDate,status,shipmentDate];
    await pool.query('INSERT INTO Orders(id,customerId,dueDate,status,shipmentDate) VALUES ($1,$2,$3,$4,$5)',v);

}
async function DefineAndLoadTables() {
    try {
        await pool.query('BEGIN');

        /* Parts */
        await pool.query('DROP TABLE IF EXISTS Parts');
        let res = await pool.query(
            'CREATE TABLE Parts (id INTEGER,' +
            'supplier INTEGER,' +
            'name CHAR(24),' +
            'description CHAR(240),' +
            'quantity INTEGER,' +
            'price NUMERIC(10,2))'
        );
        await insertPart(1,1,'chip1','a chip',200,2.95);
        await insertPart(2,2,'connector','edge connector',1,3.45);
        await insertPart(3,2,'fan','cooling fan',30,4.50);
        await insertPart(4,1,'8 mm screw','8 mm screw',200,0.08);
        await insertPart(5,1,'1000 ohm resister','1000 ohm resister',140,0.02);

        /* Products */
        res = await pool.query('DROP Table IF EXISTS Products');

        res = await pool.query(
            'CREATE TABLE Products ' +
            '(id INTEGER,' +
            'name CHAR(24),' +
            'upc INTEGER,' +
            'buildCost NUMERIC(10,2),' +
            'retailCost NUMERIC(10,2))'
        )
        await insertProduct(1,'board1',123,50.00,80.00);
        await insertProduct(2,'board2',124,20.00,25.30);
        await insertProduct(3,'board3',567,1.35,2.50);

        /* ProductParts */
        await pool.query('DROP TABLE IF EXISTS ProductParts');
        res = await pool.query(
            'CREATE TABLE ProductParts (productId INTEGER,' +
            'partId INTEGER,' +
            'quantity INTEGER)'
        );
        await insertProductParts(1,1,1);
        await insertProductParts(1,2,20);
        await insertProductParts(1,3,1);

        /* Suppliers */
        await pool.query('DROP TABLE IF EXISTS Suppliers');
        res = await pool.query(
            'CREATE TABLE Suppliers (id INTEGER,' +
            'name CHAR(24),' +
            'address CHAR(240),' +
            'phone CHAR(10))'
        );
        await insertSupplier(1,'Digikey','101 1st Ave, New York, New York, NY, 12345',1234567890);
        await insertSupplier(2,'Jameco','303 Main St, Cleveland, OH, 23456',9876543210);

        /* PartsOrders */
        await pool.query('DROP TABLE IF EXISTS PartsOrders');
        res = await pool.query(
            'CREATE TABLE PartsOrders (id INTEGER,' +
            'partID INTEGER,' +
            'quantity INTEGER,' +
            'supplier INTEGER,' +
            'expectedDelivery DATE)'
        );
        await insertPartsOrder(1,5,100,1,'6/21/2025');
        await insertPartsOrder(2,3,5,2,'7/25/2025');

        /* Customers */
        await pool.query('DROP TABLE IF EXISTS Customers');
        res = await pool.query(
            'CREATE TABLE Customers (id INTEGER,' +
            'name CHAR(80),' +
            'address CHAR(240))'
        );

        await insertCustomer(1,'Harris Corp','1 Main St, Knoxville, TN, 12345');
        await insertCustomer(2,'Jim Smith','202 Washington Ave, Minneapolis, MN 55110');
        await insertCustomer(3,'Blue Fish Industries', '605 Atlantic Ave, Fishingtown, ME 010101');

        /* CustomerOrders */
        await pool.query('DROP TABLE IF EXISTS CustomerOrders');
        res = await pool.query(
            'CREATE TABLE CustomerOrders (id INTEGER,' +
            'customerId INTEGER,' +
            'orderId INTEGER)'
        );
        await insertCustomerOrder(1,1,1);
        await insertCustomerOrder(2,2,1);
        await insertCustomerOrder(3,1,2);


        /* Orders */
        await pool.query('DROP TABLE IF EXISTS Orders');
        res = await pool.query(
            'CREATE TABLE Orders (id INTEGER,' +
            'customerId INTEGER,' +
            'dueDate DATE,' +
            'status CHAR(10),' +
            'shipmentDate DATE)'
        );
        await insertOrder(1,1,'8/15/2024','Pending','1/1/2021');
        await insertOrder(2,2,'10/25/2024','Completed','5/15/2024');

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
