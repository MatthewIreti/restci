<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: Matthew
 * Date: 4/23/2017
 * Time: 7:19 PM
 */
class Mailer
{
    /**
     * Mailer constructor.
     */
    public function __construct()
    {
        require_once ('PHPMailer/PHPMailerAutoload.php');
    }
}