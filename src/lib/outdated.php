#!/usr/bin/php
<?php

$ignore = array(
  'sass-loader',
  'eslint'
);

$root = '/usr/apps/';
$dirs = scandir($root);
foreach ($dirs as $d) {
  $dir = $root . $d;
  if (is_dir($dir) && file_exists("${dir}/package.json")) {
    chdir($dir);
    $output = '';
    exec('npm outdated', $output, $retval);
    $outdated[$d] = array();
    for ($i = 1; $i < count($output); $i++) {
      $fields = preg_split("/[\s]+/", $output[$i]);
      if ($fields[0] != '' && !in_array($fields[0], $ignore)) {
        array_push($outdated[$d], $fields[0]);
      }
    }
  }
}

$f = fopen('/usr/apps/monitor/outdated.txt', 'w');
fwrite($f, json_encode($outdated));
fclose($f);
