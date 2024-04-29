
-- ##################################################################
-- This was used to create a new table and create indexes on that new table.
-- This is the table used in the eiendom/teig layer via API.
-- ##################################################################
CREATE TABLE teigv2 AS
SELECT
    m.matrikkelenhetid,
    m.kommunenummer as "matrikkel_kommunenummer",
    m.gardsnummer,
    m.bruksnummer,
    m.bruksnavn,
    m.matrikkelenhetstype,
    st_transform(t.representasjonspunkt, 4326) AS transformed_representasjonspunkt,
    st_transform(t.omrade, 4326) AS transformed_omrade,
    t.kommunenavn

FROM
    eiendommer.matrikkelenhet m
        INNER JOIN
    eiendommer.teig t ON m.teig_fk = t.teigid;


CREATE INDEX idx_transformed_omrade ON public.teigv2 USING GIST (transformed_omrade);
CREATE INDEX idx_transformed_representasjonspunk ON public.teigv2 USING GIST (transformed_representasjonspunkt);