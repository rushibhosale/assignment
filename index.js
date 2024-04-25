require("dotenv").config();
const express = require("express");
const getDeliveryCost = require("./db/getDeliveryCost");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

const PORT = process.env.SERVER_PORT | 3000;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "calcualte delivery cost ",
      version: "1.0.0",
    },
  },
  apis: ["./index.js"],
};
const swaggerSpec = swaggerJSDoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/calculate-delivery-cost:
 *   post:
 *     summary: To calculate delivery cost on the basis of zone, total_distance, item_type, and organization_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone:
 *                 type: string
 *               organization_id:
 *                 type: string
 *               total_distance:
 *                 type: number
 *               item_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully returns total price
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
app.post("/api/calculate-delivery-cost", async (req, res) => {
  try {
    const { zone, organization_id, total_distance, item_type } = req.body;

    // Check if required parameters are present
    if (!zone || !organization_id || !total_distance || !item_type) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Call a function to get delivery cost
    const result = await getDeliveryCost(
      zone,
      organization_id,
      total_distance,
      item_type
    );

    // Handle errors, if any
    if (result.error) {
      return res.send({ error: result.error });
    }

    // Return total price
    return res.send({ total_price: result?.totalPrice });
  } catch (error) {
    console.error("Error calculating price:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
