import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Local Library</title>
      </head>
      <body>
        <h1>Welcome to the Local Library</h1>
        <div id="content"></div>
        <script>
          fetch('http://localhost:3001')
            .then(response => response.text())
            .then(html => {
              document.getElementById('content').innerHTML = html;
            })
            .catch(error => console.error('Error fetching content:', error));
        </script>
      </body>
    </html>
  `);
});

export default router;
