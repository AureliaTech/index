import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getUserByUsernameQuery = `-- name: GetUserByUsername :one
SELECT id, username FROM users WHERE username = $1`;

export interface GetUserByUsernameArgs {
    username: string;
}

export interface GetUserByUsernameRow {
    id: number;
    username: string;
}

export async function getUserByUsername(client: Client, args: GetUserByUsernameArgs): Promise<GetUserByUsernameRow | null> {
    const result = await client.query({
        text: getUserByUsernameQuery,
        values: [args.username],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        username: row[1]
    };
}

export const createUserQuery = `-- name: CreateUser :one
INSERT INTO users (username) VALUES ($1) RETURNING id, username`;

export interface CreateUserArgs {
    username: string;
}

export interface CreateUserRow {
    id: number;
    username: string;
}

export async function createUser(client: Client, args: CreateUserArgs): Promise<CreateUserRow | null> {
    const result = await client.query({
        text: createUserQuery,
        values: [args.username],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        username: row[1]
    };
}

