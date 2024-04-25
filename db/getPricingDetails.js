const pool = require("./database");

const getPricingDetails = async (zone, organization_id, item_type) => {
  try {
    // if (!zone || !organization_id || !item_type) return NULL;
    const client = await pool.connect();
    const query = `SELECT *
    FROM Pricing p
    JOIN Organization o ON p.organization_id = o.id
    JOIN Item i ON p.item_type = i.type
    WHERE p.zone = $1 AND p.organization_id = $2 AND i.type = $3;
    `;
    const { rows } = await client.query(query, [
      zone,
      organization_id,
      item_type,
    ]);

    client.release();
    return rows;
  } catch (error) {
    // Handle errors
    console.error("Error fetching pricing details:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};

module.exports = getPricingDetails;
