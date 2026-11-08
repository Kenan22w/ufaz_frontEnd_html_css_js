<?php
declare(strict_types=1);
header('Content-Type: text/html; charset=UTF-8');
$isSubmitted = ($_SERVER['REQUEST_METHOD'] === 'POST');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PW N5 - Submitted Form Data</title>
  <style>
    body {
      max-width: 760px;
      margin: 36px auto;
      padding: 0 20px;
      color: #243447;
      background-color: #f3f6fa;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
    }

    pre {
      overflow-x: auto;
      padding: 20px;
      border: 1px solid #cad8e6;
      border-radius: 8px;
      background-color: #ffffff;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  </style>
</head>
<body>
  <main>
    <h1>Submitted form data</h1>
    <?php if ($isSubmitted): ?>
      <p>The information below was received with the HTTP POST method and displayed using PHP <code>print_r()</code>.</p>
      <pre><?php echo htmlspecialchars(print_r($_POST, true), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); ?></pre>
    <?php else: ?>
      <p>No data was submitted. Please complete the form first.</p>
    <?php endif; ?>
    <p><a href="index.html">Return to the quiz</a></p>
  </main>
</body>
</html>
