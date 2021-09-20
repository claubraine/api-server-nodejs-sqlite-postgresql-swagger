import express from 'express';

import { checkToken } from '../config/safeRoutes';
import { jwtCheck } from '../config/safeRoutes';

import UsersController from '../controllers/users-controller';

const usersRouter = express.Router();

usersRouter.post('/api/user/login', (req, res) => {
  /* 
  #swagger.tags = ['Usuarios'] 
  #swagger.description = 'Login'
   
  #swagger.parameters['dados'] = {
        "in": "body",
        "description": "Login do Usuário",
        "required": false,
          "schema": {
                "$ref": "#/definitions/post_login_req"
          }
      } 
  */
  UsersController.login(req, res);
});

usersRouter.post('/api/user/logout', checkToken, (req, res) => {
  /*
  #swagger.tags = ['Usuarios'] 
  #swagger.description = 'Logout'
   
  #swagger.parameters['dados'] = {
        "in": "body",
        "description": "Registrar novo Usuário",
        "required": false,
          "schema": {
                "$ref": "#/definitions/post_logout_req"
          }
  } 
  
  #swagger.responses[200] = {                 
    success: true         
  } 
  #swagger.responses[400] = {                 
    success: false,          
    msg: 'Token revogado' 
  }      
  */
  UsersController.logout(req, res);

});

usersRouter.post('/api/user/checkSession', jwtCheck, (_req, res) => {
  /*
  #swagger.tags = ['Usuarios'] 
  #swagger.description = 'Checar Sessão'
    
    #swagger.parameters['dados'] = {
      "in": "body",
      "description": "Logout",
      "required": false,
        "schema": {
              "$ref": "#/definitions/post_checkSession_req"
        }
    } 
  #swagger.responses[200] = {                 
          success: true 
  }   
  */
  UsersController.post_checkSession(_req, res);

});

usersRouter.post('/api/user', (req, res) => {
  /*
  #swagger.tags = ['Usuarios'] 
  #swagger.description = 'Registrar novo Usuário'
    
  #swagger.parameters['dados'] = {
        "in": "body",
        "description": "Registrar novo Usuário",
        "required": false,
          "schema": {
                "$ref": "#/definitions/post_user_req"
          }
  }   

  #swagger.responses[422] = {                 
          success: false, 
          msg: 'Erro de validação: ...' 
        } 
  
  */
  UsersController.post(req, res);
});

usersRouter.put('/api/user', checkToken, (req, res) => {
  /*
  #swagger.tags = ['Usuarios'] 
  #swagger.description = 'Editar Usuário'

  #swagger.security = [{ "Bearer": [] }] 
    
  #swagger.parameters['dados'] = {
    "in": "body",
      "description": "Editar Usuário",
      "required": false,
      "schema": {
        "$ref": "#/definitions/put_user_req"
    }
  }  
  #swagger.responses[200] = {                 
    success: true,
    msg: 'Usuári atualizado com sucesso'
  } 
  #swagger.responses[401] = {                 
    success: false, 
    msg: 'Erro. Por favor contacte o administrador'
  } 
  */

  UsersController.userPut(req, res);
});

usersRouter.delete('/api/user', checkToken, (_req, res) => {
  /*
  #swagger.tags = ['Usuarios'] 
  #swagger.description = 'Escluir Usuário'

  #swagger.parameters['dados'] = {
        "in": "body",
        "description": "Editar Usuário",
        "required": false,
          "schema": {
            "$ref": "#/definitions/delete_user_req"
          }
      }   

  #swagger.responses[200] = {                 
        success: true, 
        msg: 'Sucesso' 
  } 
  */
  res.status(200).json({ success: true, msg: 'Sucesso' });
});

usersRouter.get('/api/user/:email', (req, res) => {
  //  #swagger.tags = ['Usuarios'] 
  //  #swagger.description = 'Listar Usuário por Email'
  UsersController.get_by_email(req, res);
});

usersRouter.get('/api/user/:userToken', (req, res) => {
  //  #swagger.tags = ['Usuarios'] 
  //  #swagger.description = 'Listar Usuário por Token'
  UsersController.get_by_userToken(req, res);
});

usersRouter.get('/api/user/:userID', (req, res) => {
  //  #swagger.tags = ['Usuarios'] 
  //  #swagger.description = 'Listar Usuário por ID'
  UsersController.get_by_id(req, res);
});


usersRouter.post('/api/user/all', (_req, res) => {
  //  #swagger.tags = ['Usuarios'] 
  //  #swagger.description = 'Listar Todos Usuários'
  UsersController.all(_req, res);
});

export default usersRouter;
