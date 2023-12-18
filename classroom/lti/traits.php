<?php

// The purpose of this function is to ease the customization for the domain provided as issuer by the platform
function getCurrentLtiDomain() {
    return $_SERVER["HTTP_HOST"];
}