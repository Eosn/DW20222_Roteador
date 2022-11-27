const { client } = require('../../gvars.js')
const User = require('../user/index.js')

class Post {
    /**
     * @param {string} content 
     * @param {number} user_id 
     * @param {number} id 
     * @param {Date} created 
     */
    constructor(content, user_id, id, created) {
        this.content = content
        this.user_id = user_id
        this.id = id
        this.created = created
    }

    initDDL() {
        return client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id BIGSERIAL PRIMARY KEY,
                created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                user_id BIGINT NOT NULL REFERENCES users(id),
                content TEXT NOT NULL
            );
        `)
    }

    /**
     * @returns {Promise<Post>}
     */
    async filled_user() {
        if (this.user === undefined)
            this.user = await new User(null, null, this.user_id).fetch_by_id()
        return this
    }

    /**
     * @param {object} o 
     * @returns {Post}
     */
     build_from_obj(o) {
        return new Post(o.content, o.user_id, o.id, o.created)
    }

    /**
     * @returns {Promise<Array<Post>>}
     */
    async fetch_all() {
        return await Promise.all(
            (await client.query(`
                SELECT
                    id,
                    created,
                    user_id,
                    content
                FROM
                    posts
                ORDER BY
                    created DESC
            `))
            .rows
            .map(x=>this.build_from_obj(x))
            .map(p=>p.filled_user())
        )
    }

    /**
     * @returns {Promise<Array<Post>>}
     */
    async fetch_dozen() {
        return await Promise.all(
            (await client.query(`
                SELECT
                    id,
                    created,
                    user_id,
                    content
                FROM
                    posts
                ORDER BY
                    created DESC
                LIMIT 12
            `))
            .rows
            .map(x=>this.build_from_obj(x))
            .map(p=>p.filled_user())
        )
    }

    /**
     * @returns {Promise}
     */
    async insert() {
        return await client.query(`
            INSERT INTO
                posts(content, user_id)
            VALUES
                ($1::TEXT, $2::BIGINT)
        `, [this.content, this.user_id])
    }

    /**
     * @returns {Promise}
     */
    async delete() {
        return await client.query(`
            DELETE FROM
                posts
            WHERE
                id = $1::BIGINT
        `, [this.id])
    }
}

module.exports = Post