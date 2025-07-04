import client from "../db";
import { createServerFn } from "@tanstack/react-start";
import {
  getDealTeamHighlightsByCompanyId,
  createDealTeamHighlight as createDbDealTeamHighlight,
  createLabel as createDbLabel,
  attachLabelToHighlight,
  getLabelsByText,
} from "../../db/gen/ts/deal_team_highlight_sql";

export const getDealTeamHighlights = createServerFn({ method: "GET" })
  .validator((data: { companyId: number }) => data)
  .handler(async ({ data }) => {
    try {
      await client.connect().catch(() => {});
      const highlights = await getDealTeamHighlightsByCompanyId(client, {
        companyId: data.companyId,
      });
      return { highlights };
    } catch (error) {
      console.error("Error loading deal team highlights", error);
      return { highlights: [] as { id: string; name: string }[] };
    }
  });

export const createDealTeamHighlight = createServerFn({ method: "POST" })
  .validator(
    (data: {
      companyId: number;
      title: string;
      description: string;
      authorId?: number;
      labels: { color: string; text: string }[];
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      await client.connect().catch(() => {});

      //start transaction
      // await client.query("BEGIN");

      const existingLabels = await getLabelsByText(client, {
        text: data.labels.map((label) => label.text).join(","),
      });

      //create labels that don't exist
      const labels = await Promise.all(
        data.labels
          .filter((label) => !existingLabels.some((l) => l.text === label.text))
          .map(async (label) => {
            return await createDbLabel(client, {
              color: label.color,
              text: label.text,
            });
          })
      );

      //create highlight
      const highlight = await createDbDealTeamHighlight(client, {
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        authorId: data.authorId ?? 1, // TODO: get authorId from session
      });

      //attach labels to highlight
      await Promise.all(
        labels.map(async (label) => {
          if (!highlight || !label) {
            return;
          }
          await attachLabelToHighlight(client, {
            highlightId: highlight.id,
            labelId: label.id,
          });
        })
      );

      //commit transaction
      //await client.query("COMMIT");

      return { highlight };
    } catch (error) {
      console.error("Error creating deal team highlight", error);
      //await client.query("ROLLBACK");
      return { highlight: null };
    }
  });
