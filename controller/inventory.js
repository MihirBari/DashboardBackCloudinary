const { pool } = require("../database");


const Details = (req, res) => {
    const inventory = `
    SELECT
    product_id,
    product_name,
    s,
    m,
    l,
    xl,
    xxl,
    xxxl,
    xxxxl,
    xxxxxl,
    xxxxxxl,
    Stock,
    created_at,
    updated_at
    FROM
      history
  `;
  
    pool.query(inventory, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  };


  const History = (req, res) => {
    const inventory = `
    SELECT
    product_id,
    product_name,
    Total_items,
    s,
    m,
    l,
    xl,
    xxl,
    xxxl,
    xxxxl,
    xxxxxl,
    xxxxxxl,
    created_at
    FROM
      details
  `;
  
    pool.query(inventory, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  };

  module.exports = {
    Details,History
  }