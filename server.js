const express = require("express");
const cors = require("cors");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const fibCache = new Map();

  app.get("/fib", (req, res) => {
    const number = req.query.n;

    if (isNaN(number) || number < 0) {
      return res.status(400).json({
        error: 'Query "n" must be a non-negative integer.',
      });
    }

    if (fibCache.has(number)) {
      const result = fibCache.get(number);
      return res.json({
        number: number,
        fibonacci: result,
      });
    }

    const worker = new Worker(__filename, {
      workerData: number,
    });

    worker.on("message", (result) => {
      fibCache.set(number, result);
      res.json({
        number: number,
        fibonacci: result,
      });
    });

    worker.on("error", (err) => {
      res.status(500).json({ error: "An error occurred during calculation." });
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} else {
  function fibonacci(n) {
    if (n < 2) {
      return BigInt(n);
    }

    let a = BigInt(0);
    let b = BigInt(1);
    let result = BigInt(0);

    for (let i = 2; i <= n; i++) {
      result = a + b;
      a = b;
      b = result;
    }
    return b;
  }

  const numberToCalculate = workerData;
  const result = fibonacci(numberToCalculate);

  parentPort.postMessage(result.toString());
}
