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
        `SELECT * FROM public.adresserv2 ORDER BY objid LIMIT $1 OFFSET $2`,
        [pageSize, offset],
      );
      const dataToInsert = localResult.rows;

      if (dataToInsert.length > 0) {
        const queryParams = [];
        const values = dataToInsert
          .map((row, index) => {
            const baseIndex = index * 22; // 22 fields per row
            queryParams.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3},
                     $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6},
                      $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9},
                      $${baseIndex + 10}, $${baseIndex + 11}, $${baseIndex + 12}
                      $${baseIndex + 13}, $${baseIndex + 14}, $${baseIndex + 15},
                      $${baseIndex + 16}, $${baseIndex + 17}, $${baseIndex + 18},
                      $${baseIndex + 19}, $${baseIndex + 20}, $${baseIndex + 21})`);
            return [
              row.transformed_representasjonspunkt,
              row.objid,
              row.objtype,
              row.adresseid,
              row.datauttaksdato,
              row.adressetekst,
              row.grunnkretsnummer,
              row.grunnkretsnavn,
              row.kommunenavn,
              row.kommunenummer,
              row.matrikkelnummeradresse_gardsnummer,
              row.matrikkelnummeradresse_bruksnummer,
              row.postnummer,
              row.poststed,
              row.organisasjonsnummer,
              row.soknenavn,
              row.tettstednavn,
              row.valgkretsnummer,
              row.valgkretsnavn,
              row.adressekode,
              row.adressenavn,
              row.nummer,
            ];
          })
          .flat();

        const insertQuery = `INSERT INTO public.adresser (
                    transformed_representasjonspunkt, objid, objtype,
                    adresseid, datauttaksdato, adressetekst, grunnkretsnummer,
                    grunnkretsnavn, kommunenavn, kommunenummer,
                    matrikkelnummeradresse_gardsnummer, matrikkelnummeradresse_bruksnummer,
                    postnummer, poststed, organisasjonsnummer, soknenavn,
                    tettstednavn, valgkretsnummer, valgkretsnavn, adressekode,
                    adressenavn, nummer
                ) VALUES ${queryParams.join(", ")}`;

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
