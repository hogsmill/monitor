#!/usr/bin/php
<?php

$outdated = array();

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
      if ($fields[0] != '' && $fields[0] != 'sass-loader') {
        array_push($outdated[$d], $fields[0]);
      }
    }
  }
}

print_r(json_encode($outdated));
