import { get } from 'lodash';
import mysql from 'mysql2/promise';

async function getDatabaseConnection() {
    const connection = await mysql.createConnection({
        host: 'eapp-db.c9q0is44kcbi.ap-southeast-1.rds.amazonaws.com',
        user: 'root',
        password: 'ZmQXUyhbfDM86jeHgTSNqA',
        database: "eApp"
    });
    return connection
}

export default getDatabaseConnection()