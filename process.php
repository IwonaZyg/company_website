<?php
  if (isset($_POST['email']))  {
  
    //Email information
    $admin_email = "slawomir@azacaba.com";
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $address = $_POST['address'];
    $address2 = $_POST['address2'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $message = $_POST['note'];
    
    //send email
    mail($admin_email, "New Form Submission from name:" . $name . ' - ' . $note . ' - ' . $phone, "From:" . $email);
    
    header('Location: index.html');
  }