#!/usr/bin/php
<?php

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
      $package = $fields[0];
      $current = $fields[1];
      $wanted = $fields[2];
      if ($package != '' && $current != $wanted) {
        array_push($outdated[$d], $fields[0]);
      }
    }
  }
}

$f = fopen('/usr/apps/monitor/outdated.txt', 'w');
fwrite($f, json_encode($outdated));
fclose($f);
