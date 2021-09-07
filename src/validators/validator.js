import Vue from 'vue'
import { ValidationProvider, configure, ValidationObserver  } from 'vee-validate';
import { localize } from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
import { requiredRule } from './rules/requiredRule'
import { minRule } from './rules/minRule'

export default() => {
    Vue.component('ValidationProvider', ValidationProvider);
    Vue.component('ValidationObserver', ValidationObserver);
    localize('zh_TW', TW);

    localize('requiredRule', requiredRule);
    localize('minRule', minRule);

    configure({
        classes: {
            valid: 'valid',
            invalid: 'invalid'
        },
        aria: true
    });
}
