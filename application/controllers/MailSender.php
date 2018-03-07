<?php

/**
 * Created by PhpStorm.
 * User: Matthew
 * Date: 5/2/2017
 * Time: 9:18 AM
 */
class MailSender extends MY_Controller
{
    /**
     * MailSender constructor.
     */
    private $settings;

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        ob_clean();
        ignore_user_abort();
        ob_start();
        header('Connection: close');
        header('Content-length:' . ob_get_length());
        ob_end_flush();
        flush();
        sleep(2);
        $fields = fopen('php://input', 'r');
        $data = (object)json_decode(stream_get_contents($fields), true);
        $this->settings = Settings::find(1);
        $this->sendMail($data);

        //check if a mail is still sending if yes queue mail if no send
//        if ($this->session->has_userdata(Questone::mailSession)) {
//            if ($this->session->userdata(Questone::mailSession)) {
//                //queue mail
//                Mails::create($data);
//            } else {
//                $this->sendMail($data);
//            }
//        } else {
//        }

    }

    private function sendMail($data)
    {
        $this->session->set_userdata(Questone::mailSession, true);
        $to = explode(",", $data->recipient);
        foreach ($to as $rec) {
            $this->sendSingle($data, $rec);
        }
        //Check queue for unsent mails
        $this->checkQueue();
    }

    public function sendSingle($data, $recipient)
    {
        $subject = $data->subject;
        $cc = $data->cc;
        $bcc = $data->bcc;
        $attachment = $data->attachment;
        $message = $data->message;
        $this->load->library('mailer');
        $mail = new PHPMailer();
        $mail->ContentType = 'text/html';
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = $this->settings->mailEncryption;
        $mail->SMTPOptions = [
            $this->settings->mailEncryption => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_assigned' => true
            ]
        ];
        $mail->Host = $this->settings->mailHost;
        $mail->Port = $this->settings->mailPort;
        $mail->Username = $this->settings->mailUsername;
        $mail->Password = $this->settings->mailPassword;
        $mail->setFrom($this->settings->mailUsername, "QuestoneNG");
        $mail->Subject = $subject;
        if ($cc)
            $mail->addCC($cc);
        if ($bcc)
            $mail->addBCC($bcc);
        if ($attachment) {
            if (is_array($attachment)) {
                foreach ($attachment as $file) {
                    $mail->addAttachment($file);
                }
            } else {
                $mail->addAttachment($attachment);
            }
        }
        $mail->Body = $message;
        $mail->addAddress($recipient);
        $fp = fopen("log.txt", "w+");
        if (!$mail->send()) {
            //echo $mail->ErrorInfo;
            $this->session->set_userdata(Questone::mailSession, false);
            fwrite($fp, $mail->ErrorInfo . " mail not sent to " . $recipient);
        } else {
            fwrite($fp, " mail sent to " . $recipient);
            $this->session->set_userdata(Questone::mailSession, false);
            if (isset($data->id)) {
                //update status to sent
                Mails::where('id', $data->id)->update(['sent' => true]);
            }
        }
    }

    private function checkQueue()
    {
        $queue = Mails::where('sent', false)->orderBy('id', 'DESC')->get();
        if (count($queue) > 0) {
            $this->sendMail($queue[0]);
        }
    }
}