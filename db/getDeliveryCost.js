const getPricingDetails = require("./getPricingDetails");

const getDeliveryCost = async (
  zone,
  organization_id,
  total_distance,
  item_type
) => {
  try {
    const pricingInfo = await getPricingDetails(
      zone,
      organization_id,
      item_type
    );

    if (pricingInfo.length === 0) {
      return { error: "No record found" };
    }

    const { base_distance_in_km, km_price, fix_price } = pricingInfo[0];

    // Calculate total price
    let totalPrice = parseFloat(fix_price);

    if (total_distance > base_distance_in_km) {
      const extraDistancePrice =
        (total_distance - base_distance_in_km) * km_price;
      totalPrice += extraDistancePrice;
    }

    return { totalPrice };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

module.exports = getDeliveryCost;
