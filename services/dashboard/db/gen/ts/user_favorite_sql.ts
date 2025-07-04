import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getUserFavoritesOrderedByNameQuery = `-- name: GetUserFavoritesOrderedByName :many
SELECT 
    'fund' as type,
    f.slug,
    f.name
FROM user_favorite uf
JOIN fund f ON uf.favorite_id = f.id
WHERE uf.user_id = $1 AND uf.favorite_type = 'fund'

UNION ALL

SELECT 
    'company' as type,
    c.slug,
    c.name
FROM user_favorite uf
JOIN company c ON uf.favorite_id = c.id
WHERE uf.user_id = $1 AND uf.favorite_type = 'company'
ORDER BY name`;

export interface GetUserFavoritesOrderedByNameArgs {
    userId: number;
}

export interface GetUserFavoritesOrderedByNameRow {
    type: string;
    slug: string;
    name: string;
}

export async function getUserFavoritesOrderedByName(client: Client, args: GetUserFavoritesOrderedByNameArgs): Promise<GetUserFavoritesOrderedByNameRow[]> {
    const result = await client.query({
        text: getUserFavoritesOrderedByNameQuery,
        values: [args.userId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            type: row[0],
            slug: row[1],
            name: row[2]
        };
    });
}

