const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        version: "3.0.1",
        title: "GO Exper - API SERVER",
        description: "Documentação automática gerada pelo modulo <b>swagger</b>."
    },
    host: "localhost:5000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Servidor",
            "description": "Teste conexão"
        }
    ],

    securityDefinitions: {
      
        Bearer: {
            name: "x-access-token",
            type: "apiKey",
            description: "Enter JWT Bearer token",          
            bearerFormat: "JWT",
            in: "header"
        },

       
        //petstore_auth: {
        //    type: "oauth2",
        //    authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
        //    flow: "implicit",
        //    scopes: {
        //        read_pets: "read your pets",
        //        write_pets: "modify pets in your account"
        //    }
        //}
    },

    definitions: {

        post_login_req: {          
            $email : "",
            $password : ""
        }, 

        post_logout_req: {          
            $token : "",
        } , 

        post_checkSession_req: {          
            $token : "",
        } , 

        post_user_req: {
            $username: "",
            $email: "",
            $password: ""
        },

        put_user_req: {
            $userToken: "",
            "username": "",
            "email": "",
            "password": ""
        },

        delete_user_req: {
            $userID: ""           
        },

        get_user_req: {
            $userID: "",
            $username: "",
            $email: "",
            $password: ""
        },

        POST_user_res: {
            $username: "",
            $email: "",
            $password: ""
        },

    }

}


const fs = require('fs');
const dir = './src/routes'
var path = process.cwd()

const arquivos = fs.readdirSync(dir);
let dir_arquivos = []

const getFiles = function (path, files) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, dir_arquivos);
        } else {
            dir_arquivos.push(path + '/' + file);
        }
    });
}

getFiles(dir, dir_arquivos)

const outputFile = './swagger_output.json'
const endpointsFiles = dir_arquivos

//console.log(dir_arquivos)
//console.log(arquivos)

swaggerAutogen(outputFile, endpointsFiles, doc);