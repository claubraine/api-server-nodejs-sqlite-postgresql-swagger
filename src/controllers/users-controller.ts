import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { connection } from '../server/database_sqlite_conf';
//import { connection } from '../server/database_postgresql_conf';

import ActiveSession from '../models/sqlite/activeSession';
//import ActiveSession from '../models/postgresql/activeSession';

import User from '../models/sqlite/user';
//import User from '../models/postgresql/user';



const userTokenSchema = Joi.object().keys({
    userToken: Joi.string().required().messages({
        'string.empty': `{{#label}} é um campo obrigatório`
    }),
});



const userSchema = Joi.object().keys({
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} não é um valor válido`,
        'string.empty': `{{#label}} é um campo obrigatório`
    }),
    username: Joi.string().alphanum().min(4).max(15).optional().messages({
        'string.alphanum': '{{#label}} deve conter apenas caracteres alfanuméricos',
        'string.min': '{{#label}} comprimento deve ser pelo menos {{#limit}} caracteres no mínimo',
        'string.max': '{{#label}} comprimento deve ter {{#limit}} caracteres no máximo',
    }),
    password: Joi.string().required().messages({
        'string.empty': `{{#label}} é um campo obrigatório`
    }),
});



const login = async (req: Request, res: Response) => {

    // Joy Validation
    const result = userSchema.validate(req.body);

    if (result.error) {

        /* #swagger.responses[422] = {                 
        success: false,          
        msg:  'Erro de validação: ...' } */

        res.status(422).json({
            success: false,
            msg: `Erro de validação: ${result.error.details[0].message}`,
        });
        return;
    }

    const { email } = req.body;
    const { password } = req.body;

    const userRepository = connection!.getRepository(User);
    const activeSessionRepository = connection!.getRepository(ActiveSession);
    userRepository.findOne({ email }).then((user) => {

        if (!user) {
            /* #swagger.responses[422] = {                 
            success: false,          
            msg: 'Credenciais erradas ou usuário não registrado' } */

            return res.json({
                success: false,
                msg: 'Credenciais erradas ou usuário não registrado'
            });
        }

        if (!user.password) {

            /* #swagger.responses[422] = {                 
            success: false,          
            msg: 'Nenhuma senha' } */

            return res.json({
                success: false,
                msg: 'Nenhuma senha'
            });
        }

        bcrypt.compare(password, user.password, (_err2, isMatch) => {
            if (isMatch) {

                if (!process.env.SECRET) {
                    throw new Error('SECRET não fornecido');
                }

                const token = jwt.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }, process.env.SECRET, {
                    expiresIn: 86400, // 1 week
                });

                const query = {
                    userId: user.id,
                    token,
                    status: true
                };

                activeSessionRepository.save(query);

                // Delete the password (hash)
                (user as { password: string | undefined }).password = undefined;
                (user as { confirmacao_token: string | undefined }).confirmacao_token = undefined;
                (user as { user_token: string | undefined }).user_token = undefined;

                /* #swagger.responses[200] = {                 
                  success: true,          
                  token: '',
                  user: '' } */

                return res.json({
                    success: true,
                    token,
                    user,
                });

            }
            /* #swagger.responses[422] = {                 
            success: false,          
            msg: 'Credenciais erradas ou usuário não registrado' } */

            return res.json({
                success: false,
                msg: 'Credenciais erradas ou usuário não registrado'
            });
        });
    });

}

const logout = async (req: Request, res: Response) => {

    const { token } = req.body;
    const activeSessionRepository = connection!.getRepository(ActiveSession);

    activeSessionRepository.delete({ token })
        .then(
            () => res.json({
                success: true
            })
        )
        .catch(() => {
            res.json({
                success: false,
                msg: 'Token revogado'
            });
        });
}


const post_checkSession = async (_req: Request, res: Response) => {

    res.json({
        success: true
    });

}

const post = async (req: Request, res: Response) => {
    // Joy Validation
    const result = userSchema.validate(req.body);
    if (result.error) {

        res.status(422).json({
            success: false,
            msg: `Erro de validação: ${result.error.details[0].message}`,
        });
        return;
    }

    const { username, email, password } = req.body;

    const userRepository = connection!.getRepository(User);

    userRepository.findOne({ email }).then((user) => {
        if (user) {

            /* #swagger.responses[200] = {                 
            success: false, 
            msg: 'Email já existe' } */

            res.json({
                success: false,
                msg: 'Email já existe'
            });

        } else {
            bcrypt.genSalt(10, (_err, salt) => {
                bcrypt.hash(password, salt).then((hash) => {

                    let confirmacao_token = bcrypt.hashSync(Date() + username + email, salt);
                    let user_token = bcrypt.hashSync(email + username + Date(), salt);

                    // Retirando os caracteres especiais para usar em link de confirmação ou acesso
                    confirmacao_token = confirmacao_token.replace(/[^a-zA-Z0-9]/g, '');
                    user_token = user_token.replace(/[^a-zA-Z0-9]/g, '');

                    const query = {
                        username,
                        email,
                        password: hash,
                        status: true,
                        confirmacao_registro: false,
                        confirmacao_token,
                        user_token: user_token
                    };

                    userRepository.save(query).then((u) => {

                        /* #swagger.responses[200] = {                 
                        success: true, 
                        userID: '', 
                        msg: 'Usuário registrado com sucesso' } */

                        res.json({
                            success: true,
                            userID: u.id,
                            msg: 'Usuário registrado com sucesso'
                        });
                    });
                });
            });
        }
    });

}

