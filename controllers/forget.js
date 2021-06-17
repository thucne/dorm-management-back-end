const Admin = require('../models/admin');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const { random, floor } = require('mathjs');
const mailgun = require('mailgun-js');
const dotenv = require('dotenv');

dotenv.config();

const html = (code, email) => {
    return `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->
    <title>IU Dormitory</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
    <meta name="format-detection" content="telephone=no" />
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,700,700i,900,900i"
        rel="stylesheet" />
    <!--<![endif]-->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100% !important;
            -ms-text-size-adjust: 100% !important;
            -webkit-font-smoothing: antialiased !important;
        }

        img {
            border: 0 !important;
            outline: none !important;
        }

        p {
            Margin: 0px !important;
            Padding: 0px !important;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0px;
            mso-table-rspace: 0px;
        }

        td,
        a,
        span {
            border-collapse: collapse;
            mso-line-height-rule: exactly;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        .em_blue a {
            text-decoration: none;
            color: #264780;
        }

        .em_grey a {
            text-decoration: none;
            color: #434343;
        }

        .em_white a {
            text-decoration: none;
            color: #ffffff;
        }

        @media only screen and (min-width:481px) and (max-width:649px) {
            .em_main_table {
                width: 100% !important;
            }

            .em_wrapper {
                width: 100% !important;
            }

            .em_hide {
                display: none !important;
            }

            .em_aside10 {
                padding: 0px 10px !important;
            }

            .em_h20 {
                height: 20px !important;
                font-size: 1px !important;
                line-height: 1px !important;
            }

            .em_h10 {
                height: 10px !important;
                font-size: 1px !important;
                line-height: 1px !important;
            }

            .em_aside5 {
                padding: 0px 10px !important;
            }

            .em_ptop2 {
                padding-top: 8px !important;
            }
        }

        @media only screen and (min-width:375px) and (max-width:480px) {
            .em_main_table {
                width: 100% !important;
            }

            .em_wrapper {
                width: 100% !important;
            }

            .em_hide {
                display: none !important;
            }

            .em_aside10 {
                padding: 0px 10px !important;
            }

            .em_aside5 {
                padding: 0px 8px !important;
            }

            .em_h20 {
                height: 20px !important;
                font-size: 1px !important;
                line-height: 1px !important;
            }

            .em_h10 {
                height: 10px !important;
                font-size: 1px !important;
                line-height: 1px !important;
            }

            .em_font_11 {
                font-size: 12px !important;
            }

            .em_font_22 {
                font-size: 22px !important;
                line-height: 25px !important;
            }

            .em_w5 {
                width: 7px !important;
            }

            .em_w150 {
                width: 150px !important;
                height: auto !important;
            }

            .em_ptop2 {
                padding-top: 8px !important;
            }

            u+.em_body .em_full_wrap {
                width: 100% !important;
                width: 100vw !important;
            }
        }

        @media only screen and (max-width:374px) {
            .em_main_table {
                width: 100% !important;
            }

            .em_wrapper {
                width: 100% !important;
            }

            .em_hide {
                display: none !important;
            }

            .em_aside10 {
                padding: 0px 10px !important;
            }

            .em_aside5 {
                padding: 0px 8px !important;
            }

            .em_h20 {
                height: 20px !important;
                font-size: 1px !important;
                line-height: 1px !important;
            }

            .em_h10 {
                height: 10px !important;
                font-size: 1px !important;
                line-height: 1px !important;
            }

            .em_font_11 {
                font-size: 11px !important;
            }

            .em_font_22 {
                font-size: 22px !important;
                line-height: 25px !important;
            }

            .em_w5 {
                width: 5px !important;
            }

            .em_w150 {
                width: 150px !important;
                height: auto !important;
            }

            .em_ptop2 {
                padding-top: 8px !important;
            }

            u+.em_body .em_full_wrap {
                width: 100% !important;
                width: 100vw !important;
            }
        }
    </style>
    <script>
        function copyToClipboard(element) {
            // create hidden text element, if it doesn't already exist
            var range, selection, worked;

            if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            try {
                document.execCommand('copy');
                alert('text copied');
            } catch (err) {
                alert('unable to copy text');
            }
        }
    </script>
</head>

<body class="em_body" style="margin:0px auto; padding:0px;" bgcolor="#efefef">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center"
        bgcolor="#efefef">
        <tr>
            <td align="center" valign="top">
                <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table"
                    style="width:650px; table-layout:fixed;">
                    <tr>
                        <td align="center" valign="top" style="padding:0 25px;" class="em_aside10">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                                <tr>
                                    <td height="25" style="height:25px;" class="em_h20">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top"><a href="https://iu-dormitory.fun/" target="_blank"
                                            style="text-decoration:none;"><img
                                                src="https://res.cloudinary.com/katyperrycbt/image/upload/v1623926577/IU_Dormitory_page-0001_1_cqzjex.jpg"
                                                height="100" width="auto" alt="meowgun" border="0"
                                                style="display: block;font-family:Arial, sans-serif; font-size:18px; line-height:25px; text-align:center; color:#1d4685; font-weight:bold;"
                                                class="em_w150" /></a></td>
                                </tr>
                                <tr>
                                    <td height="28" style="height:28px;" class="em_h20">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center"
        bgcolor="#efefef">
        <tr>
            <td align="center" valign="top" class="em_aside5">
                <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table"
                    style="width:650px; table-layout:fixed;">
                    <tr>
                        <td align="center" valign="top" style="padding:0 25px; background-color:#ffffff;"
                            class="em_aside10">
                            <table width="100%" border="0" cellspacing="2" cellpadding="0" align="center">
                                <tr>
                                    <td height="45" style="height:45px;" class="em_h20">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td class="em_blue em_font_22" align="center" valign="top"
                                        style="font-family: Arial, sans-serif; font-size: 26px; line-height: 29px; color:#264780; font-weight:bold;">
                                        Here are your authentication code</td>
                                </tr>
                                <tr>
                                    <td height="14" style="height:14px; font-size:0px; line-height:0px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td class="em_grey" align="center" valign="top"
                                        style="font-family: Arial, sans-serif; font-size: 16px; line-height: 26px; color:#434343;">
                                        Please enter it in the web inquiry box to continue
                                </tr>
                                <tr>
                                    <td height="26" style="height:26px;" class="em_h20">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top">
                                        <table width="250"
                                            style="width:250px; background-color:#6bafb2; border-radius:4px;" border="0"
                                            cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td class="em_white" height="30" align="center" valign="middle"
                                                    style="font-family: Arial, sans-serif; font-size: 16px; color:#ffffff; font-weight:bold; height:42px;">
                                                    <h4 id='copi' onclick="copyToClipboard(this)"
                                                        style="text-decoration:none; color:#ffffff; line-height:42px; display:block; cursor: pointer; padding: 0; margin: 0;">
                                                        ${code} 
                                                    </h4>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top">
                                        <table width="250"
                                            style="width:250px; background-color:#6bafb2; border-radius:4px;" border="0"
                                            cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td class="em_white" height="30" align="center" valign="middle"
                                                    style="font-family: Arial, sans-serif; font-size: 16px; color:#ffffff; font-weight:bold; height:42px;">
                                                    <a href='https://iu-dormitory.fun/login?recovery=${code}&email=${email}' id='copi' onclick="copyToClipboard(this)"
                                                        style="text-decoration:none; color:#ffffff; line-height:42px; display:block; cursor: pointer; padding: 0; margin: 2 0 0 0;">
                                                        Or click here
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="25" style="height:25px;" class="em_h20">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td class="em_grey" align="center" valign="top"
                                        style="font-family: Arial, sans-serif; font-size: 16px; line-height: 26px; color:#434343;">
                                        If you didn&rsquo;t request a verification code, you don&rsquo;t have to do
                                        anything.<br class="em_hide" />
                                        Just ignore this email the way your cat ignores&nbsp;you.</td>
                                </tr>
                                <tr>
                                    <td height="44" style="height:44px;" class="em_h20">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center"
        bgcolor="#efefef">
        <tr>
            <td align="center" valign="top">
                <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table"
                    style="width:650px; table-layout:fixed;">
                    <tr>
                        <td align="center" valign="top" style="padding:0 25px;" class="em_aside10">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                                <tr>
                                    <td height="40" style="height:40px;" class="em_h20">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top">
                                        <table border="0" cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td width="30" style="width:30px;" align="center" valign="middle"><a
                                                        href="https://www.facebook.com/thuc.katy/" target="_blank" style="text-decoration:none;"><img
                                                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1619191270/tkjzcmb5eilakxregpe8.png" width="30"
                                                            height="30" alt="Fb" border="0"
                                                            style="display:block; font-family:Arial, sans-serif; font-size:18px; line-height:25px; text-align:center; color:#000000; font-weight:bold; max-width:30px;" /></a>
                                                </td>
                                                <td width="12" style="width:12px;">&nbsp;</td>
                                                <td width="30" style="width:30px;" align="center" valign="middle"><a
                                                        href="https://www.facebook.com/thuc.katy/" target="_blank" style="text-decoration:none;"><img
                                                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1623931891/twitter_bbvh0p.png" width="30"
                                                            height="30" alt="Tw" border="0"
                                                            style="display:block; font-family:Arial, sans-serif; font-size:14px; line-height:25px; text-align:center; color:#000000; font-weight:bold; max-width:30px;" /></a>
                                                </td>
                                                <td width="12" style="width:12px;">&nbsp;</td>
                                                <td width="30" style="width:30px;" align="center" valign="middle"><a
                                                        href="https://www.instagram.com/invites/contact/?i=m3lml5y6h2j2&utm_content=qx4ldz" target="_blank" style="text-decoration:none;"><img
                                                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1623931891/instagram_xtdarw.png" width="30"
                                                            height="30" alt="Insta" border="0"
                                                            style="display:block; font-family:Arial, sans-serif; font-size:14px; line-height:25px; text-align:center; color:#000000; font-weight:bold; max-width:30px;" /></a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="16" style="height:16px; font-size:1px; line-height:1px; height:16px;">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td class="em_grey" align="center" valign="top"
                                        style="font-family: Arial, sans-serif; font-size: 15px; line-height: 18px; color:#434343; font-weight:bold;">
                                        Problems or questions?</td>
                                </tr>
                                <tr>
                                    <td height="10" style="height:10px; font-size:1px; line-height:1px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" style="font-size:0px; line-height:0px;">
                                        <table border="0" cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td width="15" align="left" valign="middle"
                                                    style="font-size:0px; line-height:0px; width:15px;"><a
                                                        href="mailto:katyperrycbt@gmail.com"
                                                        style="text-decoration:none;"><img
                                                            src="/assets/pilot/images/templates/email_img.png"
                                                            width="15" height="12" alt="" border="0"
                                                            style="display:block; max-width:15px;" /></a></td>
                                                <td width="9" style="width:9px; font-size:0px; line-height:0px;"
                                                    class="em_w5"><img src="/assets/pilot/images/templates/spacer.gif"
                                                        width="1" height="1" alt="" border="0" style="display:block;" />
                                                </td>
                                                <td class="em_grey em_font_11" align="left" valign="middle"
                                                    style="font-family: Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;">
                                                    <a href="mailto:katyperrycbt@gmail.com"
                                                        style="text-decoration:none; color:#434343;">Mail to us: katyperrycbt@gmail.com</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="9" style="font-size:0px; line-height:0px; height:9px;" class="em_h10">
                                        <img src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt=""
                                            border="0" style="display:block;" /></td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top">
                                        <table border="0" cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td width="12" align="left" valign="middle"
                                                    style="font-size:0px; line-height:0px; width:12px;"><a href="#"
                                                        target="_blank" style="text-decoration:none;"><img
                                                            src="/assets/pilot/images/templates/img_1.png" width="12"
                                                            height="16" alt="" border="0"
                                                            style="display:block; max-width:12px;" /></a></td>
                                                <td width="7" style="width:7px; font-size:0px; line-height:0px;"
                                                    class="em_w5">&nbsp;</td>
                                                <td class="em_grey em_font_11" align="left" valign="middle"
                                                    style="font-family: Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;">
                                                    <a href="#" target="_blank"
                                                        style="text-decoration:none; color:#434343;">IU Dormitory</a> &bull;
                                                    Block 6, Linh Trung Ward &bull; Thu Duc City, VN 700000</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="35" style="height:35px;" class="em_h20">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="1" bgcolor="#dadada" style="font-size:0px; line-height:0px; height:1px;"><img
                                src="/assets/pilot/images/templates/spacer.gif" width="1" height="1" alt="" border="0"
                                style="display:block;" /></td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" style="padding:0 25px;" class="em_aside10">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                                <tr>
                                    <td height="16" style="font-size:0px; line-height:0px; height:16px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top">
                                        <table border="0" cellspacing="0" cellpadding="0" align="left"
                                            class="em_wrapper">
                                            <tr>
                                                <td class="em_grey" align="center" valign="middle"
                                                    style="font-family: Arial, sans-serif; font-size: 11px; line-height: 16px; color:#434343;">
                                                    &copy; IU Dormitory 2021 &nbsp;
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="16" style="font-size:0px; line-height:0px; height:16px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="em_hide" style="line-height:1px;min-width:650px;background-color:#efefef;"><img
                                alt="" src="/assets/pilot/images/templates/spacer.gif" height="1" width="650"
                                style="max-height:1px; min-height:1px; display:block; width:650px; min-width:650px;"
                                border="0" /></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`
}

