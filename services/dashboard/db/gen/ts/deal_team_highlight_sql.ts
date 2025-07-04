import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getDealTeamHighlightsByCompanyIdQuery = `-- name: GetDealTeamHighlightsByCompanyId :many
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  h.company_id = $1
ORDER  BY h.created_at DESC`;

export interface GetDealTeamHighlightsByCompanyIdArgs {
    companyId: number;
}

export interface GetDealTeamHighlightsByCompanyIdRow {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    authorUsername: string;
    companyId: number;
    labels: any;
}

export async function getDealTeamHighlightsByCompanyId(client: Client, args: GetDealTeamHighlightsByCompanyIdArgs): Promise<GetDealTeamHighlightsByCompanyIdRow[]> {
    const result = await client.query({
        text: getDealTeamHighlightsByCompanyIdQuery,
        values: [args.companyId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            title: row[1],
            description: row[2],
            createdAt: row[3],
            updatedAt: row[4],
            authorId: row[5],
            authorUsername: row[6],
            companyId: row[7],
            labels: row[8]
        };
    });
}

export const getDealTeamHighlightsFilteredByKeywordInDescriptionQuery = `-- name: GetDealTeamHighlightsFilteredByKeywordInDescription :many
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  h.description ILIKE '%' || $1 || '%'
ORDER  BY h.created_at DESC`;

export interface GetDealTeamHighlightsFilteredByKeywordInDescriptionArgs {
    keyword: string | null;
}

export interface GetDealTeamHighlightsFilteredByKeywordInDescriptionRow {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    authorUsername: string;
    companyId: number;
    labels: any;
}

export async function getDealTeamHighlightsFilteredByKeywordInDescription(client: Client, args: GetDealTeamHighlightsFilteredByKeywordInDescriptionArgs): Promise<GetDealTeamHighlightsFilteredByKeywordInDescriptionRow[]> {
    const result = await client.query({
        text: getDealTeamHighlightsFilteredByKeywordInDescriptionQuery,
        values: [args.keyword ?? ""],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            title: row[1],
            description: row[2],
            createdAt: row[3],
            updatedAt: row[4],
            authorId: row[5],
            authorUsername: row[6],
            companyId: row[7],
            labels: row[8]
        };
    });
}

export const getDealTeamHighlightsByLabelsQuery = `-- name: GetDealTeamHighlightsByLabels :many
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  lbl.labels && $1::uuid[]
ORDER  BY h.created_at DESC`;

export interface GetDealTeamHighlightsByLabelsArgs {
    labels: string[];
}

export interface GetDealTeamHighlightsByLabelsRow {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    authorUsername: string;
    companyId: number;
    labels: any;
}

export async function getDealTeamHighlightsByLabels(client: Client, args: GetDealTeamHighlightsByLabelsArgs): Promise<GetDealTeamHighlightsByLabelsRow[]> {
    const result = await client.query({
        text: getDealTeamHighlightsByLabelsQuery,
        values: [args.labels],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            title: row[1],
            description: row[2],
            createdAt: row[3],
            updatedAt: row[4],
            authorId: row[5],
            authorUsername: row[6],
            companyId: row[7],
            labels: row[8]
        };
    });
}

export const getLabelsQuery = `-- name: GetLabels :many
SELECT id, color, text FROM label`;

export interface GetLabelsRow {
    id: number;
    color: string;
    text: string;
}

export async function getLabels(client: Client): Promise<GetLabelsRow[]> {
    const result = await client.query({
        text: getLabelsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            color: row[1],
            text: row[2]
        };
    });
}

export const getLabelsByTextQuery = `-- name: GetLabelsByText :many
SELECT id, color, text FROM label WHERE text = ANY($1)`;

export interface GetLabelsByTextArgs {
    text: string;
}

export interface GetLabelsByTextRow {
    id: number;
    color: string;
    text: string;
}

export async function getLabelsByText(client: Client, args: GetLabelsByTextArgs): Promise<GetLabelsByTextRow[]> {
    const result = await client.query({
        text: getLabelsByTextQuery,
        values: [args.text],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            color: row[1],
            text: row[2]
        };
    });
}

export const createLabelQuery = `-- name: CreateLabel :one
INSERT INTO label (id, color, text)
VALUES (gen_random_uuid(), $1, $2)
ON CONFLICT (color, text) DO UPDATE
SET    color = EXCLUDED.color,
       text  = EXCLUDED.text
RETURNING id, color, text`;

export interface CreateLabelArgs {
    color: string;
    text: string;
}

export interface CreateLabelRow {
    id: number;
    color: string;
    text: string;
}

export async function createLabel(client: Client, args: CreateLabelArgs): Promise<CreateLabelRow | null> {
    const result = await client.query({
        text: createLabelQuery,
        values: [args.color, args.text],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        color: row[1],
        text: row[2]
    };
}

export const createDealTeamHighlightQuery = `-- name: CreateDealTeamHighlight :one
INSERT INTO deal_team_highlight (id, title, description, author_id, company_id)
VALUES (gen_random_uuid(), $1, $2, $3, $4)
RETURNING id, description, title, author_id, company_id, created_at, updated_at`;

export interface CreateDealTeamHighlightArgs {
    title: string;
    description: string;
    authorId: number;
    companyId: number;
}

export interface CreateDealTeamHighlightRow {
    id: number;
    description: string;
    title: string;
    authorId: number;
    companyId: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function createDealTeamHighlight(client: Client, args: CreateDealTeamHighlightArgs): Promise<CreateDealTeamHighlightRow | null> {
    const result = await client.query({
        text: createDealTeamHighlightQuery,
        values: [args.title, args.description, args.authorId, args.companyId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        description: row[1],
        title: row[2],
        authorId: row[3],
        companyId: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}

export const attachLabelToHighlightQuery = `-- name: AttachLabelToHighlight :exec
INSERT INTO deal_team_highlight_label (highlight_id, label_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING`;

export interface AttachLabelToHighlightArgs {
    highlightId: number;
    labelId: number;
}

export async function attachLabelToHighlight(client: Client, args: AttachLabelToHighlightArgs): Promise<void> {
    await client.query({
        text: attachLabelToHighlightQuery,
        values: [args.highlightId, args.labelId],
        rowMode: "array"
    });
}

export const getDealTeamHighlightByIdQuery = `-- name: GetDealTeamHighlightById :one
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  h.id = $1`;

export interface GetDealTeamHighlightByIdArgs {
    id: number;
}

export interface GetDealTeamHighlightByIdRow {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    authorUsername: string;
    companyId: number;
    labels: any;
}

export async function getDealTeamHighlightById(client: Client, args: GetDealTeamHighlightByIdArgs): Promise<GetDealTeamHighlightByIdRow | null> {
    const result = await client.query({
        text: getDealTeamHighlightByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        title: row[1],
        description: row[2],
        createdAt: row[3],
        updatedAt: row[4],
        authorId: row[5],
        authorUsername: row[6],
        companyId: row[7],
        labels: row[8]
    };
}

