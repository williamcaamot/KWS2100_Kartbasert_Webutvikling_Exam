import express from "express";

export function teigAPI(pgPool) {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.json({ message: "hello world" });
  });

  // http://localhost:3001/api/v1/datalayers/teig?extent=[9.216298447662496,60.485802779692904,9.216862360639919,60.485930722730984]&resolution=2.4996142616204405e-7
  router.get("/api/v1/datalayers/teig", async (req, res) => {
    try {
      const extent = JSON.parse(req.query.extent.toString());
      const resolution = JSON.parse(req.query.resolution.toString());

      console.log(resolution);
      const result = await pgPool.query(
        `select transformed_omrade::json as geometry, matrikkelenhetid,
                                                    matrikkel_kommunenummer,
                                                    gardsnummer,
                                                    bruksnummer,
                                                    matrikkelenhetstype,
                                                    kommunenavn
                                             from public.teig
                                             WHERE st_contains(st_makeenvelope($1, $2, $3, $4, 4326),
                                                               transformed_representasjonspunkt)`,
        extent,
      );

      res.json({
        type: "FeatureCollection",
        features: result.rows.map((item) => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: item.geometry.coordinates,
          },
          properties: {
            matrikkelenhetid: item.matrikkelenhetid,
            matrikkel_kommunenummer: item.matrikkel_kommunenummer,
            gardsnummer: item.gardsnummer,
            bruksnummer: item.bruksnummer,
            matrikkelenhetstype: item.matrikkelenhetstype,
            kommunenavn: item.kommunenavn,
          },
        })),
      });
    } catch (e) {
      console.log(e.message);
    }
  });

  return router;
}
