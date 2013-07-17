<?php
$body="Фамилия: ".$_POST['campaign_lastname']."\n";
$body.="Имя: ".$_POST['campaign_name']."\n";
$body.="Электронная почта: ".$_POST['campaign_email']."\n";
$body.="Контактный телефон: ".$_POST['campaign_phone']."\n";

//mail("example@example.com", "Заявка на карту", $body);

?>