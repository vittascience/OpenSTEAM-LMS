<?php

namespace Lti\Controller;

use User\Entity\User;
use Classroom\Controller\ControllerClassroom;
class ControllerLti extends ControllerClassroom{

   
    /* public function __construct($entityManager=null, $user=null){
        parent::__construct($entityManager=null, $user=null);
        $this->entityManager = $entityManager;
        $this->user = $user;
        $this->actions['get_all'] = function(){
            return array('msg'=> "c'est bon Nas");
        } ;
    } */
/*  public function __construct($entityManager=null, $user=null){
        parent::__construct($entityManager=null, $user=null);
        $this->entityManager = $entityManager;
        $this->user = $user;
        
    } */
    public function login(){
       /*  $users = $this->entityManager->getRepository(User::class)->findAll();
        $validatedData = $this->validateData($_POST,'connexion');
        dd($validatedData);
        dd($_SESSION); */
        
        echo json_encode(array(
            'message'=>$_POST,
            'test'=> 'testNAS'
        ));
        exit;
    }

    public function get_all(){
        echo json_encode(array('get_all'=> 'from LtiController'));
        exit;
    }
    
}