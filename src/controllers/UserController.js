const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

module.exports = {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;

            const userExists = await knex('users').where({ email }).first();

            if (userExists) {
                throw new AppError('Email já cadastrado');
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const [user] = await knex('users').insert({
                name,
                email,
                password: hashedPassword,
            }).returning('*');

            return res.status(201).json({ user });
        } catch (error) {
            next(error);  
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await knex('users').where({ email }).first();

            if (!user) {
                throw new AppError('Email ou senha incorretos', 401);
            }

            const passwordMatched = await bcrypt.compare(password, user.password);

            if (!passwordMatched) {
                throw new AppError('Email ou senha incorretos', 401);
            }

            const token = jwt.sign({}, authConfig.jwt.secret, {
                subject: String(user.id),
                expiresIn: authConfig.jwt.expiresIn,
            });

            return res.json({ user, token });
        } catch (error) {
            next(error);
        }
    },

    async profile(req, res, next) {
        try {
            const { userId } = req;

            const user = await knex('users').where({ id: userId }).first();

            if (!user) {
                throw new AppError('Usuário não encontrado', 404);
            }

            return res.json(user);
        } catch (error) {
            next(error);
        }
    }
};