const handleSendEmail = (data) => {
    const mg = mailgun({ apiKey: process.env.REACT_APP_MAILGUN, domain: process.env.REACT_APP_MAILGUN_URL });
    console.log('email sendinnngg')
    mg.messages().send({
        ...data, function(error, body) {
            console.log(error);
            console.log(body);
            console.log('email sent')
        }
    });
}

exports.forgetPassword = async (req, res) => {
    const email = req.body.email;

    Admin.findOne({ email: email }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            })
        }
        if (result == null) {
            Student.findOne({ email: email }).exec((err, result_student) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                if (result_student == null) {
                    return res.status(400).json({
                        error: "Email do not exist"
                    })
                }
                else {

                    if (result_student.recovery_code != "") {
                        const prepareEmail = {
                            from: 'IU Dormitory <no-reply@iu-dormitory.fun>',
                            to: email,
                            subject: '[Recovery Code] Here are your recovery code',
                            html: html(result_student.recovery_code, email)
                        }
        
                        handleSendEmail(prepareEmail);
                        return res.json({msg: 'Code sent!'})
                    }
                    else {
                        var code = '';
                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for (var i = 0; i < 10; i++) {
                            code += characters.charAt(floor(random() * charactersLength));
                        }
                        const filter = { email: email };
                        const update = { recovery_code: code };
                        Student.findOneAndUpdate(filter, update, (error, doc) => {
                            if (error) {
                                return res.status(400).json({
                                    error: error.msg
                                })
                            }
                            else {
                                const prepareEmail = {
                                    from: 'IU Dormitory <no-reply@iu-dormitory.fun>',
                                    to: email,
                                    subject: '[Recovery Code] Here are your recovery code',
                                    html: html(code, email)
                                }
                
                                handleSendEmail(prepareEmail);
                                return res.json({msg: 'Code sent!'})
                            }
                            // error: any errors that occurred
                            // doc: the document before updates are applied if new: false, or after updates if new = true
                        });

                    }
                }
            })
        }
        else {
            if (result.recovery_code != "") {
                console.log(email);
                const prepareEmail = {
                    from: 'IU Dormitory <no-reply@iu-dormitory.fun>',
                    to: email,
                    subject: '[Recovery Code] Here are your recovery code',
                    html: html(result.recovery_code, email)
                }

                handleSendEmail(prepareEmail);
                return res.json({msg: 'Code sent!'})
            }
            else {
                var code = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < 10; i++) {
                    code += characters.charAt(floor(random() * charactersLength));
                }
                result.recovery_code = code;
                result.save((err, newuser) => {
                    if (err) {
                        console.log("kde");
                        return res.status(400).json({
                            error: err.message
                        })
                    }

                    const prepareEmail = {
                        from: 'IU Dormitory <no-reply@iu-dormitory.fun>',
                        to: email,
                        subject: '[Recovery Code] Here are your recovery code',
                        html: html(newuser.recovery_code, email)
                    }

                    handleSendEmail(prepareEmail);

                    return res.json({msg: 'Code sent!'})
                })

            }
        }
    })
}
exports.checkCode = async (req, res) => {
    const code = req.body.code;
    Admin.findOne({ recovery_code: code }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (!result) {
            Student.findOne({ recovery_code: code }).exec((err, result_student) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                if (!result_student) {
                    return res.status(400).json({
                        error: "Your code is wrong , try again"
                    })
                }

                return res.json(result_student.email)

            })
        }
        else {

            return res.json(result.email);
        }

    })
};
exports.updatePassword = async (req, res) => {
    const {email,code,newPassword} = req.body;
    Admin.findOne({recovery_code:code,email:email}).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		if(result==null)
		{
			Student.findOne({recovery_code:code,email:email}).exec((err, result_student) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                if(result_student==null)
                {
                    return res.status(400).json({
                        error: "Can not found code"
                    })
                }
                else
                {
                    var hashPassword = bcrypt.hashSync(String(newPassword).trim(), 10);
                    const filter = { email: email , recovery_code:code };
                    const update = { recovery_code:'',password:hashPassword };
                    Student.findOneAndUpdate(filter, update, (error, doc) => {
                        if(error)
                        {
                            return res.status(400).json({
                                error: error.msg
                            })
                        }
                        else
                        {
                            return res.json({msg:"Update Successfully",role:0})
                        }
                        // error: any errors that occurred
                        // doc: the document before updates are applied if new: false, or after updates if new = true
                      });

                }
            
            })
		}
        else
        {

            result.password=bcrypt.hashSync(String(newPassword).trim(), 10);
            result.recovery_code="";
            result.save((err, ans) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json({msg:"Update Successfully",role:1})
            })

        }
	
	})
};