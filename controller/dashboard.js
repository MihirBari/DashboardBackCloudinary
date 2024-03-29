const { pool } = require("../database");

const TotalProducts = (req, res) => {
  const query = `
     SELECT SUM(Stock) AS totalProducts FROM products
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 1) {
      console.log("Total Products:", results[0]);
      res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const TotalProductsSold = (req, res) => {
  const { days } = req.query;

  const query = `
    SELECT count(Total_items) AS Total_items 
    FROM order_items 
    WHERE created_at > NOW() - INTERVAL ? DAY 
      AND returned = 'No';
  `;

  pool.query(query, [days], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 1) {
      console.log("Total Products Sold:", results);
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const TotalProductsLeft = (req, res) => {
  const query = `
     select sum(Stock) as Stock from products 
    `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 1) {
      console.log("TOtal Products Left:", results);
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const TotalAmountCollected = (req, res) => {
  const { days } = req.query;

  const query = `
    SELECT SUM(amount_sold) AS amt 
    FROM order_items 
    WHERE created_at > NOW() - INTERVAL ? DAY 
    AND returned = 'No';
  `;

  pool.query(query, [days], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Results:", results); // Log the results

    if (results.length === 1) {
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

// const TotalCostPrice = (req, res) => {
//   const { days } = req.query;

//   const query = `
//     SELECT SUM(	Final_cost) AS amt 
//     FROM products 
//     WHERE created_at > NOW() - INTERVAL ? DAY 
//   `;

//   pool.query(query, [days], (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     console.log("Results:", results); // Log the results

//     if (results.length === 1) {
//       res.status(200).json(results);
//     } else {
//       return res.status(404).json({ error: "Product not found" });
//     }
//   });
// };

const TotalAmountInvested = (req, res) => {
  const { days } = req.query;

  const query = `
    SELECT SUM(	Final_cost) AS amt
    FROM products
    WHERE created_at > NOW() - INTERVAL ? DAY;
  `;

  pool.query(query,[days], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 1) {
      console.log("Total Amount Invested:", results);
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const TotalExpense = (req, res) => {
  const { days } = req.query;

  const query = `
    SELECT SUM(	amount) AS amt
    FROM expense
    WHERE created_at > NOW() - INTERVAL ? DAY;
  `;

  pool.query(query,[days], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 1) {
      console.log("Total Amount Invested:", results);
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const TotalBankSettelment = (req, res) => {
  const { days } = req.query;

  const query = `
    SELECT SUM(bank_payment) AS amt
    FROM order_items
    WHERE created_at > NOW() - INTERVAL ? DAY;
  `;

  pool.query(query,[days], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 1) {
      console.log("Total Amount Invested:", results);
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const TotalReturned = (req, res) => {
  const { days } = req.query;

  const query = `
   select sum(Total_items) as ti from order_items where created_at > now() - INTERVAL ? day and returned = 'Yes';
  `;

  pool.query(query, [days], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Results:", results); // Log the results

    if (results.length === 1) {
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  });
};

const profit = (req, res) => {
  const { days } = req.query;

  const totalAmountCollectedQuery = `
    SELECT SUM(amount_sold) AS totalAmountCollected
    FROM order_items 
    WHERE created_at > NOW() - INTERVAL ? DAY 
    AND returned = 'No';
  `;

  const totalAmountInvestedQuery = `
    SELECT sum(bank_payment) AS totalAmountInvested
    FROM order_items
    WHERE created_at > NOW() - INTERVAL ? DAY ;
  `;

  pool.query(totalAmountCollectedQuery, [days], (error, collectedResults) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (collectedResults.length === 1) {
      const totalAmountCollected = collectedResults[0].totalAmountCollected;

      pool.query(totalAmountInvestedQuery, [days], (error, investedResults) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (investedResults.length === 1) {
          const totalAmountInvested = investedResults[0].totalAmountInvested;

          const profit = totalAmountCollected - totalAmountInvested;

          console.log("Profit:", profit);
          res.status(200).json({ amt: profit }); // Change key to "amt"
        } else {
          return res.status(404).json({ error: "Total amount invested not found" });
        }
      });
    } else {
      return res.status(404).json({ error: "Total amount collected not found" });
    }
  });
};

const size = (req, res) => {
  const { sizes } = req.query;
  console.log("Received size:", sizes);

  const query = `
    SELECT SUM(${sizes}) AS size
    FROM products
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Results:", results); // Log the results

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Products not found" });
    }
  });
};


const productType = (req, res) => {
  const { productType } = req.query;
  console.log("Received size:", productType);

  const query = `
    SELECT COUNT(product_type) AS productType
    FROM products
    where product_type = ?
  `;

  pool.query(query,[productType], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Results:", results); // Log the results

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      return res.status(404).json({ error: "Products not found" });
    }
  });
};


module.exports = {
  TotalProducts,
  TotalProductsSold,
  TotalProductsLeft,
  TotalAmountCollected,
  TotalReturned,
  TotalAmountInvested,
  profit,
  productType,
  size,
  TotalBankSettelment,
  TotalExpense
};
