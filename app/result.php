<?php
$PROJECTS=array(
#    0=>'---',
    1=>'/home/alexey/Desktop/Angelsaddons-locale/',
#    2=>'asasas'
);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: X-Requested-With, content-type');
header("ContentType: 'application/json; charset=utf-8'");
$ORIGINAL='locale/en/';
$CREATE='locale/ru/';
$newline="\r\n";
if ( isset($_POST['dir']) && isset($_POST['filename']) && isset($_POST['sectionname']) && isset($_POST['variablename']) && isset($_POST['ru']) ) {
 $did=(int)$_POST['dir'];
 if ( false === isset($PROJECTS[$did]) ) {
  header( 'HTTP/1.1 400 BAD REQUEST' );
  exit;
 };
 $file=$PROJECTS[$did].$CREATE.$_POST['filename'];
 if ( false === file_exists($file) ) {
  header( 'HTTP/1.1 400 BAD REQUEST' );
  exit;
 };
 $data=file($file);
 $search='['.$_POST['sectionname'].']';
 $var=false; $ok=true;
 $l=strlen($search);
 foreach ( $data as $i=>$str ) {
  if ( substr($str,0,$l) == $search ) {
   if ( $var ) {
    $data[$i]=$search.$_POST['ru'].$newline;
    $ok=true;
    break;
   }
   else {
    $search=$_POST['variablename'].'=';
    $l=strlen($search);
    $var=true;
   };
  }
  elseif ( $var && ( substr($str,0,1) == '[' )) {
   $data[$i]=$search.$_POST['ru'].$newline.$data[$i];
   $ok=true;
   break;
  };
 };
 if ( $ok ) { file_put_contents($file,implode($data,'')); };
 header('Status: 200 Ok');
 exit;
};

if ( isset($_GET['num']) ) {
 $num=(int)$_GET['num'];
 if ( $num < 0 ) { $num=''; };
}
else { $num=''; };
if ( isset($_GET['getdir']) ) {
//  get full data
 $num=(int)$_GET['getdir'];
 if ( false === isset($PROJECTS[$num]) ) {
  echo(json_encode(''));
 }
 else {
  $num=$PROJECTS[$num];
  if ( false === file_exists($num.$CREATE) ) {
//  mkdir
   mkdir($num.$CREATE);
  };
  $out=array();
  foreach( glob($num.$ORIGINAL.'*') as $file ) {
   $fname=basename($file);
   $section='';
   $newfile=$num.$CREATE.$fname;
   if ( false === file_exists($newfile) ) {
    copy($file,$newfile);
   };
   $out[$fname]=array();
   // eng file
   $data=file($file);
   foreach ( $data as $v ) {
    $v=trim($v);
    if ( $v == '' ) { continue; };
    if (( $v{0} == '[' ) && ( substr($v,-1) == ']' )) {
     $section=substr($v,1,-1);
     $out[$fname][$section]=array();
     continue;
    };
    $v=explode('=',$v,2);
    $v[0]=trim($v[0]); $v[1]=trim($v[1]);
    $out[$fname][$section][]=array('var'=>$v[0],'en'=>$v[1],'ru'=>'','status'=>1); //status?: 0: standart, 1: newline, 2: oldline
   };
   // ru file
   $section='';
   $data=file($newfile);
   $tmp=array();
   foreach ( $data as $i=>$v ) {
    $v=trim($v);
    if ( $v == '' ) { continue; };
    if (( $v{0} == '[' ) && ( substr($v,-1) == ']' )) {
     $section=substr($v,1,-1);
     if ( false === is_array($out[$fname][$section]) ) { $out[$fname][$section]=array(); };
     $tmp=$out[$fname][$section];
     continue;
    };
    $v=explode('=',$v,2);
    $v[0]=trim($v[0]); $v[1]=trim($v[1]);
    $ok=true;
    foreach($tmp as $i=>$s) {
     if ( $v[0] == $s['var'] ) {
      //add ru string:
      $out[$fname][$section][$i]['ru']=$v[1];
      $out[$fname][$section][$i]['status']=0; // status !
      $ok=false;
      break;
     };
    };
    if ( $ok ) {
     //old string
     $out[$fname][$section][]=array('var'=>$v[0],'en'=>'','ru'=>$v[1],'status'=>2); // status !
    };
   };
  };
  echo(json_encode($out));
 }
}
elseif ( isset($_GET['getlist']) ) {
// generate projects list
 $out=array();
 foreach( $PROJECTS as $i=>$v ) {
  $out[$i]=basename($v);
 };
 $out=json_encode($out);
 echo($out);
}
else {
// 

};
?>