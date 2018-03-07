<?php

/**
 * Created by PhpStorm.
 * User: Matthew
 * Date: 3/6/2017
 * Time: 2:20 AM
 */
use Illuminate\Database\Capsule\Manager as Capsule;

class EloquentHook
{
    protected $instance;

    private function setInstance()
    {
        $this->instance = &get_instance();
    }

    private function loadDatabase()
    {
        $this->instance->load->database();
    }

    private function getDB()
    {
        return $this->instance->db;
    }

    public function bootEloquent()
    {
        $this->setInstance();
        $this->loadDatabase();
        $config = $this->getDB();
        $capsule = new Capsule;
        $capsule->addConnection(array(
            'driver' => 'mysql',
            'host' => $config->hostname,
            'database' => $config->database,
            'username' => $config->username,
            'password' => $config->password,
            'charset' => $config->char_set,
            'collation' => $config->dbcollat,
            'prefix' => $config->dbprefix,
            'port' => $config->port,
            'engine' => 'InnoDB'
        ));
        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }
}