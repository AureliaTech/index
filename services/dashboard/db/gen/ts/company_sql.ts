import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getCompaniesQuery = `-- name: GetCompanies :many
SELECT slug, name, id FROM company ORDER BY name`;

export interface GetCompaniesRow {
    slug: string;
    name: string;
    id: number;
}

export async function getCompanies(client: Client): Promise<GetCompaniesRow[]> {
    const result = await client.query({
        text: getCompaniesQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            slug: row[0],
            name: row[1],
            id: row[2]
        };
    });
}

export const getCompanyBySlugQuery = `-- name: GetCompanyBySlug :one
SELECT slug, name, id FROM company WHERE slug = $1`;

export interface GetCompanyBySlugArgs {
    slug: string;
}

export interface GetCompanyBySlugRow {
    slug: string;
    name: string;
    id: number;
}

export async function getCompanyBySlug(client: Client, args: GetCompanyBySlugArgs): Promise<GetCompanyBySlugRow | null> {
    const result = await client.query({
        text: getCompanyBySlugQuery,
        values: [args.slug],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        slug: row[0],
        name: row[1],
        id: row[2]
    };
}

export const getCompanyBySlugWithFavoriteDataQuery = `-- name: GetCompanyBySlugWithFavoriteData :one
SELECT slug, name, is_favorite FROM company c
LEFT JOIN (
    SELECT true as is_favorite
    FROM user_favorite
    WHERE user_id = $1 AND favorite_type = 'company'
) uf ON c.id = uf.favorite_id
WHERE c.slug = $1`;

export interface GetCompanyBySlugWithFavoriteDataArgs {
    userId: number;
}

export interface GetCompanyBySlugWithFavoriteDataRow {
    slug: string;
    name: string;
    isFavorite: boolean;
}

export async function getCompanyBySlugWithFavoriteData(client: Client, args: GetCompanyBySlugWithFavoriteDataArgs): Promise<GetCompanyBySlugWithFavoriteDataRow | null> {
    const result = await client.query({
        text: getCompanyBySlugWithFavoriteDataQuery,
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

export const createCompanyQuery = `-- name: CreateCompany :one
INSERT INTO company (name) VALUES ($1) RETURNING slug, name`;

export interface CreateCompanyArgs {
    name: string;
}

export interface CreateCompanyRow {
    slug: string;
    name: string;
}

export async function createCompany(client: Client, args: CreateCompanyArgs): Promise<CreateCompanyRow | null> {
    const result = await client.query({
        text: createCompanyQuery,
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

export const updateCompanyQuery = `-- name: UpdateCompany :one
UPDATE company SET name = $2 WHERE slug = $1 RETURNING slug, name`;

export interface UpdateCompanyArgs {
    slug: string;
    name: string;
}

export interface UpdateCompanyRow {
    slug: string;
    name: string;
}

export async function updateCompany(client: Client, args: UpdateCompanyArgs): Promise<UpdateCompanyRow | null> {
    const result = await client.query({
        text: updateCompanyQuery,
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

export const deleteCompanyQuery = `-- name: DeleteCompany :exec
DELETE FROM company WHERE slug = $1`;

export interface DeleteCompanyArgs {
    slug: string;
}

export async function deleteCompany(client: Client, args: DeleteCompanyArgs): Promise<void> {
    await client.query({
        text: deleteCompanyQuery,
        values: [args.slug],
        rowMode: "array"
    });
}

