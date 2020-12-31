/* PAV Linting rules December 2020 */
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "no-undef": "off",
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always",
            { "omitLastInOneLineBlock": true }
        ],
        "space-before-blocks": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            {"anonymous": "never", "named": "never", "asyncArrow": "always"}
        ],
        "curly": [
          "error",
        ],
        "brace-style": [
          "error",
          "stroustrup",
          { "allowSingleLine": true }
        ],
        "space-in-parens": [
          "error",
          "always",
          { "exceptions": ["empty"] }
        ],
        "require-await": [
          "error",
        ],
        "prefer-const": [
          "error",
        ],
        "arrow-body-style": [
          "error",
          "as-needed"
        ],
        "comma-spacing": [
          "error",
          { "before": false, "after": true }
        ],
        "semi-spacing": [
          "error",
          {"before": false, "after": true}
        ],
        "func-call-spacing": [
          "error",
          "never"
        ],
        "comma-style": [
          "error",
          "last"
        ],
        "quote-props": [
          "error",
          "consistent-as-needed"
        ],
        // "no-magic-numbers": [
        //   "error",
        //   { "ignoreArrayIndexes": true, "detectObjects": true }
        // ],
        "callback-return": [
          "error",
        ],
        "global-require": [
          "error",
        ],
        "no-useless-return": [
          "error",
        ],
        "no-floating-decimal": [
          "error",
        ],
        "no-sequences": [
          "error",
        ],
        "no-return-await": [
          "error",
        ],
        "vars-on-top": [
          "error",
        ],
        "no-multiple-empty-lines": [
          "error",
          { "max": 1, "maxEOF": 1, "maxBOF": 1 }
        ],
        "lines-around-comment": [
          "error",
          { "beforeBlockComment": true }
        ],
        'no-trailing-spaces': [
          "error"
        ],
        // 'object-property-newline': [
        //   "error"
        // ],
        // "object-curly-newline": [
        //   "error",
        //   "always"
        // ],
        "object-curly-spacing": [
          "error",
          "always"
        ],
        "key-spacing": [
          "error",
          { "beforeColon": false, "afterColon": true, "mode": "strict" }
        ],
        "no-empty": [
          "error"
        ]
    }
};
