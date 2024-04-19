import { Express, Request, Response } from "express";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


// create options for swaggerJsdoc options
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'NavFinder Apis Documentation',
            version: '1.0.0',
            description: 'This is the documentation of apis used in NavFinder project it contains all the details of the apis used in the project.',
        },
        // servers: [
        //     {
        //       url: 'http://localhost:3000',
        //       description: 'Development server',
        //     },
        //   ],
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    schema: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            { bearerAuth: [], }
        ]
    },
    apis: [path.resolve(__dirname, '../../swagger.yaml')],
};

const swaggerSPec = swaggerJsdoc(options);
function swaggerDocs(app: Express, port: number) {
    // 1.Swagger page
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSPec, { explorer: true }))

    // Docs in Json Format
    app.get('docs-json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', "application/json");
        res.send(swaggerSPec)
    })
}
export { swaggerDocs }