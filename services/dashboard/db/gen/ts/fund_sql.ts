import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getFundsQuery = `-- name: GetFunds :many
SELECT slug, name FROM fund ORDER BY name`;

export interface GetFundsRow {
    slug: string;
    name: string;
}

export async function getFunds(client: Client): Promise<GetFundsRow[]> {
    const result = await client.query({
        text: getFundsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            slug: row[0],
            name: row[1]
        };
    });
}

export const getFundBySlugQuery = `-- name: GetFundBySlug :one
SELECT slug, name FROM fund WHERE slug = $1`;

export interface GetFundBySlugArgs {
    slug: string;
}

export interface GetFundBySlugRow {
    slug: string;
    name: string;
}

export async function getFundBySlug(client: Client, args: GetFundBySlugArgs): Promise<GetFundBySlugRow | null> {
    const result = await client.query({
        text: getFundBySlugQuery,
        values: [args.slug],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        slug: row[0],
        name: row[1]
    };
}

export const getFundBySlugWithFavoriteDataQuery = `-- name: GetFundBySlugWithFavoriteData :one
SELECT slug, name, is_favorite FROM fund f
LEFT JOIN (
    SELECT true as is_favorite
    FROM user_favorite
    WHERE user_id = $1 AND favorite_type = 'fund'
) uf ON f.id = uf.favorite_id
WHERE f.slug = $1`;

export interface GetFundBySlugWithFavoriteDataArgs {
    userId: number;
}

export interface GetFundBySlugWithFavoriteDataRow {
    slug: string;
    name: string;
    isFavorite: boolean;
}

export async function getFundBySlugWithFavoriteData(client: Client, args: GetFundBySlugWithFavoriteDataArgs): Promise<GetFundBySlugWithFavoriteDataRow | null> {
    const result = await client.query({
        text: getFundBySlugWithFavoriteDataQuery,
        values: [args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        slug: row[0],
        name: row[1],
        isFavorite: row[2]
    };
}

export const createFundQuery = `-- name: CreateFund :one
INSERT INTO fund (name) VALUES ($1) RETURNING slug, name`;

export interface CreateFundArgs {
    name: string;
}

export interface CreateFundRow {
    slug: string;
    name: string;
}

export async function createFund(client: Client, args: CreateFundArgs): Promise<CreateFundRow | null> {
    const result = await client.query({
        text: createFundQuery,
        values: [args.name],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        slug: row[0],
        name: row[1]
    };
}

export const updateFundQuery = `-- name: UpdateFund :one
UPDATE fund SET name = $2 WHERE slug = $1 RETURNING slug, name`;

export interface UpdateFundArgs {
    slug: string;
    name: string;
}

export interface UpdateFundRow {
    slug: string;
    name: string;
}

export async function updateFund(client: Client, args: UpdateFundArgs): Promise<UpdateFundRow | null> {
    const result = await client.query({
        text: updateFundQuery,
        values: [args.slug, args.name],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        slug: row[0],
        name: row[1]
    };
}

export const deleteFundQuery = `-- name: DeleteFund :exec
DELETE FROM fund WHERE slug = $1`;

export interface DeleteFundArgs {
    slug: string;
}

export async function deleteFund(client: Client, args: DeleteFundArgs): Promise<void> {
    await client.query({
        text: deleteFundQuery,
        values: [args.slug],
        rowMode: "array"
    });
}

