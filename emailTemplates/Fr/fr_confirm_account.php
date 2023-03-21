<?php 
    $lms_color = isset($_ENV["LMS_COLOR"]) ? $_ENV["LMS_COLOR"] : "000";
    $lms_name = isset($_ENV["LMS_NAME"]) ? str_replace('"', ' ', $_ENV["LMS_NAME"]) : "OpenSTEAM-LMS";
?>


<!DOCTYPE html>
    <html>
    <head>
        <style type='text/css'>

            #bodyTable,
            #emailBody {
                font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
            }


            #bodyTable {
                color: #000;
                background-color: #<?php echo $lms_color; ?>80;
            }

            #emailContainer {
                margin: 10px;

                border-radius:10px;
                background-color: #fff;
                box-shadow: 0px 0px 10px #0000004D;
            }

            #emailFooter a {
                display: inline-block;
                text-align: center;
                margin: 10px 20px;
            }

            #emailFooter a img {
                object-fit: contain;
                display: block;
                width: 50px;
                height: 50px;
                margin: 0 auto;
            }

            .c-btn {
                -webkit-appearance: none !important;
                border-radius: 250em;
                font-weight: 600;
                border: 2px solid transparent;
                transition: all 0.15s ease-in-out;
                background-color: #<?php echo $lms_color; ?>;
                color: white !important;
                text-decoration: none;
                padding: 0.375rem 0.75rem;
                font-weight: bold;
                text-align: center;
                margin: 0 auto;
                display: block;
            }
        </style>
    </head>
    <body>
    <table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>
        <tr>
            <td align='center' valign='top'>
                <table border='0' cellpadding='20' cellspacing='0' width='600' id='emailContainer' style='box-shadow: 0px 0px 10px #0000004D;'>
                    <tr>
                        <td align='center' valign='top'>
                            <table border='0' cellpadding='5' cellspacing='0' width='100%' id='emailHeader'>
                                <tr>
                                    <td align='center' valign='top'>
                                        <h1><?php echo $lms_name; ?></h1>             
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align='center' valign='top'>
                            <table border='0' cellpadding='10' cellspacing='0' width='100%' id='emailBody'>
                                <tr>
                                    <td align='left' valign='top'>
                                        <?php echo  $body;?>
                                    </td>
                                </tr>
                                <tr>
                                    <td align='center' valign='top'>
                                        <span style='#<?php echo $lms_color;?>';\">L'équipe de <?php echo $lms_name; ?></span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    </body>
</html>