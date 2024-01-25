const { pool } = require("../database");

const addHistory = (req, res) => {
  const addHistoryQuery = `
    INSERT INTO details (
      product_id, product_name, s, m, l, xl, xxl, xxxl, 
      xxxxl, xxxxxl, xxxxxxl, Total_items, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      s = s,
      m = m,
      l = l,
      xl = xl,
      xxl = xxl,
      xxxl = xxxl,
      xxxxl =  xxxxl,
      xxxxxl = xxxxxl,
      xxxxxxl = xxxxxxl,
      Total_items = IF(VALUES(Total_items) != Total_items, Total_items + VALUES(Total_items), Total_items),
      created_at = NOW();
  `;

  const addDetailsQuery = `
    INSERT INTO history (
      product_id, product_name, s, m, l, xl, xxl, xxxl, 
      xxxxl, xxxxxl, xxxxxxl, Stock, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      s = IF(VALUES(s) != 0, s + VALUES(s) , s),
      m = IF(VALUES(m) != 0, m + VALUES(m) , m),
      l = IF(VALUES(l) != 0, l + VALUES(l) , l),
      xl = IF(VALUES(xl) != 0, xl + VALUES(xl) , xl),
      xxl = IF(VALUES(xxl) != 0, xxl + VALUES(xxl) , xxl),
      xxxl = IF(VALUES(xxxl) != 0, xxxl + VALUES(xxxl), xxxl),
      xxxxl = IF(VALUES(xxxxl) != 0, xxxxl + VALUES(xxxxl) , xxxxl),
      xxxxxl = IF(VALUES(xxxxxl) != 0, xxxxxl + VALUES(xxxxxl), xxxxxl),
      xxxxxxl = IF(VALUES(xxxxxxl) != 0, xxxxxxl + VALUES(xxxxxxl), xxxxxxl),
      Stock = VALUES(Stock) + Stock,
      updated_at = NOW();
  `;

  for (const history of req.body.data) {
    const totalStock =
      (isNaN(+history.s) ? 0 : +history.s) +
      (isNaN(+history.m) ? 0 : +history.m) +
      (isNaN(+history.l) ? 0 : +history.l) +
      (isNaN(+history.xl) ? 0 : +history.xl) +
      (isNaN(+history.xxl) ? 0 : +history.xxl) +
      (isNaN(+history.xxxl) ? 0 : +history.xxxl) +
      (isNaN(+history.xxxxl) ? 0 : +history.xxxxl) +
      (isNaN(+history.xxxxxl) ? 0 : +history.xxxxxl) +
      (isNaN(+history.xxxxxxl) ? 0 : +history.xxxxxxl);

    const values = [
      history.product_id,
      history.product_name,
      +history.s,
      +history.m,
      +history.l,
      +history.xl,
      +history.xxl,
      +history.xxxl,
      +history.xxxxl,
      +history.xxxxxl,
      +history.xxxxxxl,
      totalStock
    ];

    const totalStockDetails =
      (isNaN(+history.s) ? 0 : +history.s) +
      (isNaN(+history.m) ? 0 : +history.m) +
      (isNaN(+history.l) ? 0 : +history.l) +
      (isNaN(+history.xl) ? 0 : +history.xl) +
      (isNaN(+history.xxl) ? 0 : +history.xxl) +
      (isNaN(+history.xxxl) ? 0 : +history.xxxl) +
      (isNaN(+history.xxxxl) ? 0 : +history.xxxxl) +
      (isNaN(+history.xxxxxl) ? 0 : +history.xxxxxl) +
      (isNaN(+history.xxxxxxl) ? 0 : +history.xxxxxxl);

    const values2 = [
      history.product_id,
      history.product_name,
      +history.s,
      +history.m,
      +history.l,
      +history.xl,
      +history.xxl,
      +history.xxxl,
      +history.xxxxl,
      +history.xxxxxl,
      +history.xxxxxxl,
      totalStockDetails
    ];

    pool.query(addHistoryQuery, values, (error, results) => {
      if (error) {
        console.error('Error executing history query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('History added successfully:', values);

      // Now, execute the second query for details
      pool.query(addDetailsQuery, values2, (error2, results2) => {
        if (error2) {
          console.error('Error executing details query:', error2);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Details added successfully:', values2);

        res.json(results2);
      });
    });
  }
};

module.exports = { addHistory };
