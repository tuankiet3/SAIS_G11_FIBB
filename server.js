const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/option1", (req, res) => {
  const { n } = req.body;

  function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }
  const fibResult = fib(n);

  res.json({ result: fibResult });
});
// increase resource effciency.
// it stores the results of previously computed Fibonacci numbers in a memo object, which is passed along in recursive calls. This avoids redundant calculations, significantly reducing the time complexity, especially for larger values of n.
app.post("/option2", (req, res) => {
  const { n } = req.body;

  function fib(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
  }
  const fibResult = fib(n);

  res.json({ result: fibResult });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
