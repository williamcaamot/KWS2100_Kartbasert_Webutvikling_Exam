import express from "express";

export function adresseAPI(pgPool) {
  const router = express.Router();

  router.get("/api/v1/datalayers/adresse", async (req, res) => {
    try {
      const extent = JSON.parse(req.query.extent.toString());
      const resolution = JSON.parse(req.query.resolution.toString());

      const result = await pgPool.query(
        `SELECT transformed_representasjonspunkt::json AS geometry, objid
                                                     ,
                                                    objtype,
                                                    adresseid,
                                                    datauttaksdato,
                                                    adressetekst,
                                                    grunnkretsnummer,
                                                    grunnkretsnavn,
                                                    kommunenavn,
                                                    kommunenummer,
                                                    matrikkelnummeradresse_gardsnummer,
                                                    matrikkelnummeradresse_bruksnummer,
                                                    postnummer,
                                                    poststed,
                                                    organisasjonsnummer,
                                                    soknenavn,
                                                    tettstednavn,
                                                    valgkretsnummer,
                                                    valgkretsnavn,
                                                    adressekode,
                                                    adressenavn,
                                                    nummer

                                             FROM public.adresser
                                             WHERE ST_Contains(ST_MakeEnvelope($1, $2, $3, $4, 4326),
                                                               transformed_representasjonspunkt)`,
        extent,
      );

      res.json({
        type: "FeatureCollection",
        features: result.rows.map((item) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: item.geometry.coordinates,
          },
          properties: {
            objid: item.objid,
            objtype: item.objtype,
            adresseid: item.adresseid,
            datauttaksdato: item.datauttaksdato,
            adressetekst: item.adressetekst,
            grunnkretsnummer: item.grunnkretsnummer,
            grunnkretsnavn: item.grunnkretsnavn,
            kommunenavn: item.kommunenavn,
            kommunenummer: item.kommunenummer,
            matrikkelnummeradresse_gardsnummer:
              item.matrikkelnummeradresse_gardsnummer,
            matrikkelnummeradresse_bruksnummer:
              item.matrikkelnummeradresse_bruksnummer,
            postnummer: item.postnummer,
            poststed: item.poststed,
            organisasjonsnummer: item.organisasjonsnummer,
            soknenavn: item.soknenavn,
            tettstednavn: item.tettstednavn,
            valgkretsnummer: item.valgkretsnummer,
            valgkretsnavn: item.valgkretsnavn,
            adressekode: item.adressekode,
            adressenavn: item.adressenavn,
            nummer: item.nummer,
          },
        })),
      });
    } catch (e) {
      res.sendStatus(500);
      console.log(e);
    }
  });

  return router;
}
