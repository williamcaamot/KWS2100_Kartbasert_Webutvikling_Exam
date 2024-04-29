import pg from "pg";

const caCert = Buffer.from(process.env.CA_CERT_DO, "base64").toString("utf-8");

const remotepg = new pg.Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
});

const localpg = new pg.Pool({
  user: "postgres",
  database: "kartbasert",
});

(async () => {
  try {
    const pageSize = 5000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      console.log("Inserting data");
      const localResult = await localpg.query(
        `SELECT * FROM public.teigv2 ORDER BY matrikkelenhetid LIMIT $1 OFFSET $2`,
        [pageSize, offset],
      );
      const dataToInsert = localResult.rows;

      if (dataToInsert.length > 0) {
        const queryParams = [];
        const values = dataToInsert
          .map((row, index) => {
            const baseIndex = index * 9; // 9 fields per row
            queryParams.push(
              `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9})`,
            );
            return [
              row.matrikkelenhetid,
              row.matrikkel_kommunenummer,
              row.gardsnummer,
              row.bruksnummer,
              row.bruksnavn,
              row.matrikkelenhetstype,
              row.transformed_representasjonspunkt,
              row.transformed_omrade,
              row.kommunenavn,
            ];
          })
          .flat();

        const insertQuery = `INSERT INTO public.teig (matrikkelenhetid, matrikkel_kommunenummer, gardsnummer, bruksnummer, bruksnavn, matrikkelenhetstype, transformed_representasjonspunkt, transformed_omrade, kommunenavn) VALUES ${queryParams.join(", ")}`;

        await remotepg.query(insertQuery, values);
        offset += pageSize;
      } else {
        hasMore = false;
      }
    }

    console.log("Data transferred successfully");
  } catch (err) {
    console.error("Error transferring data:", err);
  } finally {
    await localpg.end();
    await remotepg.end();
  }
})();
