$(document).ready(function () {

    if($('.provider_dealer').length > 0){
        // $(".provider_dealer").on("change", function(event) {
        $(document).on('change', '.provider_dealer', function () {
            var companyGovId = $(this).val();
            var thisVal = $(this);
            $.request('onSubmitContactForm', {
                data : {
                    companyGovId : companyGovId
                },
                success:function(data){
                    if(data.success){
                        var record = data.data;
                        thisVal.closest('.partialFormSec').find('.provider_name').val(record.name);
                        thisVal.closest('.partialFormSec').find('.provider_contact').val(record.contactPersonName);
                        thisVal.closest('.partialFormSec').find('.provider_phone').val(record.phone);
                        thisVal.closest('.partialFormSec').find('.provider_email').val(record.Email);
                        thisVal.closest('.partialFormSec').find('.provider_phone_book').val(record.officephone);
                        thisVal.closest('.partialFormSec').find('.provider_website').val(record.website);
                        thisVal.closest('.partialFormSec').find(".provider_companyGovType option[value=" + record.companyGovType + "]").prop("selected",true);
                        // $('.provider_name').val(record.name);
                        // $('.provider_contact').val(record.contactPersonName);
                        // $('.provider_phone').val(record.phone);
                        // $('.provider_email').val(record.Email);
                        // $('.provider_phone_book').val(record.officephone);
                        // $('.provider_website').val(record.website);
                        // $(".provider_companyGovType option[value=" + record.companyGovType + "]").prop("selected",true);
                    }
                }
            });
        });
    }

    if($('.error-message').length > 0){
        setTimeout(function () {
            $('.error-message').fadeOut();
        }, 3000);
    }

    if($('#vat_amount').length > 0){
        $("#vat_amount").on("change", function() {
            var amount = $(this).val();
            var commisionVal = amount * 0.05;
            var textSec = amount+' x 0.05 = '+commisionVal;
            $('.commission-amount').text(textSec);
        });
    }

    if($('.addNewFormVendor').length > 0){
        // $('.addNewFormVendor').click(function(){
        //     var numerOfForm = $('.partialFormSec').length;
        //     $.request('onClickAppendForm', {
        //         data : {
        //             numerOfForm : numerOfForm
        //         },
        //         update: { supplier_form: '@.appendPartialForm' },
        //     });
        // });
    }   

    

});

