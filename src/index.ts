import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';

import 'dotenv/config';

import http from 'http';

const { PORT } = process.env;

import server from "./server/database_sqlite";
//import server from "./server/database_postgresql";

http.createServer({
}, server)
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);

    console.log(`API DOCUMENTAÇÃO: http://localhost:${PORT}/api/doc`)   

    server.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))  

    console.log(`TESTE - SERVIDOR: http://localhost:${PORT}`)    
  });
