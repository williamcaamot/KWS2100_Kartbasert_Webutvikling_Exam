import pg from "pg";

let pgPool = new pg.Pool({
  user: "postgres",
  database: "kartbasert",
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getData(pageNumber) {
  let response;
  let retries = 0;
  let maxreTries = 10;

  while (retries < maxreTries) {
    try {
      response = await fetch(
        ` https://kassal.app/api/v1/physical-stores?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.KASALAPP_TOKEN}`,
          },
        },
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed. Retrying...`);
      console.error(error);
    }
    await delay(1500);
    retries++;
  }
}

async function insertData(data) {
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i]; // Assuming each item has the properties needed.
    try {
      await pgPool.query(
        `
                INSERT INTO stores (id, group_name, name, address, phone, email, fax, logo, website, detail_url,
                                    position, opening_hours)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                        ST_SetSRID(ST_MakePoint($11, $12), 4326),
                        $13)
            `,
        [
          item.id,
          item.group_name,
          item.name,
          item.address,
          item.phone,
          item.email,
          item.fax,
          item.logo,
          item.website,
          item.detail_url,
          item.position.lng,
          item.position.lat,
          JSON.stringify(item.openingHours),
        ],
      );
    } catch (e) {
      console.error("Failed to insert data for item", item, "with error", e);
      // Optionally, handle the error according to your application's needs, e.g., retry logic, etc.
    }
  }
}

(async () => {
  try {
    await connect();
    for (let i = 1; i < 439; i++) {
      await console.log(`Currently at page ${i}`);
      const data = await getData(i);
      await insertData(data);
      await delay(1100);
    }
  } catch (error) {
    console.error("Error:" + error);
  } finally {
    console.log("Closing database connection");
  }
})();
