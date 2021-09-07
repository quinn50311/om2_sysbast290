import { extend } from 'vee-validate';

export const minRule = extend('min', {
    validate(value, args) {
        return value.replace(/[^\x00-\xff]/g, "xx").length >= args.length
    },
    params: ['length'],
    message: '長度不能小於 {length}'
});
