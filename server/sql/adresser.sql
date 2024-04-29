-- ##################################################################
-- This was used to create a new table and create indexes on that new table.
-- This is the table used in the adresser layer via API.
-- ##################################################################


-- Create new local table
CREATE TABLE adresserv2 AS
SELECT ST_Transform(representasjonspunkt, 4326) as transformed_representasjonspunkt,
       objid,
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
FROM adresse.vegadresse;

-- Create index
CREATE INDEX idx_transformed_omrade_adresse ON public.adresserv2 USING GIST (transformed_representasjonspunkt);