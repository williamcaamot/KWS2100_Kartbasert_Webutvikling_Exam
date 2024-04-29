import express from "express";

export function matbutikkAPI(pgPool) {
  const router = express.Router();

  router.get("/api/v1/datalayers/matbutikker", async (req, res) => {
    try {
      const extent = JSON.parse(req.query.extent.toString());
      const resolution = JSON.parse(req.query.resolution.toString());

      const result = await pgPool.query(
        `SELECT position::json AS geometry,
                                                       id,
                                                      group_name,
                                                      name,
                                                      address,
                                                      phone,
                                                      email,
                                                      fax,
                                                      logo,
                                                      website,
                                                      detail_url,
                                                      opening_hours

                                               FROM public.stores
                                               WHERE ST_Contains(ST_MakeEnvelope($1, $2, $3, $4, 4326),
                                                                 position)`,
        extent,
      );
      console.log(result.rows[0].geometry.coordinates);
      res.json({
        type: "FeatureCollection",
        features: result.rows.map((item) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: item.geometry.coordinates,
          },
          properties: {
            id: item.id,
            group_name: item.group_name,
            name: item.name,
            address: item.address,
            phone: item.phone,
            email: item.email,
            fax: item.fax,
            logo: item.logo,
            website: item.website,
            detail_url: item.detail_url,
            opening_hours: item.opening_hours,
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
