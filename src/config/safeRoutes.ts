import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


import ActiveSession from '../models/postgresql/activeSession';
import { connection } from '../server/database_postgresql_conf';

require('dotenv/config');

export const checkToken = (req: Request, res: Response, next: NextFunction) => {

  const secrets = process.env.SECRET as string;
  const token = String(req.headers.authorization || req.body.token || req.headers["x-access-token"]);

  // Vereficar esta enviado o Token
  if (!token) {
    return res.status(401).send({
      auth: false,
      message: 'Acesso negado'
    });
  }

  // Vereficar se expirou o token
  jwt.verify(token, secrets, function (err, decoded) {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Token de acesso expirou'
      });      
    }   
    console.log("User Id: " + decoded) 
  });

  // Vereficar se esta no banco de dados
  if (process.env.TOKEN_BANCO_DADOS) {
    const activeSessionRepository = connection!.getRepository(ActiveSession);

    activeSessionRepository.find({ token }).then((session) => {      

      if (session.length === 1) {
        console.log('Token OK');
        return next();
      }
      return res.json({
        success: false,
        msg: 'O usuário não está conectado'
      });
    });
  }

  //next();

};

export const jwtCheck = (req: Request, res: Response, next: NextFunction) => {
  const secrets = process.env.SECRET as string;
  const token = String(req.headers.authorization || req.body.token);

  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, secrets, function (err, decoded) {
    if (err)
      return res.status(500).send({
        auth: false,
        message: 'Token inválido.'
      });
    console.log("User Id: " + decoded)
    next();
  });
};

