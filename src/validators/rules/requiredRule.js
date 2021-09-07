import { required } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

export const requiredRule = extend('required', {
    ...required,
    message: 'This {_field_} is required'
});
