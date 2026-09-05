const express = require('express');
const router = express.Router();
const { formulas } = require('../data/store');

// GET /api/formulas - Get all extracted formulas
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: formulas.length,
    data: formulas
  });
});

// POST /api/formulas/calculate-fmax - Solve timing constraints & f_max
router.post('/calculate-fmax', (req, res) => {
  const { tcq, tcomb, tsetup } = req.body;

  if (typeof tcq !== 'number' || typeof tcomb !== 'number' || typeof tsetup !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'Invalid input. Please provide numbers for tcq, tcomb, and tsetup in nanoseconds.'
    });
  }

  const totalDelayNs = tcq + tcomb + tsetup;
  if (totalDelayNs <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Total critical path delay must be greater than zero.'
    });
  }

  // f_max in MHz = 1000 / totalDelayNs
  const fmaxMHz = parseFloat((1000 / totalDelayNs).toFixed(2));

  res.json({
    success: true,
    data: {
      tcq,
      tcomb,
      tsetup,
      totalDelayNs: parseFloat(totalDelayNs.toFixed(2)),
      fmaxMHz,
      formula: 'f_max <= 1 / (t_cq + t_comb + t_setup)',
      explanation: `With a critical path delay of ${totalDelayNs.toFixed(2)}ns, the maximum safe clock frequency without setup time violations is ${fmaxMHz} MHz.`
    }
  });
});

module.exports = router;
