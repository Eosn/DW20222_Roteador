const { client } = require('../../gvars.js')
const bcrypt = require('bcryptjs');

class User {
    /**
     * @param {string} username 
     * @param {string} passwordhash 
     * @param {number} id 
     * @param {Date} created 
     */
    constructor(username, passwordhash, id, created) {
        this.id = id
        this.created = created
        this.username = username
        this.passwordhash = passwordhash
    }

    initDDL() {
        return client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                username VARCHAR(255) NOT NULL UNIQUE,
                passwordhash TEXT NOT NULL
            );
        `)
    }

    /**
     * @returns {Promise<User>}
     */
    register() {
        return new Promise((result, reject) => {
            bcrypt.genSalt(14, (err, salt) => {
                if (err) reject(err)
                else
                    bcrypt.hash(this.passwordhash, salt, (err, hash) => {
                        if (err) reject(err)
                        else
                            client
                                .query('INSERT INTO users (username, passwordhash) VALUES ($1, $2)', [this.username, hash])
                                .then(() => this.fetch_by_username().then(result).catch(reject))
                                .catch(reject)
                    })
            })
        })
    }

    /**
     * @param {object} o 
     * @returns {User}
     */
    build_from_obj(o) {
        return new User(o.username, o.passwordhash, o.id, o.created)
    }

    /**
     * @returns {Promise<User>}
     */
    async fetch_by_username() {
        let res = await client.query('SELECT id, created, username, passwordhash FROM users WHERE username = $1::VARCHAR', [this.username])
        if (res.rowCount < 1) throw new Error('No user')
        return this.build_from_obj(res.rows[0])
    }

    /**
     * @returns {Promise<User>}
     */
    async fetch_by_id() {
        let res = await client.query('SELECT id, created, username, passwordhash FROM users WHERE username = $1::BIGINT', [this.id])
        if (res.rowCount < 1) throw new Error('No user')
        return this.build_from_obj(res.rows[0])
    }

    /**
     * @param {string} password 
     * @returns {Promise<boolean>}
     */
    check_password(password) {
        return new Promise((result, reject) => {
            bcrypt.compare(password, this.passwordhash, (err, res) => {
                if (err) reject(err)
                else result(res)
            })
        })
    }

    /**
     * @returns {Promise<User>}
     */
    async fetch_by_credentials() {
        let user = await this.fetch_by_username()
        if (!await user.check_password(this.passwordhash))
            throw new Error('Wrong password')
        return user
    }
}

module.exports = User