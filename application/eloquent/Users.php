<?php
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Created by PhpStorm.
 * User: Matthew
 * Date: 4/25/2017
 * Time: 2:06 PM
 */
class Users extends Model
{
    use SoftDeletes;
    public $table = "user";
    public $guarded = ['id', 'created_at', 'updated_at'];
    protected $hidden = ['password', 'updated_at'];
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    protected $casts = [
        'isActive' => 'boolean',
        'activated' => 'boolean'
    ];

    function getCreatedAtAttribute($value)
    {
        return Carbon::createFromFormat(Carbon::DEFAULT_TO_STRING_FORMAT, $value)->format(Carbon::ISO8601);
    }

    function getUpdatedAtAttribute($value)
    {
        return Carbon::createFromFormat(Carbon::DEFAULT_TO_STRING_FORMAT, $value)->format(Carbon::ISO8601);
    }

    public function role()
    {
        return $this->hasOne(Roles::class, 'id', 'roleId');
    }

    public function getPhotoAttribute($value)
    {
        return empty($value) ? 'avatar.jpg' : $value;
    }

    public function getNameAttribute()
    {
        return $this->firstName . " " . $this->lastName;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = sha1(md5($value));
    }
}