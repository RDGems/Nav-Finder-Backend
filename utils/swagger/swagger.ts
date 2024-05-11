import { Express, Request, Response } from "express";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
require('dotenv').config({ path: '.env' });
// create options for swaggerJsdoc options
let apisPath;
if(process.env.NODE_ENV == "PROD"){
    apisPath = [path.resolve(__dirname, '../../../swagger.yaml')];
}
else{
    apisPath = [path.resolve(__dirname, '../../swagger.yaml')];
}

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'NavFinder Apis Documentation',
            version: '1.0.0',
            description: 'This is the documentation of apis used in NavFinder project it contains all the details of the apis used in the project.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            { bearerAuth: [], }
        ]
    },
    apis:apisPath
};

const swaggerSPec = swaggerJsdoc(options);
function swaggerDocs(app: Express, port: number) {
    // 1.Swagger page
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSPec, {
        explorer: true
    }))

    // Docs in Json Format
    app.get('docs-json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', "application/json");
        res.send(swaggerSPec)
    })
}
export { swaggerDocs }