const userPut = async (req: Request, res: Response) => {

    let { userToken, username, email, password } = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    let result = userTokenSchema.validate({ userToken });

    if (result.error) {
        return res.status(422).json({
            success: false,
            msg: `Erro de validação..: ${result.error.details[0].message}`,
        });
    }

    const userRepository = connection!.getRepository(User);

    let newvalues = { username, email, password };

    const query = { user_token: userToken };

    if (!username) delete newvalues['username'];
    if (!email) {
        delete newvalues['email']
    } else {
        await userRepository.findOne({ email }).then((user) => {
            if (user?.user_token != userToken) {
                return res.status(500).json({
                    success: false,
                    msg: 'E-mail ja utilizado'
                });
            }
        })
    }
    if (!password) {
        delete newvalues['password'];

        console.log('sdsdd')

        await userRepository.update(query, newvalues).then(() => {
            res.status(200).json({
                success: true,
                msg: 'Usuário atualizado com sucesso'
            })
        },
        ).catch(() => {

            return res.status(500).json({
                success: false,
                msg: 'Erro ao atualizar usuário'
            });
        });

    } else {
        bcrypt.genSalt(10, async (_err, salt) => {
            await bcrypt.hash(password, salt).then(async (hash) => {

                newvalues['password'] = hash;

                await userRepository.update(query, newvalues).then(() => {
                    res.status(200).json({
                        success: true,
                        msg: 'Usuário atualizado com sucesso'
                    })
                },
                ).catch(() => {

                    return res.status(500).json({
                        success: false,
                        msg: 'Erro ao atualizar usuário'
                    });
                });
            });
        });
    };



}

const get_by_email = async (req: Request, res: Response) => {
    const email = req.params.email;

    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    console.log('email:', email);

    const userRepository = connection!.getRepository(User);

    userRepository.findOne({ email: email }).then(((user) => {

        if (user) {

            /* #swagger.responses[401] = {                 
              success: true, 
              user: {
                id: '',
                username: '',
                email: '',
              }
             } */

            res.status(200).json({
                success: true,
                user: {
                    id: user?.id,
                    username: user?.username,
                    email: user?.email,
                    date: user?.date,
                }
            });
        } else {
            console.log('nenhum registro encontrado');

            /* #swagger.responses[401] = {                 
            success: false, 
            msg: 'nenhum registro encontrado'
            } */

            res.status(401).json({
                success: false,
                mensage: 'nenhum registro encontrado'
            });
        }
    }));

}

const get_by_userToken = async (req: Request, res: Response) => {
    const userToken = req.params.userToken;

    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    console.log('userToken:', userToken);

    const userRepository = connection!.getRepository(User);

    userRepository.findOne({ user_token: userToken }).then(((user) => {

        if (user) {

            /* #swagger.responses[401] = {                 
              success: true, 
              user: {
                id: '',
                username: '',
                email: '',
              }
             } */

            res.status(200).json({
                success: true,
                user: {
                    id: user?.id,
                    username: user?.username,
                    email: user?.email,
                    date: user?.date,
                }
            });
        } else {
            console.log('nenhum registro encontrado');

            /* #swagger.responses[401] = {                 
            success: false, 
            msg: 'nenhum registro encontrado'
            } */

            res.status(401).json({
                success: false,
                mensage: 'nenhum registro encontrado'
            });
        }
    }));

}

const get_by_id = async (req: Request, res: Response) => {

    const userID = req.params.userID;

    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    console.log('userID:', userID);

    const userRepository = connection!.getRepository(User);

    userRepository.findOne({ id: userID }).then(((user) => {

        if (user) {

            /* #swagger.responses[401] = {                 
              success: true, 
              user: {
                id: '',
                username: '',
                email: '',
              }
             } */

            res.status(200).json({
                success: true,
                user: {
                    id: user?.id,
                    username: user?.username,
                    email: user?.email,
                    date: user?.date,
                }
            });
        } else {
            console.log('nenhum registro encontrado');

            /* #swagger.responses[401] = {                 
            success: false, 
            msg: 'nenhum registro encontrado'
            } */

            res.status(401).json({
                success: false,
                mensage: 'nenhum registro encontrado'
            });
        }
    }));

}

const all = async (_req: Request, res: Response) => {
    
    const userRepository = connection!.getRepository(User);

    userRepository.find({}).then((users: any[]) => {

        users = users.map((item) => {
            const x = item;
            (x as { password: string | undefined }).password = undefined;
            return x;
        });

        /* #swagger.responses[200] = {                 
          success: true, 
          users: {
            "id": "",
            "username": "",
            "email": "",
            "date": ""
          }       
        } */

        res.json({
            success: true,
            users
        }
        );

    }).catch(

        /* #swagger.responses[401] = {                 
        success: false
        } */

        () => res.json({ success: false })

    );

};

export default { all, get_by_id, get_by_userToken, get_by_email, userPut, post, post_checkSession, logout, login };
